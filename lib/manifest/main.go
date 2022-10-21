package manifest

type IManifest struct {
	Scancfg struct {
		Include []string
	}
	Modelmeta struct {
		Tags []string
	}
}
