package fsutil

import (
	"fmt"
	"os"
)

type FSUtil struct{}

func (e *FSUtil) GetContents(path string, filter string, includeDirs bool) []string {
	retval := []string{}
	files, err := os.ReadDir(path)
	if err != nil {
		fmt.Printf("%v", err.Error())
	}

	for _, f := range files {
		if (f.IsDir() && includeDirs) || !f.IsDir() {
			retval = append(retval, f.Name())
		}
	}
	return retval
}
