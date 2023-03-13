package manifest

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"

	"github.com/bmatcuk/doublestar/v4"
)

type Manifest struct{}

type attrInstance struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type tagConfig struct {
	Clear   bool     `json:"clear"`
	Include []string `json:"include"`
	Exclude []string `json:"exclude"`
}

type attrConfig struct {
	Clear   bool           `json:"clear"`
	Include []attrInstance `json:"include"`
	Exclude []string       `json:"exclude"`
}

type iManifestV1 struct {
	Include []string `json:"include"`
	Exclude []string `json:"exclude"`
	Notes   string   `json:"notes"`
}

type iManifestV2 struct {
	Scancfg struct {
		Active           bool `json:"active"`
		Automodeltype    int  `json:"automodeltype"`
		Automodelcontent int  `json:"automodelcontent"`
	} `json:"scancfg"`
	ModelMeta struct {
		Name  *string  `json:"name"`
		Notes string   `json:"notes"`
		Tags  []string `json:"tags"`
		Cover *string  `json:"cover"`
	} `json:"modelmeta"`
}

type scanCfgV3 struct {
	ModelMode int      `json:"modelmode"`
	FileMode  int      `json:"fileMode"`
	FileTypes []int    `json:"filetypes"`
	IfLeaf    bool     `json:"ifLeaf"`
	Include   []string `json:"include"`
	Exclude   []string `json:"exclude"`
	ClearTags bool     `json:"cleartags"`
}

type modelMetaV3 struct {
	Name        *string  `json:"name"`
	Notes       string   `json:"notes"`
	Tags        []string `json:"tags"`
	Cover       *string  `json:"cover"`
	Collections []string `json:"collections"`
}

type iManifestV3 struct {
	Version   int         `json:"version"`
	Scancfg   scanCfgV3   `json:"scancfg"`
	ModelMeta modelMetaV3 `json:"modelmeta"`
}

type scanCfgV4 struct {
	ModelMode  int        `json:"modelmode"`
	FileMode   int        `json:"fileMode"`
	FileTypes  []int      `json:"filetypes"`
	IfLeaf     bool       `json:"ifLeaf"`
	Tags       tagConfig  `json:"tags"`
	Attributes attrConfig `json:"attributes"`
}

type modelMetaV4 struct {
	Name        *string        `json:"name"`
	Notes       string         `json:"notes"`
	Tags        []string       `json:"tags"`
	Cover       *string        `json:"cover"`
	Collections []string       `json:"collections"`
	Attributes  []attrInstance `json:"attributes"`
}

type iManifestV4 struct {
	Version   int         `json:"version"`
	Scancfg   scanCfgV4   `json:"scancfg"`
	ModelMeta modelMetaV4 `json:"modelmeta"`
}

type scanCfgV5 struct {
	ModelMode   int        `json:"modelmode"`
	FileMode    int        `json:"fileMode"`
	FileTypes   []int      `json:"filetypes"`
	IfLeaf      bool       `json:"ifLeaf"`
	Tags        tagConfig  `json:"tags"`
	Attributes  attrConfig `json:"attributes"`
	Propagation int        `json:"propagation"`
}

type modelMetaV5 struct {
	Name        *string        `json:"name"`
	Notes       string         `json:"notes"`
	Tags        []string       `json:"tags"`
	Cover       *string        `json:"cover"`
	Collections []string       `json:"collections"`
	Attributes  []attrInstance `json:"attributes"`
}

type iManifestV5 struct {
	Version   int         `json:"version"`
	Scancfg   scanCfgV5   `json:"scancfg"`
	ModelMeta modelMetaV5 `json:"modelmeta"`
}

type unknownManifest struct {
	Version int `json:"version"`
}

func (c *Manifest) GetAllManifests(root string) (map[string]iManifestV5, error) {
	return GetAllManifests(root)
}

func GetAllManifests(root string) (map[string]iManifestV5, error) {
	fsys := os.DirFS(root)
	var result = make(map[string]iManifestV5)
	err := doublestar.GlobWalk(fsys, "**/{user.json,config.orynt3d}", func(mPath string, d fs.DirEntry) error {
		var nPath = filepath.Join(root, filepath.Dir(mPath))
		m, err := ReadManifest(nPath)
		if err != nil {
			fmt.Println(err)
			return err
		}
		result[nPath] = *m
		return nil
	})
	if err != nil {
		return result, err
	}
	return result, nil
}

func (c *Manifest) MigrateManifests(root string) ([]string, error) {
	fsys := os.DirFS(root)
	result := []string{}
	err := doublestar.GlobWalk(fsys, "**/user.json", func(mPath string, d fs.DirEntry) error {
		content, err := fs.ReadFile(fsys, mPath)
		var nPath = filepath.Join(root, filepath.Dir(mPath))
		if err != nil {
			fmt.Println(err)
			return err
		}
		m, err := toLatestManifest(content)
		if err != nil {
			fmt.Println(err)
			return err
		}
		err = WriteManifest(nPath, *m)
		if err != nil {
			fmt.Println(err)
			return err
		}
		err = os.Remove(filepath.Join(root, mPath))
		if err != nil {
			fmt.Println(err)
			return err
		}
		result = append(result, mPath)
		return nil
	})
	if err != nil {
		return []string{}, err
	}
	return result, nil
}

func ReadManifest(root string) (*iManifestV5, error) {
	fsys := os.DirFS(root)
	content, err := fs.ReadFile(fsys, "config.orynt3d")
	if err != nil {
		content, err = fs.ReadFile(fsys, "user.json")
		if err != nil {
			return nil, err
		}
	}
	return toLatestManifest(content)
}

