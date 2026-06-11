package main

import (
	"context"

	"github.com/aridevk/tinyren/internal/audio"
	toml "github.com/aridevk/tinyren/internal/toml"
)

// App struct
type App struct {
	ctx          context.Context
	orchestrator toml.Orchestrator
	scene        *toml.Scene
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
	a.scene = nil
}

func (a *App) GetScene(key string) toml.Scene {
	sc := a.orchestrator.Scenes[key]
	a.scene = &sc
	return sc
}

func (a *App) GetBackground() string {
	return a.scene.GetBackground()
}

func (a *App) GetCharacterAnimationData(characterName string) toml.CharacterAnimationData {
	for _, character := range a.scene.Characters {
		if character.Name == characterName {
			return character.GetAnimationData()
		}
	}

	return toml.CharacterAnimationData{Animation: "", Duration: ""}
}

func (a *App) GetCharacterSprite(c toml.Character) string {
	return c.GetSprite()
}

func (a *App) PlayAudio(source string) {
	go audio.Play(source)
}
