# TinyRen

**Overview**

This document describes the user-facing features implemented in the project's TOML configuration files. It is intended for authors of game content (scene authors and resource maintainers), not for Go developers. The examples in this repository live under the `demo/` folder; see [demo/globals.toml](demo/globals.toml#L1), [demo/player.toml](demo/player.toml#L1) and [demo/scenes/1-begin/begin.toml](demo/scenes/1-begin/begin.toml#L1).

**Quick Start**
- **Create global data**: edit [demo/globals.toml](demo/globals.toml#L1) to define project info, settings, and reusable characters.
- **Player data**: use [demo/player.toml](demo/player.toml#L1) for player-specific variables (name, gender).
- **Scenes**: place scene folders under `demo/scenes/`, each folder can contain one or more TOML scene files (e.g. `demo/scenes/1-begin/begin.toml`).

**Globals file: demo/globals.toml**
- **Location**: [demo/globals.toml](demo/globals.toml#L1)
- Purpose: define reusable, project-wide values.
- Sections and fields:
  - `global.info`:
    - `title` — project title shown in UI.
    - `description` — short project description.
    - `version` — project version string.
    - `author` — author/developer name.
  - `global.settings`:
    - `width`, `height` — preferred viewport size.
    - `fullscreen` — boolean flag (true/false) for default fullscreen.
  - `global.characters` (array): define reusable characters that can be referenced by alias in scenes. Each entry supports:
    - `name` — full character name.
    - `alias` — short id used with `ref` inside scene files.
    - `sprite` — asset path (see Assets and paths below). Example:

      [[global.characters]]
      name = "Kasen"
      alias = "k"
      sprite = "@assets/characters/kasen.png"

**Player file: demo/player.toml**
- **Location**: [demo/player.toml](demo/player.toml#L1)
- Purpose: store player-specific values used by scene scripts and input-setting expressions.
- Common fields:
  - `player.name` — displayed player name.
  - `player.gender` — free-form string.

These values can be referenced in `input.on_submit_set` expressions (see Inputs below).

**Scene files: demo/scenes/**
- Scenes live as TOML files inside subfolders of `demo/scenes/` (for example [demo/scenes/1-begin/begin.toml](demo/scenes/1-begin/begin.toml#L1)).
- Top-level table for a file should be `scene.<slug>` (e.g. `scene.begin`), with these fields:
  - `background` — the background image or color. If it starts with `@` the prefix is removed and the remaining path is treated as a local asset path; the engine will convert it into a CSS `url('...')` for rendering.
  - `background_music` — path to background audio (asset paths may start with `@`).
  - `zoom` — number interpreted as percent (e.g. `100`). The UI will use this to scale the view.
  - `characters` — array of character blocks for this scene. Each character supports:
    - `ref` — reference to an alias from `global.characters`. When present, the referenced global character's properties are expanded into this character slot.
    - `name` — character name (if not using `ref`).
    - `sprite` — character image (asset path, `@` optional).
    - `animation` — animation shorthand, e.g. `enterLeft 1s` or `enterRight` (parser splits into name and duration).
    - `shown` — optional visibility hint. Valid values are `true`, `false`, or omitted/empty. The loader normalizes literal `true`/`false` into strings; at runtime the UI treats `"true"` and empty as visible.

  - `dialogue` — ordered array of dialogue blocks. Each block can be one of these types: `say`, `ask`, or `input`. Blocks may also include `speaker`, `togo` and `shown` fields that affect flow and visuals.

**Dialogue block types and fields**
- `say` — display text from a speaker.
  - Example structure inside a dialogue block:
    - `speaker = "Kasen"`
    - `say.text = "Hello world"`
    - `say.effect = "Fade"`  // optional visual text effect (examples in demo: `Fade`, `Write`, `Wavy`).

- `ask` — present a multiple-choice question.
  - Fields:
    - `ask.question` — the question text.
    - `ask.options` — an array of options. Two syntaxes are supported:
      1. Table/object form: `{text = "Label", goto = "labelName"}`
      2. Short form: a string followed by a `#goto label` comment on the same line (the loader reads the comment to extract the `goto`).
  - The `goto` value is optional — if omitted the option may simply close or continue the scene depending on your script.

- `input` — request textual input from the player.
  - Fields:
    - `input.label` — the input's label.
    - `input.placeholder` — placeholder text.
    - `input.type` — input type (e.g. `text`).
    - `input.validation` — simple validation hint such as `nonempty`.
    - `input.on_submit_goto` — a `togo` label name to jump to after submit.
    - `input.on_submit_set` — assignment string used to store the input value, e.g. `$global.player.name=input` will set the player name. The right-hand token `input` is replaced with the value the user typed.

**Flow control: `togo` labels**
- Any dialogue block may include `togo = "labelName"` (written `togo` in TOML). This label becomes a target that other blocks can reference. Use `input.on_submit_goto` or ask option `goto` to jump to a target label.

**Characters visibility and `shown`**
- Dialogue blocks may include `shown = true` or `shown = false` to set visibility for the current block's `speaker`. When `shown` is present, the engine will set the corresponding character's `Shown` state to `"true"` or `"false"` so the UI shows/hides that character.

**Assets and paths**
- Prefix `@` on `background` or `sprite` or `background_music` to indicate a local asset path (the loader strips `@` and treats the remainder as the asset url). Examples in the demo use `@assets/...`.

**Animations**
- Character `animation` is a simple string parsed into an animation name and optional duration (e.g. `enterLeft 1s`). If duration is omitted a default is applied.

**Practical examples**
- Simple `say` block:

  [[scene.begin.dialogue]]
  speaker = "Kasen"
  say.text = "Hello, Reimu!"
  say.effect = "Fade"

- Input block that sets player name and jumps to `welcome`:

  [[scene.begin.dialogue]]
  input.label = "Your name"
  input.placeholder = "Type your name..."
  input.type = "text"
  input.on_submit_set = "$global.player.name=input"
  input.on_submit_goto = "welcome"

- Ask block with mixed options:

  [[scene.begin.dialogue]]
  speaker = "Reimu"
  ask.question = "What next?"
  ask.options = [
    {text = "Create a new scene", goto = "create_scene"},
    "Add animations", #goto add_animations
  ]

**Tips & gotchas**
- The loader preprocesses some non-standard shorthand in scene TOML (for convenience). Follow the demo patterns if you want consistent behavior.
- `shown` values are normalized to strings internally — use `true`/`false` or omit the key.
- Use `ref = "alias"` in scene characters to reuse `global.characters` entries; the global character's `name` and `sprite` will be copied in.

**Where to edit**
- Edit user-facing content in the demo folder:
  - [demo/globals.toml](demo/globals.toml#L1)
  - [demo/player.toml](demo/player.toml#L1)
  - [demo/scenes/1-begin/begin.toml](demo/scenes/1-begin/begin.toml#L1)

If you'd like, I can also generate a short template scene file to get started.
