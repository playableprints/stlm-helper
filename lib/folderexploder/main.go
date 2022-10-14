package folderexploder

import (
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

type Exploder struct{}

type status struct {
	Success bool
	Message string
}

func (e *Exploder) Explode(path string) map[string]status {
	files, err := os.ReadDir(path)
	if err != nil {
		fmt.Printf("%v", err.Error())
	}

	retval := make(map[string]status)

	for _, f := range files {
		if threedfiles(f) {
			basename := strings.TrimSuffix(f.Name(), filepath.Ext(f.Name()))

			retval[basename] = status{true, ""}

			if err := os.Mkdir(filepath.Join(path, basename), 0x777); err != nil {
				retval[basename] = status{false, err.Error()}
			}

			if err := os.Rename(filepath.Join(path, f.Name()), filepath.Join(path, basename, f.Name())); err != nil {
				retval[basename] = status{false, err.Error()}
			}
		}
	}

	return retval
}

func threedfiles(file fs.DirEntry) bool {
	ilist := []string{
		".stl",
		".3mf",
		".obj",
	}

	name := filepath.Ext(file.Name())

	for _, i := range ilist {
		if name == i {
			return true
		}
	}

	return false
}
