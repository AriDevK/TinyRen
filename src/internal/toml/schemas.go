package toml

import "strings"

type Orchestrator struct {
	Global Global           `toml:"global"`
	Scenes map[string]Scene `toml:"scene"`
}

type Global struct {
	Info     Info     `toml:"info"`
	Settings Settings `toml:"settings"`
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
	Name      string `toml:"name"`
	Sprite    string `toml:"sprite"`
	Animation string `toml:"animation"`
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
	Speaker string       `toml:"speaker"`
	Say     *DialogueSay `toml:"say,omitempty"`
	Ask     *DialogueAsk `toml:"ask,omitempty"`
}

type DialogueSay struct {
	Text   string `toml:"text"`
	Effect string `toml:"effect"`
}

type DialogueAsk struct {
	Question string   `toml:"question"`
	Options  []string `toml:"options"`
}
