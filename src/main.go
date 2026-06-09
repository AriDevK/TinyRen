package main

import (
	"context"
	"embed"

	toml "github.com/aridevk/tinyren/internal/toml"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	path := "#TODO: get path from args or config"
	o, err := toml.NewOrchestrator(path)
	if err != nil {
		println("Error:", err.Error())
		return
	}

	// // Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err = wails.Run(&options.App{
		Title:  o.Global.Info.Title,
		Width:  o.Global.Settings.Width,
		Height: o.Global.Settings.Height,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        func(ctx context.Context) { app.startup(ctx, o) },
		Bind: []interface{}{
			app,
		},
		WindowStartState: options.WindowStartState(o.Global.Settings.GetWindowStartState()),
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
