export namespace toml {
	
	export class AskOption {
	    Text: string;
	    GoTo: string;
	
	    static createFrom(source: any = {}) {
	        return new AskOption(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Text = source["Text"];
	        this.GoTo = source["GoTo"];
	    }
	}
	export class Character {
	    Name: string;
	    Sprite: string;
	    Animation: string;
	    Shown: string;
	
	    static createFrom(source: any = {}) {
	        return new Character(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Sprite = source["Sprite"];
	        this.Animation = source["Animation"];
	        this.Shown = source["Shown"];
	    }
	}
	export class CharacterAnimationData {
	    Animation: string;
	    Duration: string;
	
	    static createFrom(source: any = {}) {
	        return new CharacterAnimationData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Animation = source["Animation"];
	        this.Duration = source["Duration"];
	    }
	}
	export class DialogueInput {
	    Label: string;
	    Placeholder: string;
	    Type: string;
	    Validation: string;
	    OnSubmitGoTo: string;
	    OnSubmitSet: string;
	
	    static createFrom(source: any = {}) {
	        return new DialogueInput(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Label = source["Label"];
	        this.Placeholder = source["Placeholder"];
	        this.Type = source["Type"];
	        this.Validation = source["Validation"];
	        this.OnSubmitGoTo = source["OnSubmitGoTo"];
	        this.OnSubmitSet = source["OnSubmitSet"];
	    }
	}
	export class DialogueAsk {
	    Question: string;
	    Options: AskOption[];
	
	    static createFrom(source: any = {}) {
	        return new DialogueAsk(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Question = source["Question"];
	        this.Options = this.convertValues(source["Options"], AskOption);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class DialogueSay {
	    Text: string;
	    Effect: string;
	
	    static createFrom(source: any = {}) {
	        return new DialogueSay(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Text = source["Text"];
	        this.Effect = source["Effect"];
	    }
	}
	export class Dialogue {
	    Type: string;
	    ToGo: string;
	    GoTo: string;
	    Speaker: string;
	    Shown: string;
	    Say?: DialogueSay;
	    Ask?: DialogueAsk;
	    Input?: DialogueInput;
	    Save: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Dialogue(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Type = source["Type"];
	        this.ToGo = source["ToGo"];
	        this.GoTo = source["GoTo"];
	        this.Speaker = source["Speaker"];
	        this.Shown = source["Shown"];
	        this.Say = this.convertValues(source["Say"], DialogueSay);
	        this.Ask = this.convertValues(source["Ask"], DialogueAsk);
	        this.Input = this.convertValues(source["Input"], DialogueInput);
	        this.Save = source["Save"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	
	export class Menu {
	    Background: string;
	    BackgroundMusic: string;
	
	    static createFrom(source: any = {}) {
	        return new Menu(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Background = source["Background"];
	        this.BackgroundMusic = source["BackgroundMusic"];
	    }
	}
	export class Scene {
	    Index: number;
	    Name: string;
	    Background: string;
	    BackgroundMusic: string;
	    Zoom: number;
	    Characters: Character[];
	    Dialogue: Dialogue[];
	
	    static createFrom(source: any = {}) {
	        return new Scene(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Index = source["Index"];
	        this.Name = source["Name"];
	        this.Background = source["Background"];
	        this.BackgroundMusic = source["BackgroundMusic"];
	        this.Zoom = source["Zoom"];
	        this.Characters = this.convertValues(source["Characters"], Character);
	        this.Dialogue = this.convertValues(source["Dialogue"], Dialogue);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

