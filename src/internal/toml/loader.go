package toml

import (
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/BurntSushi/toml"
	"github.com/aridevk/tinyren/internal/constants"
	"github.com/aridevk/tinyren/internal/saver"
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

	vars, err := LoadVars(filepath.Join(projectPath, "vars"))
	if err != nil {
		println("Error loading vars:", err.Error())
		return Orchestrator{}, err
	}
	orchestrator.Vars = vars

	scenes, err := LoadScenes(scenesPath, globals.Characters)
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

func LoadVars(path string) (vars map[string]any, err error) {
	files, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}

	// if any filte is called _v.toml load the vars from there
	if _, err := os.Stat(constants.SAVE_FILE_PATH); err == nil {
		// data, err := os.ReadFile(constants.SAVE_FILE_PATH)
		data, err := saver.Load(constants.SAVE_FILE_PATH)
		if err != nil {
			return nil, err
		}

		if len(data) != 0 {
			var orchestrator Orchestrator
			_, err = toml.Decode(string(data), &orchestrator)
			if err != nil {
				return nil, err
			}

			return orchestrator.Vars, nil
		}
	}

	var rawVarsContent []string
	for _, file := range files {
		if file.IsDir() || !strings.HasSuffix(file.Name(), ".toml") {
			continue
		}

		fp := filepath.Join(path, file.Name())
		data, err := os.ReadFile(fp)
		if err != nil {
			return nil, err
		}

		rawVarsContent = append(rawVarsContent, string(data))
	}

	rawVarsContentStr := strings.Join(rawVarsContent, "\n")
	rawVarsContentStr +=
		"\n\n[vars.env]\n" +
			"scene = \"\"\n" +
			"dialogue_idx = 0\n"

	var orchestrator Orchestrator
	_, err = toml.Decode(rawVarsContentStr, &orchestrator)
	if err != nil {
		return nil, err
	}

	saver.CreateSaveFileIfNotExists(constants.SAVE_FILE_PATH, rawVarsContentStr)
	return orchestrator.Vars, nil
}

func LoadScenes(path string, characters []GlobalCharacter) (scenes map[string]Scene, err error) {
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

			lines := strings.Split(string(data), "\n")
			if len(lines) > 1 {
				sceneName := strings.TrimSuffix(item.Name(), ".toml")
				lines = append(lines[:1], append([]string{"name = \"" + sceneName + "\""}, lines[1:]...)...)
			}

			var processedLines []string
			reading := false
			for _, line := range lines {
				line = strings.TrimSpace(line)

				if strings.HasPrefix(line, "shown") {
					parts := strings.Split(line, "=")
					if len(parts) == 2 {
						value := strings.TrimSpace(parts[1])
						line = parts[0] + " = \"" + value + "\""
						processedLines = append(processedLines, line)
						continue
					}
				}

				if strings.HasPrefix(line, "ref") {
					parts := strings.Split(line, "=")
					if len(parts) == 2 {
						reference := strings.TrimSpace(strings.ReplaceAll(parts[1], "\"", ""))
						character := FindByAlias(reference, characters)
						if character != nil {
							line = character.PropsToToml()
						} else {
							log.Printf("Warning: No character found with alias '%s'", reference)
						}
						processedLines = append(processedLines, line)
					}

					continue
				}

				if strings.HasPrefix(line, "ask.options") {
					reading = true
					processedLines = append(processedLines, line)
					continue
				}

				if reading {
					if line == "]" {
						reading = false
						processedLines = append(processedLines, line)
						continue
					}

					line = strings.TrimSpace(line)

					// if regex looks like {text="...", goto="..."} then keep it as is
					if strings.HasPrefix(line, "{") {
						processedLines = append(processedLines, line)
						continue
					}

					// otherwise, split by comma and process
					optionData := strings.Split(line, ",")
					optionText := strings.TrimSpace(optionData[0])
					optionToGo := ""

					if len(optionData) > 1 {
						optionToGo = strings.TrimSpace(
							strings.TrimPrefix(
								strings.TrimSpace(optionData[1]),
								"#goto",
							),
						)
					}

					processedLine := "{" + `text = ` + optionText + `, goto = "` + optionToGo + `"` + "},"
					processedLines = append(processedLines, processedLine)
				} else {
					processedLines = append(processedLines, line)
				}
			}

			dataStr := strings.Join(processedLines, "\n")
			rawSceneContent = append(rawSceneContent, dataStr)
		}
	}

	println("Raw scene content:", strings.Join(rawSceneContent, "\n"))

	var orchestrator Orchestrator
	rawSceneContentStr := strings.Join(rawSceneContent, "\n")
	_, err = toml.Decode(rawSceneContentStr, &orchestrator)
	if err != nil {
		return nil, err
	}

	for key, sc := range orchestrator.Scenes {
		var dialogues []Dialogue
		for _, dialog := range sc.Dialogue {
			if dialog.Input != nil {
				dialog.Type = DialogueTypeInput
			} else if dialog.Ask != nil {
				dialog.Type = DialogueTypeAsk
			} else if dialog.Say != nil {
				dialog.Type = DialogueTypeSay
			} else {
				dialog.Type = DialogueTypeNone
			}

			dialogues = append(dialogues, dialog)
		}
		sc.Dialogue = dialogues
		orchestrator.Scenes[key] = sc
	}

	return orchestrator.Scenes, nil
}
