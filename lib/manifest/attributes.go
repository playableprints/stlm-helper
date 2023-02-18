package manifest

import (
	"strings"
)

type Attributes struct{}

type attrStatus struct {
	Item string
	In   string
}

func (c *Attributes) ConvertTagsToAttributes(root string, delim string, list []string) ([]attrStatus, error) {
	return ConvertTagsToAttributes(root, delim, list)
}

func ConvertTagsToAttributes(root string, delim string, list []string) ([]attrStatus, error) {

	result := make([]attrStatus, 0)

	manifests, err := GetAllManifests(root)
	if err != nil {
		return result, err
	}

	for path, manifest := range manifests {
		newScanTags := []string{}
		newUserTags := []string{}

		for _, t := range manifest.Scancfg.Tags.Include {
			if strings.Contains(t, delim) && contains(list, t) {
				res := strings.SplitN(t, delim, 2)
				var k = res[0]
				var v = res[1]
				manifest.Scancfg.Attributes.Include = append(manifest.Scancfg.Attributes.Include, attrInstance{Key: k, Value: v})
				result = append(result, attrStatus{t, path + ":scancfg.attributes.include"})
			} else {
				newScanTags = append(newScanTags, t)
			}
		}
		for _, t := range manifest.ModelMeta.Tags {
			if strings.Contains(t, delim) && contains(list, t) {
				res := strings.SplitN(t, delim, 2)
				var k = res[0]
				var v = res[1]
				manifest.ModelMeta.Attributes = append(manifest.ModelMeta.Attributes, attrInstance{Key: k, Value: v})
				result = append(result, attrStatus{t, path + ":modelmeta.attributes"})
			} else {
				newUserTags = append(newUserTags, t)
			}
		}
		manifest.ModelMeta.Tags = newUserTags
		manifest.Scancfg.Tags.Include = newScanTags

		err := WriteManifest(path, manifest)
		if err != nil {
			return result, err
		}
	}

	return result, nil
}
