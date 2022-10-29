package fsutil

import (
	"io/fs"
	"os"
	"path/filepath"

	"github.com/bmatcuk/doublestar/v4"
)

type FSUtil struct{}

type File struct{}

type Folder struct{}

func (e *FSUtil) GetContents(root string, filter string, includeDirs bool) ([]string, error) {
	retval := []string{}

	fsys := os.DirFS(root)
	err := doublestar.GlobWalk(fsys, filepath.ToSlash(filter), func(path string, d fs.DirEntry) error {
		if !d.IsDir() || includeDirs {
			retval = append(retval, path)
		}
		return nil
	})

	if err != nil {
		return nil, err
	}
	return retval, nil
}

func (e *FSUtil) GetTree(root string) ([]string, error) {
	retval := []string{}
	fsys := os.DirFS(root)

	err := doublestar.GlobWalk(fsys, "**/*", func(path string, d fs.DirEntry) error {
		if d.IsDir() {
			retval = append(retval, "/"+path+"/")
		} else {
			retval = append(retval, "/"+path)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return retval, nil
}
