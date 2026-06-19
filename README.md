# TinyRen

A visual novel engine built with Go and TOML-based scripting. Create interactive stories with dialogue, choices, character animations, and variable management.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Global Configuration](#global-configuration)
4. [Variables System](#variables-system)
5. [Custom Functions](#custom-functions)
6. [Scene Files](#scene-files)
7. [Dialogue Types](#dialogue-types)
8. [Flow Control & Navigation](#flow-control--navigation)
9. [Character Management](#character-management)
10. [Assets & Paths](#assets--paths)
11. [Complete Examples](#complete-examples)

---

## Quick Start

TinyRen uses TOML files to define your visual novel content. The main components are:

- **globals.toml** - Project info, settings, menu, and reusable characters
- **vars/** - Variable files for player data and custom variables
- **misc/functions.toml** - Custom JavaScript-like functions
- **scenes/** - Scene folders containing dialogue and character interactions

**Minimal Setup:**
1. Configure [demo/globals.toml](demo/globals.toml) with your project info
2. Create scene files in `demo/scenes/` folders
3. Add your assets (images, audio) to the `demo/assets/` folder
4. Run your visual novel!

---

## Project Structure

```
demo/
├── globals.toml              # Global configuration
├── vars/
│   ├── player.toml          # Player-specific variables
│   └── items.toml           # Custom variables (e.g., inventory)
├── misc/
│   └── functions.toml       # Custom functions
├── scenes/
│   ├── 1-begin/
│   │   └── begin.toml       # Scene file
│   └── 2/
│       └── hello.toml       # Another scene
└── assets/
    ├── audio/
    │   ├── bgm/             # Background music
    │   └── sfx/             # Sound effects
    ├── bg/                  # Background images
    └── characters/          # Character sprites
```

---

## Global Configuration

The [demo/globals.toml](demo/globals.toml) file defines project-wide settings.

### Project Info

```toml
[global.info]
title = "My Visual Novel"
description = "An amazing interactive story"
version = "1.0.0"
author = "Your Name"
```

- **title** - Displayed in the window title
- **description** - Project description (for metadata)
- **version** - Version number of your project
- **author** - Creator name

### Display Settings

```toml
[global.settings]
width = 800
height = 600
fullscreen = false
disable_resize = true
```

- **width**, **height** - Window dimensions in pixels
- **fullscreen** - Start in fullscreen mode (true/false)
- **disable_resize** - Prevent window resizing (true/false)

### Main Menu

```toml
[global.menu]
background = "@assets/bg/menu.png"
background_music = "@assets/audio/menu_theme.mp3"
```

- **background** - Menu background (color or image path with `@` prefix)
- **background_music** - Audio file for the main menu

### Global Characters

Define reusable characters that can be referenced across all scenes:

```toml
[[global.characters]]
name = "Aoi Mizuno"
alias = "a"
sprite = "@assets/characters/aoi.png"

[[global.characters]]
name = "Yuna Tachibana"
alias = "y"
sprite = "@assets/characters/yuna.png"
```

- **name** - Full character name
- **alias** - Short ID for referencing in scenes (use with `ref`)
- **sprite** - Default character image path

---

## Variables System

Variables store dynamic data that changes during gameplay.

### Variable Files

Create TOML files in `demo/vars/` to define variable namespaces:

**demo/vars/player.toml**
```toml
[vars.player]
name = "Player"
gender = "male"

[vars.world]
name = "Fantasy Kingdom"
```

**demo/vars/items.toml**
```toml
[vars.inventory]
gold = 100
sword = false
potion_count = 3
```

### Using Variables in Text

Reference variables using `${vars.namespace.variable}` syntax:

```toml
[[scene.begin.dialogue]]
speaker = "Aoi"
say.text = "Hello ${vars.player.name}! Welcome to ${vars.world.name}!"
```

### Setting Variables

Use the `input.on_submit_set` field to assign values:

```toml
[[scene.begin.dialogue]]
speaker = "Aoi"
input.label = "What's your name?"
input.placeholder = "Enter your name"
input.type = "text"
input.validation = "nonempty"
input.on_submit_set = "vars.player.name = <input>"
```

**Advanced Variable Assignment:**
```toml
# With JavaScript expressions
input.on_submit_set = "vars.player.name = ${vars.player.gender == 'male' ? 'Mr.' : 'Ms.'} <input>"

# Multiple operations (use ${} for JS expressions)
input.on_submit_set = "vars.player.name = ${console.log('ok') ?? ''} ${(vars.player.gender).startsWith('m') ? 'Mr.' : 'Ms.'} <input>"
```

- `<input>` is replaced with the user's input value
- Use `${}` for JavaScript expressions within the assignment
- Access variables with `vars.namespace.variable`

---

## Custom Functions

Define reusable JavaScript-like functions in `demo/misc/functions.toml`.

**demo/misc/functions.toml**
```toml
[func.strings]
normalizeName = "f()=>`${vars.player.gender == 'Male' ? 'Mr.' : 'Ms.'} ${vars.player.name}`"
setPlayerName = "f(name)=>{vars.player.name = <name>}"
addExclamation = "f(text)=> <text> + '!'"
```

Functions use arrow function syntax:
- **No parameters:** `f()=> expression`
- **With parameters:** `f(param1, param2)=> expression`
- Use `<paramName>` placeholders within the function body
- Access variables with `vars.namespace.variable`

---

## Scene Files

Scenes are the core of your visual novel. Each scene file defines a location, characters, and dialogue sequence.

### Scene Structure

```toml
[scene.begin]
background = "@assets/bg/classroom.png"
background_music = "@assets/audio/bgm/scene_theme.mp3"
zoom = 100

[[scene.begin.characters]]
# Character definitions...

[[scene.begin.dialogue]]
# Dialogue blocks...
```

### Scene Properties

- **background** - Background image or CSS color
  - Use `@` prefix for asset paths: `@assets/bg/room.png`
  - Or CSS colors/gradients: `"linear-gradient(to bottom, #1e3c72, #2a5298)"`
- **background_music** - Audio file path (with `@` prefix)
- **zoom** - Zoom level as percentage (100 = normal, 150 = zoomed in)

### Adding Characters to Scenes

**Using Global Character References:**
```toml
[[scene.begin.characters]]
ref = "a"                    # References global character with alias "a"
animation = "enterLeft 1s"
shown = true
```

**Defining Characters Inline:**
```toml
[[scene.begin.characters]]
name = "Mysterious Stranger"
sprite = "@assets/characters/stranger.png"
animation = "fadeIn 2s"
```

**Character Properties:**
- **ref** - Reference a global character by alias
- **name** - Character name (required if not using `ref`)
- **sprite** - Character image path
- **animation** - Animation name and duration (e.g., `"enterLeft 1s"`)
- **shown** - Initial visibility (`true` or `false`)

**Available Animations:**
- `enterLeft` - Slide in from left
- `enterRight` - Slide in from right
- `fadeIn` - Fade in
- `fadeOut` - Fade out

Duration defaults to `3s` if not specified.

---

## Dialogue Types

Dialogue blocks create the interactive narrative. There are three types: **say**, **ask**, and **input**.

### 1. Say Dialogue (Text Display)

Display text from a character:

```toml
[[scene.begin.dialogue]]
speaker = "Aoi Mizuno"
say.text = "Hello! Welcome to our world!"
say.effect = "Fade"
```

**Properties:**
- **speaker** - Character name speaking this line
- **say.text** - The dialogue text (supports variable interpolation)
- **say.effect** - Text display effect (optional)

**Available Text Effects:**
- `Fade` - Fade in text
- `Write` - Typewriter effect
- `Wavy` - Wavy text animation

### 2. Ask Dialogue (Multiple Choice)

Present choices to the player:

```toml
[[scene.begin.dialogue]]
speaker = "Aoi Mizuno"
ask.question = "What should we do first?"
ask.options = [
    "Explore the town",           #goto explore
    "Talk to villagers",          #goto talk
    {text = "Rest at the inn", goto = "rest"},
    {text = "Continue journey"}   # No goto (continues to next block)
]
```

**Two Syntax Options:**

1. **Inline with comments:**
   ```toml
   "Option text",  #goto label_name
   ```

2. **Object format:**
   ```toml
   {text = "Option text", goto = "label_name"}
   ```

**Properties:**
- **ask.question** - The question text
- **ask.options** - Array of choice options
- **goto** - Jump destination (label name or scene name)

### 3. Input Dialogue (Text Input)

Collect text input from the player:

```toml
[[scene.begin.dialogue]]
speaker = "Aoi Mizuno"
input.label = "What's your name?"
input.placeholder = "Enter your name"
input.type = "text"
input.validation = "nonempty"
input.on_submit_set = "vars.player.name = <input>"
input.on_submit_goto = "greet_player"
```

**Properties:**
- **input.label** - Label text above the input field
- **input.placeholder** - Placeholder text in the input
- **input.type** - Input type (`"text"` is standard)
- **input.validation** - Validation rule (e.g., `"nonempty"`)
- **input.on_submit_set** - Variable assignment expression
- **input.on_submit_goto** - Label to jump to after submission

---

## Flow Control & Navigation

Control dialogue flow with labels and jumps.

### Labels (togo)

Mark dialogue blocks as jump destinations:

```toml
[[scene.begin.dialogue]]
togo = "greet_player"
speaker = "Aoi"
say.text = "Nice to meet you, ${vars.player.name}!"
```

- **togo** - Creates a named label that can be jumped to
- Labels are scene-specific

### Jumping (goto)

Navigate to different parts of your story:

**Jump to a Label (same scene):**
```toml
ask.options = [
    "Try again",  #goto greet_player
]
```

**Jump to Another Scene:**
```toml
ask.options = [
    "Go to town",  #goto >town_square
]
# OR
[[scene.begin.dialogue]]
goto = ">next_scene"
```

Use `>` prefix to jump to another scene: `>scene_name`

### Save Points

Mark dialogue blocks as save points:

```toml
[[scene.begin.dialogue]]
speaker = "Aoi"
say.text = "This is an important moment."
save = true
```

- **save** - When `true`, creates a save point at this dialogue

---

## Character Management

### Character Visibility

Control when characters appear or disappear:

```toml
[[scene.begin.dialogue]]
speaker = "Yuna Tachibana"
say.text = "Surprise! I'm here!"
shown = true    # Make the speaker visible
```

```toml
[[scene.begin.dialogue]]
speaker = "Aoi Mizuno"
say.text = "Goodbye for now."
shown = false   # Hide the speaker
```

- **shown** - Set to `true` to show the speaker, `false` to hide
- Only affects the current speaker
- Useful for dramatic entrances/exits

### Character Animations

Animate character appearances:

```toml
[[scene.begin.characters]]
ref = "a"
animation = "enterLeft 1s"    # Animation name and duration
```

Format: `"animationName duration"`
- Duration is optional (defaults to `3s`)
- Examples: `"enterLeft 1s"`, `"fadeIn 2s"`, `"enterRight"`

---

## Assets & Paths

### Asset Path Syntax

Use the `@` prefix to reference local assets:

```toml
background = "@assets/bg/forest.png"
sprite = "@assets/characters/hero.png"
background_music = "@assets/audio/bgm/theme.mp3"
```

The `@` tells the engine to load from your project's asset directory.

### Asset Organization

Recommended structure:
```
demo/assets/
├── audio/
│   ├── bgm/           # Background music
│   └── sfx/           # Sound effects
├── bg/                # Background images
└── characters/        # Character sprites
```

### Using Colors Instead of Images

For backgrounds, you can use CSS colors directly:

```toml
background = "#1a1a2e"
background = "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)"
```

---

## Complete Examples

### Example 1: Simple Conversation

```toml
[scene.intro]
background = "@assets/bg/park.png"
background_music = "@assets/audio/bgm/peaceful.mp3"
zoom = 100

[[scene.intro.characters]]
ref = "a"
animation = "enterLeft 1s"

[[scene.intro.dialogue]]
speaker = "Aoi Mizuno"
say.text = "What a beautiful day!"
say.effect = "Fade"

[[scene.intro.dialogue]]
speaker = "Aoi Mizuno"
say.text = "Perfect for a walk in the park."
say.effect = "Write"
```

### Example 2: Player Name Input

```toml
[scene.start]
background = "@assets/bg/room.png"

[[scene.start.characters]]
name = "Guide"
sprite = "@assets/characters/guide.png"

[[scene.start.dialogue]]
speaker = "Guide"
say.text = "Welcome, traveler!"

[[scene.start.dialogue]]
speaker = "Guide"
input.label = "What is your name?"
input.placeholder = "Enter your name"
input.type = "text"
input.validation = "nonempty"
input.on_submit_set = "vars.player.name = <input>"
save = true

[[scene.start.dialogue]]
togo = "greeting"
speaker = "Guide"
say.text = "Welcome, ${vars.player.name}! Your adventure begins now."
```

### Example 3: Branching Choices

```toml
[scene.crossroads]
background = "@assets/bg/crossroads.png"

[[scene.crossroads.characters]]
ref = "a"

[[scene.crossroads.dialogue]]
speaker = "Aoi Mizuno"
ask.question = "Which path will you take?"
ask.options = [
    "Take the forest path",      #goto forest_path
    "Follow the river",          #goto river_path
    {text = "Go back", goto = ">previous_scene"}
]

[[scene.crossroads.dialogue]]
togo = "forest_path"
speaker = "Aoi Mizuno"
say.text = "The forest path it is! Be careful of wild animals."
goto = ">forest"

[[scene.crossroads.dialogue]]
togo = "river_path"
speaker = "Aoi Mizuno"
say.text = "The river will guide us. Let's go!"
goto = ">river"
```

### Example 4: Character Appearance Control

```toml
[scene.meeting]
background = "@assets/bg/courtyard.png"

[[scene.meeting.characters]]
ref = "a"
animation = "enterLeft 1s"

[[scene.meeting.characters]]
ref = "y"
shown = false    # Start hidden

[[scene.meeting.dialogue]]
speaker = "Aoi Mizuno"
say.text = "I wonder where Yuna is..."

[[scene.meeting.dialogue]]
speaker = "Yuna Tachibana"
say.text = "Surprise! I'm here!"
shown = true    # Make Yuna appear

[[scene.meeting.dialogue]]
speaker = "Aoi Mizuno"
say.text = "There you are! I've been looking for you."
```

### Example 5: Variable-Driven Dialogue

```toml
[scene.shop]
background = "@assets/bg/shop.png"

[[scene.shop.characters]]
name = "Merchant"
sprite = "@assets/characters/merchant.png"

[[scene.shop.dialogue]]
speaker = "Merchant"
say.text = "Welcome, ${vars.player.name}! You have ${vars.inventory.gold} gold."

[[scene.shop.dialogue]]
speaker = "Merchant"
ask.question = "What would you like to buy?"
ask.options = [
    "Health Potion (50 gold)",   #goto buy_potion
    "Magic Sword (200 gold)",    #goto buy_sword
    "Nothing, thanks"            #goto leave
]

[[scene.shop.dialogue]]
togo = "buy_potion"
speaker = "Merchant"
say.text = "A wise choice! Here's your potion."
# Note: actual gold deduction would require game logic

[[scene.shop.dialogue]]
togo = "buy_sword"
speaker = "Merchant"
say.text = "An excellent weapon for a brave adventurer!"

[[scene.shop.dialogue]]
togo = "leave"
speaker = "Merchant"
say.text = "Come back anytime!"
goto = ">town"
```

---

## Tips & Best Practices

1. **Organize scenes logically** - Use numbered folders for scene ordering
2. **Use global characters** - Define frequently used characters in globals.toml
3. **Label important dialogue** - Add `togo` labels for dialogue you'll reference
4. **Save points** - Use `save = true` before major story branches
5. **Variable interpolation** - Use `${vars.namespace.variable}` for dynamic text
6. **Asset paths** - Always use `@` prefix for consistency
7. **Test your flows** - Verify all `goto` targets exist
8. **Default duration** - Character animations default to 3s if not specified

---

**Start creating your visual novel with TinyRen! 🎮✨**

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
