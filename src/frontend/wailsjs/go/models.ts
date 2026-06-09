export namespace toml {
	
	export class Character {
	    Name: string;
	    Sprite: string;
	    Animation: string;
	
	    static createFrom(source: any = {}) {
	        return new Character(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Sprite = source["Sprite"];
	        this.Animation = source["Animation"];
	    }
	}
	export class Dialogue {
	    Speaker: string;
	    Text: string;
	    Effect: string;
	
	    static createFrom(source: any = {}) {
	        return new Dialogue(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Speaker = source["Speaker"];
	        this.Text = source["Text"];
	        this.Effect = source["Effect"];
	    }
	}
	export class Scene {
	    Index: number;
	    Background: string;
	    Zoom: number;
	    Characters: Character[];
	    Dialogue: Dialogue[];
	
	    static createFrom(source: any = {}) {
	        return new Scene(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Index = source["Index"];
	        this.Background = source["Background"];
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

