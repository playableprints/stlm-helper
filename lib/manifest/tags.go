package manifest

import (
	"encoding/json"
	"io/fs"
	"os"
	"path/filepath"
	"regexp"

	"github.com/bmatcuk/doublestar/v4"
	"github.com/tidwall/sjson"
)

type Tags struct{}

type status struct {
	From string
	To   string
	In   string
}

func contains(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}

	return false
}

func (c *Tags) PreviewReplace(tags []string, match string, replace string) (map[string]string, error) {
	result := make(map[string]string)
	r, err := regexp.Compile(match)
	if err != nil {
		return result, err
	}
	for _, t := range tags {
		result[t] = t
		result[t] = r.ReplaceAllString(t, replace)
	}
	return result, err
}

func (c *Tags) ReplaceTags(root string, match string, replace string, include []string) ([]status, error) {
	result := make([]status, 0)
	tags, err := c.FindTags(root)
	if err != nil {
		return result, err
	}
	repl, err := c.PreviewReplace(tags, match, replace)
	if err != nil {
		return result, err
	}
	toChange := make(map[string]string, len(tags))
	if len(include) == 0 {
		toChange = repl
	} else {
		for _, t := range include {
			if contains(include, t) {
				toChange[t] = repl[t]
			}
		}
	}
	if err != nil {
		return result, err
	}
	fsys := os.DirFS(root)
	err = doublestar.GlobWalk(fsys, "**/user.json", func(mPath string, d fs.DirEntry) error {
		content, err := fs.ReadFile(fsys, mPath)
		changed := false
		nPath := filepath.Join(root, mPath)
		if err != nil {
			return err
		}
		var payload IManifest
		err = json.Unmarshal(content, &payload)
		if err != nil {
			return err
		}
		for i, t := range payload.Scancfg.Include {
			if val, ok := toChange[t]; ok {
				if val != t {
					changed = true
					payload.Scancfg.Include[i] = val
					res := status{t, val, nPath + ":scancfg.include"}
					result = append(result, res)
				}
			}
		}
		for i, t := range payload.Modelmeta.Tags {
			if val, ok := toChange[t]; ok {
				if val != t {
					changed = true
					payload.Modelmeta.Tags[i] = val
					res := status{t, val, nPath + ":modelmeta.tags"}
					result = append(result, res)
				}
			}
		}
		if changed {
			newjson, _ := sjson.Set(string(content), "scancfg.include", payload.Scancfg.Include)
			newjson, _ = sjson.Set(newjson, "modelmeta.tags", payload.Modelmeta.Tags)
			err = os.WriteFile(nPath, []byte(newjson), 0644)
			return err
		}
		return nil
	})
	return result, err
}

func (c *Tags) FindTags(root string) ([]string, error) {
	fsys := os.DirFS(root)
	tags := make([]string, 1)

	err := doublestar.GlobWalk(fsys, "**/user.json", func(mPath string, d fs.DirEntry) error {
		content, err := fs.ReadFile(fsys, mPath)
		if err != nil {
			return err
		}
		var payload IManifest
		err = json.Unmarshal(content, &payload)
		if err != nil {
			return err
		}
		tags = append(tags, payload.Scancfg.Include...)
		tags = append(tags, payload.Modelmeta.Tags...)
		return nil
	})

	return tags, err
}
