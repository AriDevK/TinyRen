export namespace toml {
	
	export class Scene {
	    Index: number;
	    Background: string;
	    Msg: string;
	
	    static createFrom(source: any = {}) {
	        return new Scene(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Index = source["Index"];
	        this.Background = source["Background"];
	        this.Msg = source["Msg"];
	    }
	}

}

