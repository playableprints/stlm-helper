package hoistfiles

import (
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"

	"github.com/bmatcuk/doublestar/v4"
)

type HoistFiles struct{}

func (c *HoistFiles) Hoist(root string, collisionMode string, removeDirectories bool) (bool, error) {

	fsys := os.DirFS(root)
	dirs := []string{}
	collisions := map[string]int{}

	err := doublestar.GlobWalk(fsys, "**/*", func(path string, d fs.DirEntry) error {
		if d.IsDir() {
			dirs = append(dirs, path)
			return nil
		}
		ext := filepath.Ext(path)
		basename := strings.TrimSuffix(filepath.Base(path), ext)
		if collisionMode == "folderNames" {
			basename = strings.ReplaceAll(filepath.ToSlash(strings.TrimSuffix(path, ext)), "/", "_")
		}
		if val, ok := collisions[basename]; ok {
			basename += "_" + fmt.Sprintf("%03d", val)
			collisions[basename]++
		} else {
			collisions[basename] = 1
		}

		err := os.Rename(filepath.Join(root, path), filepath.Join(root, basename+ext))
		if err != nil {
			return nil
		}
		return nil
	})

	if err != nil {
		return false, err
	}

	if removeDirectories {
		for _, folder := range dirs {
			err := os.RemoveAll(filepath.Join(root, folder))
			if err != nil {
				fmt.Println(err.Error())
			}
		}
	}

	return true, nil
}
