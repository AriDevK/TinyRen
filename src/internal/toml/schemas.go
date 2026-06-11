package toml

import "strings"

type DialogueType string

const (
	DialogueTypeSay   DialogueType = "say"
	DialogueTypeAsk   DialogueType = "ask"
	DialogueTypeInput DialogueType = "input"
	DialogueTypeNone  DialogueType = "none"
)

type Orchestrator struct {
	Global Global           `toml:"global"`
	Scenes map[string]Scene `toml:"scene"`
}

type Global struct {
	Info       Info              `toml:"info"`
	Settings   Settings          `toml:"settings"`
	Characters []GlobalCharacter `toml:"characters"`
}

type Info struct {
	Title       string `toml:"title"`
	Description string `toml:"description"`
	Version     string `toml:"version"`
	Author      string `toml:"author"`
}

type Settings struct {
	Width      int  `toml:"width"`
	Height     int  `toml:"height"`
	Fullscreen bool `toml:"fullscreen"`
}

type GlobalCharacter struct {
	Name   string `toml:"name"`
	Alias  string `toml:"alias"`
	Sprite string `toml:"sprite"`
}

func (gc GlobalCharacter) PropsToToml() string {
	var props []string
	if gc.Name != "" {
		props = append(props, "name = \""+gc.Name+"\"")
	}
	if gc.Sprite != "" {
		props = append(props, "sprite = \""+gc.Sprite+"\"")
	}
	return strings.Join(props, "\n")
}

func FindByAlias(alias string, characters []GlobalCharacter) *GlobalCharacter {
	for _, gc := range characters {
		if gc.Alias == alias {
			return &gc
		}
	}
	return nil
}

func (s Settings) GetWindowStartState() int {
	if s.Fullscreen {
		return 3
	}
	return 0
}

type Scene struct {
	Index           int         `toml:"index"`
	Background      string      `toml:"background"`
	BackgroundMusic string      `toml:"background_music"`
	Zoom            float64     `toml:"zoom"`
	Characters      []Character `toml:"characters"`
	Dialogue        []Dialogue  `toml:"dialogue"`
}

func (s Scene) GetBackground() string {
	if s.Background == "" {
		return "black"
	}

	if strings.HasPrefix(s.Background, "@") {
		backgroundUrl := strings.TrimPrefix(s.Background, "@")
		return "url('" + backgroundUrl + "')"
	}

	return s.Background
}

type Character struct {
	ref       string `toml:"ref,omitempty"`
	Name      string `toml:"name"`
	Sprite    string `toml:"sprite"`
	Animation string `toml:"animation"`
	Shown     string `toml:"shown,omitempty"`
}

func (c Character) GetSprite() string {
	if c.Sprite == "" {
		return ""
	}

	if strings.HasPrefix(c.Sprite, "@") {
		spriteUrl := strings.TrimPrefix(c.Sprite, "@")
		return spriteUrl
	}

	return c.Sprite
}

type CharacterAnimationData struct {
	Animation string
	Duration  string
}

func (c Character) GetAnimationData() CharacterAnimationData {
	if c.Animation == "" {
		return CharacterAnimationData{"", ""}
	}

	parts := strings.Split(c.Animation, " ")
	if len(parts) != 2 {
		return CharacterAnimationData{parts[0], "3s"}
	}

	return CharacterAnimationData{parts[0], parts[1]}
}

type Dialogue struct {
	Type    DialogueType
	ToGo    string         `toml:"togo"`
	Speaker string         `toml:"speaker"`
	Shown   string         `toml:"shown,omitempty"`
	Say     *DialogueSay   `toml:"say,omitempty"`
	Ask     *DialogueAsk   `toml:"ask,omitempty"`
	Input   *DialogueInput `toml:"input,omitempty"`
}

type DialogueSay struct {
	Text   string `toml:"text"`
	Effect string `toml:"effect"`
}

type DialogueAsk struct {
	Question string      `toml:"question"`
	Options  []AskOption `toml:"options"`
}

type AskOption struct {
	Text string `toml:"text"`
	GoTo string `toml:"goto"`
}

type DialogueInput struct {
	Label        string `toml:"label"`
	Placeholder  string `toml:"placeholder"`
	Type         string `toml:"type"`
	Validation   string `toml:"validation"`
	OnSubmitGoTo string `toml:"on_submit_goto"`
	OnSubmitSet  string `toml:"on_submit_set"`
}
