package toml

import (
	"os"
	"path/filepath"
	"strings"

	"github.com/BurntSushi/toml"
)

func NewOrchestrator(projectPath string) (Orchestrator, error) {
	var orchestrator Orchestrator
	globalsPath := filepath.Join(projectPath, "globals.toml")
	scenesPath := filepath.Join(projectPath, "scenes")

	globals, err := LoadGlobals(globalsPath)
	if err != nil {
		println("Error loading globals:", err.Error())
		return Orchestrator{}, err
	}

	scenes, err := LoadScenes(scenesPath)
	if err != nil {
		println("Error loading scenes:", err.Error())
		return Orchestrator{}, err
	}

	orchestrator.Global = globals
	orchestrator.Scenes = scenes
	return orchestrator, nil
}

func LoadGlobals(path string) (globals Global, err error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return Global{}, err
	}

	var orchestrator Orchestrator
	_, err = toml.Decode(string(data), &orchestrator)
	if err != nil {
		return Global{}, err
	}

	return orchestrator.Global, nil
}

func LoadScenes(path string) (scenes map[string]Scene, err error) {
	// get directory contents
	files, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}
	scenes = make(map[string]Scene)

	var rawSceneContent []string
	for _, file := range files {
		if !file.IsDir() {
			continue
		}

		directoryId := strings.Split(file.Name(), "-")[0]
		content, err := os.ReadDir(filepath.Join(path, file.Name()))
		if err != nil {
			return nil, err
		}

		// look for .toml files inside directory
		for _, item := range content {
			if item.IsDir() || !strings.HasSuffix(item.Name(), ".toml") {
				continue
			}

			fp := filepath.Join(path, file.Name(), item.Name())
			data, err := os.ReadFile(fp)
			if err != nil {
				return nil, err
			}

			rawSceneContent = append(rawSceneContent, string(data)+"\n"+"index = "+directoryId)
		}
	}

	var orchestrator Orchestrator
	rawSceneContentStr := strings.Join(rawSceneContent, "\n")
	_, err = toml.Decode(rawSceneContentStr, &orchestrator)
	if err != nil {
		return nil, err
	}

	return orchestrator.Scenes, nil
}
