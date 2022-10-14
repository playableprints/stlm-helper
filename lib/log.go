package lib

import (
	"encoding/json"
)

func Log(msg interface{}) string {
	jsonbytes, err := json.Marshal(msg)
	if err != nil {
		return "error'd " + err.Error()
	}
	return string(jsonbytes)
}
