export namespace manifest {
	
	export class attrInstance {
	    key: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new attrInstance(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.key = source["key"];
	        this.value = source["value"];
	    }
	}
	export class attrConfig {
	    clear: boolean;
	    include: attrInstance[];
	    exclude: string[];
	
	    static createFrom(source: any = {}) {
	        return new attrConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.clear = source["clear"];
	        this.include = this.convertValues(source["include"], attrInstance);
	        this.exclude = source["exclude"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
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
	export class tagConfig {
	    clear: boolean;
	    include: string[];
	    exclude: string[];
	
	    static createFrom(source: any = {}) {
	        return new tagConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.clear = source["clear"];
	        this.include = source["include"];
	        this.exclude = source["exclude"];
	    }
	}
	export class scanCfgV5 {
	    modelmode: number;
	    fileMode: number;
	    filetypes: number[];
	    ifLeaf: boolean;
	    tags: tagConfig;
	    attributes: attrConfig;
	    propagation: number;
	
	    static createFrom(source: any = {}) {
	        return new scanCfgV5(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.modelmode = source["modelmode"];
	        this.fileMode = source["fileMode"];
	        this.filetypes = source["filetypes"];
	        this.ifLeaf = source["ifLeaf"];
	        this.tags = this.convertValues(source["tags"], tagConfig);
	        this.attributes = this.convertValues(source["attributes"], attrConfig);
	        this.propagation = source["propagation"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
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
	
	
	export class modelMetaV5 {
	    name?: string;
	    notes: string;
	    tags: string[];
	    cover?: string;
	    collections: string[];
	    attributes: attrInstance[];
	
	    static createFrom(source: any = {}) {
	        return new modelMetaV5(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.notes = source["notes"];
	        this.tags = source["tags"];
	        this.cover = source["cover"];
	        this.collections = source["collections"];
	        this.attributes = this.convertValues(source["attributes"], attrInstance);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
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
	
	
	export class iManifestV5 {
	    version: number;
	    scancfg: scanCfgV5;
	    modelmeta: modelMetaV5;
	
	    static createFrom(source: any = {}) {
	        return new iManifestV5(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.scancfg = this.convertValues(source["scancfg"], scanCfgV5);
	        this.modelmeta = this.convertValues(source["modelmeta"], modelMetaV5);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
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

