package main

import (
	"context"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("%s: solving for X since 2022", name)
}

func (a *App) PickDirectory() string {
	dialogOptions := runtime.OpenDialogOptions{}
	dirpath, err := runtime.OpenDirectoryDialog(a.ctx, dialogOptions)

	if err != nil {
		return ""
	}

	return dirpath
}
