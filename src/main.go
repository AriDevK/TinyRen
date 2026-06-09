package main

import (
	"embed"

	toml "github.com/aridevk/tinyren/internal/toml"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	path := "#TEMPORAL UNAVAILABLE"
	o, err := toml.NewOrchestrator(path)
	if err != nil {
		println("Error:", err.Error())
		return
	}

	println("Globals:")
	global := o.Global
	println("Global Title:", global.Info.Title)
	println("Global Description:", global.Info.Description)
	println("Global Version:", global.Info.Version)
	println("Global Author:", global.Info.Author)
	println("Global Width:", global.Settings.Width)
	println("Global Height:", global.Settings.Height)
	println("Global Fullscreen:", global.Settings.Fullscreen)
	println("-----")

	println("\nScenes:")
	for key, scene := range o.Scenes {
		println("Scene Key:", key)
		println("Scene Index:", scene.Index)
		println("Scene Background:", scene.Background)
		println("Scene Msg:", scene.Msg)
		println("-----")
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
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
