
export enum GLSL{
    vs,
    ps,
    vec2,
    vec3,
    vec4,
    float,
    int,
    sampler2D,
    void,
    in,
    out,
    inout,
    lowp,
    mediump,
    highp
}

export type GLSL_SHADER = GLSL.vs | GLSL.ps;
export type GLSL_TYPE = GLSL.vec2 | GLSL.vec3 | GLSL.vec4 | GLSL.float | GLSL.int | GLSL.sampler2D | GLSL.void;
export type GLSL_PREFIX = GLSL.in | GLSL.out | GLSL.inout;
export type GLSL_PRECISION = GLSL.lowp | GLSL.mediump | GLSL.highp;



type GLSL_PARAM = {type:GLSL_TYPE,symbol:string,prefix?:GLSL_PREFIX}
type GLSL_ATTR = GLSL_PARAM;
type GLSL_UNIFORM = {type:GLSL_TYPE,symbol:string};
type GLSL_VARY = GLSL_PARAM;

type GLSL_PRECISION_DEFINE = {type:GLSL_TYPE,level:GLSL_PRECISION};



export class GLSL_FUNC{
    public name:string;
    public rettype:GLSL_TYPE = GLSL.void;

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
        let source = `${GLSL[this.rettype]} ${this.name} (`;
        for(var i=0,len=this.parameters.length;i<len;i++){
            let p =this.parameters[i];
            source += `${p.prefix == null? '': GLSL[p.prefix]} ${GLSL[p.type]} ${p.symbol}`
            if(i !=len-1) source +=',';
        };
        source +='){\n';
        source += this.code +'}\n';
        return source;
    }
}



export class GLShaderComposer{

    private m_shadertype:GLSL_SHADER;
    private m_attrs:GLSL_ATTR[]=[];
    private m_varys:GLSL_VARY[] = [];
    private m_uniform:GLSL_UNIFORM[] = [];
    private m_precisions:GLSL_PRECISION_DEFINE[] = [];

    private m_main:GLSL_FUNC= new GLSL_FUNC('main');
    private m_funcs:GLSL_FUNC[] = [];

    private m_shaderSource:string;

    public static create(type:GLSL_SHADER):GLShaderComposer{
        
        let shader = new GLShaderComposer();
        shader.m_shadertype = type;

        return shader;
    }

    public attr(type:GLSL_TYPE,sym:string,prefix:GLSL_PREFIX = GLSL.in):GLShaderComposer{
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
            source+= `precision ${GLSL[p.level]} ${GLSL[p.type]};`;
        });
        this.m_attrs.forEach(a=>{
            source+= `${GLSL[a.prefix == null? GLSL.in: a.prefix]} ${GLSL[a.type]} ${a.symbol};`;
        });
        this.m_varys.forEach(v=>{
            let prefix = v.prefix == null?(this.m_shadertype == GLSL.vs? GLSL.out: GLSL.in): v.prefix;
            source += `${GLSL[prefix]} ${GLSL[v.type]} ${v.symbol};`;
        });
        this.m_uniform.forEach(u=>{
            source += `uniform ${GLSL[u.type]} ${u.symbol};`
        })
        source += this.m_main.mergeCode();

        this.m_shaderSource = source;
        
    }

}