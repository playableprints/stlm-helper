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

func (c *Convert3mf) ConvertMany(root string, files []string, outputDir string) map[string]status {

	result := make(map[string]status)

	for _, f := range files {
		basename := strings.TrimSuffix(f, filepath.Ext(f))
		input := filepath.Join(root, f)
		output := filepath.Join(outputDir, basename)

		lerr := c.Convert(input, output)
		if lerr != nil {
			result[f] = status{false, lerr.Error()}
		} else {
			result[f] = status{true, "converted successfully"}
		}
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
