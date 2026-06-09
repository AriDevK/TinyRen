package main

import (
	"context"
	"fmt"

	toml "github.com/aridevk/tinyren/internal/toml"
)

// App struct
type App struct {
	ctx          context.Context
	orchestrator toml.Orchestrator
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context, o toml.Orchestrator) {
	a.ctx = ctx
	a.orchestrator = o
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetBackground() string {
	return a.orchestrator.Scenes["begin"].Background
}

func (a *App) GetScene(key string) toml.Scene {
	return a.orchestrator.Scenes[key]
}
