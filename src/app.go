package main

import (
	"context"
	"strings"

	"github.com/aridevk/tinyren/internal/audio"
	toml "github.com/aridevk/tinyren/internal/toml"
	"github.com/wailsapp/wails/v2/pkg/runtime"
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

func (a *App) GetMenu() toml.Menu {
	return a.orchestrator.Global.Menu
}

func (a *App) GetMenuBackground() string {
	return a.orchestrator.Global.Menu.GetBackground()
}

func (a *App) GetBackground() string {
	return a.scene.GetBackground()
}

func (a *App) ShowExitMessage() bool {
	var msg, _ = runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
		Title:   "Exit",
		Message: "Are you sure you want to exit?",
		Type:    runtime.WarningDialog,
		Buttons: []string{"Yes", "No"},
	})
	return msg == "Yes"
}

func (a *App) Close() {
	runtime.Quit(a.ctx)
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

func (a *App) SetVar(key string, value any) {
	key = strings.TrimPrefix(key, "vars.")
	keyPaths := strings.Split(key, ".")
	currentMap := a.orchestrator.Vars

	for i, keyPart := range keyPaths {
		keyPart = strings.TrimSpace(keyPart)
		if i == len(keyPaths)-1 {
			currentMap[keyPart] = value
		} else {
			if nextMap, ok := currentMap[keyPart].(map[string]any); ok {
				currentMap = nextMap
			} else {
				newMap := make(map[string]any)
				currentMap[keyPart] = newMap
				currentMap = newMap
			}
		}
	}
}

func (a *App) GetVars() map[string]any {
	return a.orchestrator.Vars
}

func (a *App) Save() (map[string]any, error) {
	err := a.orchestrator.Save()
	if err != nil {
		return nil, err
	}

	return a.orchestrator.Vars, nil
}
