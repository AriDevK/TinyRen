package main

import (
	"context"
	"embed"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/aridevk/tinyren/internal/constants"
	toml "github.com/aridevk/tinyren/internal/toml"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

type FileLoader struct {
	http.Handler
}

func NewFileLoader() *FileLoader {
	println("Initializing file loader")
	return &FileLoader{}
}

func (h *FileLoader) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	var err error
	requestedFilename := strings.TrimPrefix(req.URL.Path, "/")
	println("Requesting file:", requestedFilename)

	if strings.HasSuffix(requestedFilename, ".toml") {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(fmt.Sprintf("Could not load file %s", requestedFilename)))
		return
	}

	fileData, err := os.ReadFile(constants.PATH + "/" + requestedFilename)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(fmt.Sprintf("Could not load file %s", requestedFilename)))
	}

	res.Write(fileData)
}

func main() {
	o, err := toml.NewOrchestrator(constants.PATH)
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
			Assets:  assets,
			Handler: NewFileLoader(),
			Middleware: func(next http.Handler) http.Handler {
				return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
					w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
					w.Header().Set("Pragma", "no-cache")
					w.Header().Set("Expires", "0")
					next.ServeHTTP(w, r)
				})
			},
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        func(ctx context.Context) { app.startup(ctx, o) },
		Bind: []interface{}{
			app,
		},
		WindowStartState: options.WindowStartState(o.Global.Settings.GetWindowStartState()),
		DisableResize:    o.Global.Settings.DisableResize,
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
