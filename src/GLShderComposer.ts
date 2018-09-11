
export enum GLShaderType{
    vertex,
    fragment,
}

export enum GLSL_TYPE{
    vec2,
    vec3,
    vec4,
    float,
    int,
    sampler2D,
    void
}

export enum GLSL_PREFIX{
    in,
    out,
    inout,
}

export enum GLSL_PRECISION{
    lowp,
    mediump,
    highp
}


type GLSL_PARAM = {type:GLSL_TYPE,symbol:string,prefix?:GLSL_PREFIX}
type GLSL_ATTR = GLSL_PARAM;
type GLSL_UNIFORM = {type:GLSL_TYPE,symbol:string};
type GLSL_VARY = GLSL_PARAM;

type GLSL_PRECISION_DEFINE = {type:GLSL_TYPE,level:GLSL_PRECISION};



export class GLSL_FUNC{
    public name:string;
    public rettype:GLSL_TYPE = GLSL_TYPE.void;

    public code:string = '';
    public parameters:GLSL_PARAM[] = [];
    

    public constructor(name:string){
        this.name =name;
    }

    public line(...code:string[]):GLSL_FUNC{
        var codel = code.join(' ');
        codel = codel.trim();
        if(!codel.endsWith(';')){
            codel+=';';
        }
        codel +='\n';
        this.code+=codel;
        return this;
    }

    public params(plist:GLSL_PARAM[]){
        this.parameters = plist;
        return this;
    }

    public body(code:string):GLSL_FUNC{
        this.code= code;
        return this;
    }

    public ret(rettype:GLSL_TYPE):GLSL_FUNC{
        this.rettype= rettype;
        return this;
    }

    public mergeCode():string{
        let source = `${GLSL_TYPE[this.rettype]} ${this.name} (`;
        for(var i=0,len=this.parameters.length;i<len;i++){
            let p =this.parameters[i];
            source += `${p.prefix == null? '': GLSL_PREFIX[p.prefix]} ${GLSL_TYPE[p.type]} ${p.symbol}`
            if(i !=len-1) source +=',';
        };
        source +='){\n';
        source += this.code +'}\n';
        return source;
    }
}



export class GLShaderComposer{

    private m_shadertype:GLShaderType;
    private m_attrs:GLSL_ATTR[]=[];
    private m_varys:GLSL_VARY[] = [];
    private m_uniform:GLSL_UNIFORM[] = [];
    private m_precisions:GLSL_PRECISION_DEFINE[] = [];

    private m_main:GLSL_FUNC= new GLSL_FUNC('main');
    private m_funcs:GLSL_FUNC[] = [];

    private m_shaderSource:string;

    public static create(type:GLShaderType):GLShaderComposer{
        
        let shader = new GLShaderComposer();
        shader.m_shadertype = type;

        return shader;
    }

    public attr(type:GLSL_TYPE,sym:string,prefix:GLSL_PREFIX = GLSL_PREFIX.in):GLShaderComposer{
        this.m_attrs.push({symbol:sym,type:type});
        return this;
    }

    public vary(type:GLSL_TYPE,sym:string,prefix:GLSL_PREFIX):GLShaderComposer{
        this.m_varys.push({type:type,symbol:sym,prefix:prefix});
        return this;
    }

    public uniform(type:GLSL_TYPE,sym:string):GLShaderComposer{
        this.m_uniform.push({type:type,symbol:sym});
        return this;
    }

    public attrs(attr:GLSL_ATTR[]):GLShaderComposer{
        this.m_attrs = this.m_attrs.concat(attr);
        return this;
    }

    public main(init:(f:GLSL_FUNC)=>void):GLShaderComposer{
        init(this.m_main);
        return this;
    }

    public func(name:string,init:(f:GLSL_FUNC)=>void):GLShaderComposer{
        let f = new GLSL_FUNC(name);
        init(f);
        this.m_funcs.push(f);
        return this;
    }

    public precision(type:GLSL_TYPE,level:GLSL_PRECISION):GLShaderComposer{
        this.m_precisions.push({type:type,level:level});
        return this;
    }

    public compile(){
        this.mergeShaderSource();
        return this.m_shaderSource;
    }

    private mergeShaderSource(){
        let source=  "#version 300 es\n";
        this.m_precisions.forEach(p=>{
            source+= `precision ${GLSL_PRECISION[p.level]} ${GLSL_TYPE[p.type]};`;
        });
        this.m_attrs.forEach(a=>{
            source+= `${GLSL_PREFIX[a.prefix == null? GLSL_PREFIX.in: a.prefix]} ${GLSL_TYPE[a.type]} ${a.symbol};`;
        });
        this.m_varys.forEach(v=>{
            let prefix = v.prefix == null?(this.m_shadertype == GLShaderType.vertex? GLSL_PREFIX.out: GLSL_PREFIX.in): v.prefix;
            source += `${GLSL_PREFIX[prefix]} ${GLSL_TYPE[v.type]} ${v.symbol};`;
        });
        this.m_uniform.forEach(u=>{
            source += `uniform ${GLSL_TYPE[u.type]} ${u.symbol};`
        })
        source += this.m_main.mergeCode();

        this.m_shaderSource = source;
        
    }

}