package manifest

import (
	"regexp"
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

func (c *Attributes) FindAttributeKeys(root string) ([]string, error) {
	keys := make([]string, 1)

	manifests, err := GetAllManifests(root)
	if err != nil {
		return keys, err
	}

	for _, manifest := range manifests {
		for _, k := range manifest.Scancfg.Attributes.Include {
			keys = append(keys, k.Key)
		}
		for _, k := range manifest.ModelMeta.Attributes {
			keys = append(keys, k.Key)
		}
	}

	return keys, err
}

func (c *Attributes) PreviewReplaceKeys(attributes []string, match string, replace string) (map[string]string, error) {
	result := make(map[string]string)
	r, err := regexp.Compile(match)
	if err != nil {
		return result, err
	}
	for _, t := range attributes {
		result[t] = t
		result[t] = r.ReplaceAllString(t, replace)
	}
	return result, err
}

func (c *Attributes) ReplaceKeys(root string, match string, replace string, include []string) ([]status, error) {
	result := make([]status, 0)
	keys, err := c.FindAttributeKeys(root)
	if err != nil {
		return result, err
	}
	repl, err := c.PreviewReplaceKeys(keys, match, replace)
	if err != nil {
		return result, err
	}
	toChange := make(map[string]string, len(keys))
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

	manifests, err := GetAllManifests(root)
	if err != nil {
		return result, err
	}

	for path, manifest := range manifests {
		changed := false

		toSetInclude := make([]attrInstance, 0)

		for _, t := range manifest.Scancfg.Attributes.Include {
			if nKey, ok := toChange[t.Key]; ok {
				changed = true
				if nKey != "" {
					toSetInclude = append(toSetInclude, attrInstance{
						Key:   nKey,
						Value: t.Value,
					})
				}
				res := status{t.Key, nKey, path + ":scancfg.attributes.include"}
				result = append(result, res)
			} else {
				toSetInclude = append(toSetInclude, t)
			}
		}
		toSetAttributes := make([]attrInstance, 0)

		for _, t := range manifest.ModelMeta.Attributes {
			if nKey, ok := toChange[t.Key]; ok {
				changed = true
				if nKey != "" {
					toSetAttributes = append(toSetAttributes, attrInstance{
						Key:   nKey,
						Value: t.Value,
					})
				}
				res := status{t.Key, nKey, path + ":modelmeta.attributes"}
				result = append(result, res)
			} else {
				toSetAttributes = append(toSetAttributes, t)
			}
		}

		if changed {
			manifest.Scancfg.Attributes.Include = toSetInclude
			manifest.ModelMeta.Attributes = toSetAttributes
			err := WriteManifest(path, manifest)
			if err != nil {
				return result, err
			}
		}
	}
	return result, err
}
