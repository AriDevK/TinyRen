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
	Index      int         `toml:"index"`
	Background string      `toml:"background"`
	Msg        string      `toml:"msg"`
	Characters []Character `toml:"characters"`
}

type Character struct {
	Name   string `toml:"name"`
	Sprite string `toml:"sprite"`
}
