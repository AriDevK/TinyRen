package toml

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

type Character struct {
	Name      string `toml:"name"`
	Sprite    string `toml:"sprite"`
	Animation string `toml:"animation"`
}

type Dialogue struct {
	Speaker string       `toml:"speaker"`
	Say     string       `toml:"say"`
	Effect  string       `toml:"effect"`
	Ask     *DialogueAsk `toml:"ask,omitempty"`
}

// type DialogueSay struct {
// 	Say    string `toml:"say"`
// 	Effect string `toml:"effect"`
// }

type DialogueAsk struct {
	Question string   `toml:"question"`
	Options  []string `toml:"options"`
}
