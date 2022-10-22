package convert3mf

import (
	"os"
	"path/filepath"
	"strings"

	"github.com/hpinc/go3mf"
	"github.com/hpinc/go3mf/importer/stl"
)

type Convert3mf struct{}

type status struct {
	Success bool
	Message string
}

func (c *Convert3mf) ConvertMany(path string, files []string, outputDir string) map[string]status {

	result := make(map[string]status)

	for _, f := range files {
		basename := strings.TrimSuffix(f, filepath.Ext(f))
		input := filepath.Join(path, f)
		output := filepath.Join(outputDir, basename+".3mf")

		model := new(go3mf.Model)
		r, err := os.Open(input)
		if err != nil {
			result[f] = status{false, err.Error()}
			break
		}
		d := stl.NewDecoder(r)
		err = d.Decode(model)
		if err != nil {
			result[f] = status{false, err.Error()}
			break
		}
		r.Close()
		w, err := go3mf.CreateWriter(output)
		if err != nil {
			result[f] = status{false, err.Error()}
			break
		}
		err = w.Encode(model)
		if err != nil {
			result[f] = status{false, err.Error()}
			break
		}
		w.Close()
		result[f] = status{true, "converted successfully"}
	}
	return result
}

func (c *Convert3mf) Convert(input string, output string) (err error) {
	model := new(go3mf.Model)

	r, err := os.Open(input)
	if err != nil {
		return
	}

	d := stl.NewDecoder(r)
	d.Decode(model)
	if err != nil {
		return
	}
	r.Close()

	w, _ := go3mf.CreateWriter(output + ".3mf")
	w.Encode(model)
	w.Close()

	return
}
