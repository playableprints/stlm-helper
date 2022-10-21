package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"

	fe "stlmhelper/lib/folderexploder"
	fsutil "stlmhelper/lib/fsutil"
	m "stlmhelper/lib/manifest"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	exploder := &fe.Exploder{}
	fsutil := &fsutil.FSUtil{}

	// Create application with options
	err := wails.Run(&options.App{
		Title:            "Euler",
		Width:            1024,
		Height:           768,
		Assets:           assets,
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			exploder,
			&m.Tags{},
			fsutil,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
