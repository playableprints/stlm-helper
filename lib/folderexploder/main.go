package folderexploder

import (
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

type Exploder struct{}

type status struct {
	Success bool
	Message string
}

func (e *Exploder) ExplodeList(path string, fileList []string, test string, replace string) map[string]status {
	retval := make(map[string]status)
	result := e.Prepare(fileList, test, replace)

	for k, flist := range result {
		dir := filepath.Join(path, k)
		if err := os.Mkdir(dir, 0x777); err != nil {
			fmt.Printf("error creating folder %v", k)
		}
		for _, fname := range flist {
			retval[fname] = status{true, ""}
			if err := os.Rename(filepath.Join(path, fname), filepath.Join(dir, fname)); err != nil {
				retval[fname] = status{false, err.Error()}
			}
		}
	}

	return retval
}

func (e *Exploder) PreviewExplode(fileList []string, test string, replace string) (map[string]string, error) {
	result := make(map[string]string)
	r, err := regexp.Compile(test)
	if err != nil {
		return nil, err
	}
	for _, f := range fileList {
		ext := filepath.Ext(f)
		basename := strings.TrimSuffix(f, ext)
		dir := r.ReplaceAllString(basename, replace)
		result[f] = "/" + dir + "/" + basename + ext
	}
	return result, nil
}

func (e *Exploder) Prepare(fileList []string, test string, replace string) map[string][]string {
	result := make(map[string][]string)

	r, err := regexp.Compile(test)
	if err != nil {
		fmt.Println(err.Error())
	}

	for _, f := range fileList {
		basename := strings.TrimSuffix(f, filepath.Ext(f))
		replaceToken := replace
		dir := r.ReplaceAllString(basename, replaceToken)
		if _, ok := result[dir]; !ok {
			result[dir] = []string{}
		}
		result[dir] = append(result[dir], f)
	}

	return result
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
