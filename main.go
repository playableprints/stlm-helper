package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"

	"stlmhelper/lib/convert3mf"
	fe "stlmhelper/lib/folderexploder"
	fsutil "stlmhelper/lib/fsutil"
	"stlmhelper/lib/hoistfiles"
	m "stlmhelper/lib/manifest"
	"stlmhelper/lib/stlintegrity"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

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
			&fe.Exploder{},
			&m.Tags{},
			&m.Attributes{},
			&fsutil.FSUtil{},
			&convert3mf.Convert3mf{},
			&stlintegrity.STLIntegrity{},
			&hoistfiles.HoistFiles{},
			&m.Manifest{},
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