func (c *Manifest) ReadManifest(root string) (*iManifestV5, error) {
	return ReadManifest(root)
}

func WriteManifest(root string, manifest iManifestV5) error {
	newjson, err := json.Marshal(manifest)
	if err != nil {
		return err
	}
	err = os.WriteFile(filepath.Join(root, "config.orynt3d"), []byte(newjson), 0644)
	if err != nil {
		return err
	}
	return nil
}

func (c *Manifest) WriteManifest(root string, manifest iManifestV5) error {
	return WriteManifest(root, manifest)
}

func toLatestManifest(content []byte) (*iManifestV5, error) {
	var temp unknownManifest
	err := json.Unmarshal(content, &temp)
	if err != nil {
		return nil, err
	}
	if temp.Version == 0 {
		var v1 iManifestV1
		err = json.Unmarshal(content, &v1)
		if err != nil {
			return nil, err
		}
		res := v1toLatest(v1)
		return &res, nil
	}
	if temp.Version == 2 {
		var v2 iManifestV2
		err = json.Unmarshal(content, &v2)
		if err != nil {
			return nil, err
		}
		res := v2toLatest(v2)
		return &res, nil
	}
	if temp.Version == 3 {
		var v3 iManifestV3
		err = json.Unmarshal(content, &v3)
		if err != nil {
			return nil, err
		}
		res := v3toLatest(v3)
		return &res, nil
	}
	if temp.Version == 4 {
		var v4 iManifestV4
		err = json.Unmarshal(content, &v4)
		if err != nil {
			return nil, err
		}
		res := v4toLatest(v4)
		return &res, nil
	}
	if temp.Version == 5 {
		var v5 iManifestV5
		err = json.Unmarshal(content, &v5)
		if err != nil {
			return nil, err
		}
		return &v5, nil
	}
	return nil, errors.New("unknown version")
}

func v1toLatest(input iManifestV1) iManifestV5 {
	var res = defaultManifest()
	res.Scancfg.Tags.Include = input.Include
	res.Scancfg.Tags.Exclude = input.Exclude
	res.ModelMeta.Notes = input.Notes
	return res
}

func v2toLatest(input iManifestV2) iManifestV5 {
	var res = defaultManifest()

	res.ModelMeta.Name = input.ModelMeta.Name
	res.ModelMeta.Notes = input.ModelMeta.Notes
	res.ModelMeta.Tags = input.ModelMeta.Tags
	res.ModelMeta.Cover = input.ModelMeta.Cover
	res.ModelMeta.Collections = []string{}

	if input.Scancfg.Active {
		res.Scancfg.ModelMode = 2
	}
	switch input.Scancfg.Automodeltype {
	case 0:
		res.Scancfg.ModelMode = 1
	case 1:
		res.Scancfg.ModelMode = 2
		res.Scancfg.IfLeaf = false
	case 2:
		res.Scancfg.ModelMode = 2
		res.Scancfg.IfLeaf = true
	}
	switch input.Scancfg.Automodelcontent {
	case 0:
		res.Scancfg.FileTypes = []int{}
	case 1:
		res.Scancfg.FileTypes = []int{1}
	case 2:
		res.Scancfg.FileTypes = []int{0, 1}
	}
	return res
}

func v3toLatest(input iManifestV3) iManifestV5 {
	var res = defaultManifest()

	res.Scancfg.ModelMode = input.Scancfg.ModelMode
	res.Scancfg.FileMode = input.Scancfg.FileMode
	res.Scancfg.FileTypes = input.Scancfg.FileTypes
	res.Scancfg.IfLeaf = input.Scancfg.IfLeaf

	res.ModelMeta.Name = input.ModelMeta.Name
	res.ModelMeta.Notes = input.ModelMeta.Notes
	res.ModelMeta.Tags = input.ModelMeta.Tags
	res.ModelMeta.Cover = input.ModelMeta.Cover
	res.ModelMeta.Collections = input.ModelMeta.Collections

	res.Scancfg.Attributes = attrConfig{
		Include: []attrInstance{},
		Exclude: []string{},
		Clear:   false,
	}
	res.ModelMeta.Attributes = []attrInstance{}
	res.Scancfg.Tags = tagConfig{
		Include: input.Scancfg.Include,
		Exclude: input.Scancfg.Exclude,
		Clear:   input.Scancfg.ClearTags,
	}
	return res
}

func v4toLatest(input iManifestV4) iManifestV5 {
	var res = defaultManifest()
	res.Scancfg.Attributes = input.Scancfg.Attributes
	res.Scancfg.Tags = input.Scancfg.Tags
	res.Scancfg.FileMode = input.Scancfg.FileMode
	res.Scancfg.FileTypes = input.Scancfg.FileTypes
	res.Scancfg.ModelMode = input.Scancfg.ModelMode
	res.Scancfg.IfLeaf = input.Scancfg.IfLeaf
	res.ModelMeta = modelMetaV5(input.ModelMeta)
	return res
}

func defaultManifest() iManifestV5 {
	return iManifestV5{
		Version: 5,
		Scancfg: scanCfgV5{
			ModelMode:   0,
			FileMode:    0,
			FileTypes:   []int{1},
			IfLeaf:      false,
			Tags:        tagConfig{Include: []string{}, Exclude: []string{}, Clear: false},
			Attributes:  attrConfig{Include: []attrInstance{}, Exclude: []string{}, Clear: false},
			Propagation: 0,
		},
		ModelMeta: modelMetaV5{
			Name:        nil,
			Notes:       "",
			Tags:        []string{},
			Cover:       nil,
			Collections: []string{},
			Attributes:  []attrInstance{},
		},
	}
}

func contains(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}

	return false
}
