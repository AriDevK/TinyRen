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

			// get string(data) and check if there is a text with pattern
			// ask.options = [
			//     "text", #goto something
			// ]
			// to replace them with
			// ask.options = [
			//     {text = "text", togo = "something"},
			// ]
			lines := strings.Split(string(data), "\n")
			var processedLines []string
			reading := false
			for _, line := range lines {
				line = strings.TrimSpace(line)
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
			rawSceneContent = append(rawSceneContent, dataStr+"\n"+"index = "+directoryId)
		}
	}

	println("Raw scene content:", strings.Join(rawSceneContent, "\n"))

	var orchestrator Orchestrator
	rawSceneContentStr := strings.Join(rawSceneContent, "\n")
	_, err = toml.Decode(rawSceneContentStr, &orchestrator)
	if err != nil {
		return nil, err
	}

	return orchestrator.Scenes, nil
}
