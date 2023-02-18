package manifest

import (
	"regexp"
)

type Tags struct{}

type status struct {
	From string
	To   string
	In   string
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

	manifests, err := GetAllManifests(root)
	if err != nil {
		return result, err
	}

	for path, manifest := range manifests {
		changed := false
		for i, t := range manifest.Scancfg.Tags.Include {
			if val, ok := toChange[t]; ok {
				if val != t {
					changed = true
					manifest.Scancfg.Tags.Include[i] = val
					res := status{t, val, path + ":scancfg.tags.include"}
					result = append(result, res)
				}
			}
		}

		for i, t := range manifest.ModelMeta.Tags {
			if val, ok := toChange[t]; ok {
				if val != t {
					changed = true
					manifest.ModelMeta.Tags[i] = val
					res := status{t, val, path + ":modelmeta.tags"}
					result = append(result, res)
				}
			}
		}

		if changed {
			err := WriteManifest(path, manifest)
			if err != nil {
				return result, err
			}
		}
	}
	return result, err
}

func (c *Tags) FindTags(root string) ([]string, error) {
	tags := make([]string, 1)

	manifests, err := GetAllManifests(root)
	if err != nil {
		return tags, err
	}

	for _, manifest := range manifests {
		tags = append(tags, manifest.Scancfg.Tags.Include...)
		tags = append(tags, manifest.ModelMeta.Tags...)
	}

	return tags, err
}
