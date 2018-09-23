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
    highp,
    mat3,
    mat4
}
export type GLSL_SHADER = GLSL.vs | GLSL.ps;
export type GLSL_TYPE = GLSL.vec2 | GLSL.vec3 | GLSL.vec4 | GLSL.float | GLSL.int | GLSL.sampler2D | GLSL.void | GLSL.mat3 | GLSL.mat4;
export type GLSL_PREFIX = GLSL.in | GLSL.out | GLSL.inout;
export type GLSL_PRECISION = GLSL.lowp | GLSL.mediump | GLSL.highp;
export type GLSL_PARAM = {type:GLSL_TYPE,symbol:string,prefix?:GLSL_PREFIX}
export type GLSL_ATTR = GLSL_PARAM;
export type GLSL_UNIFORM = {type:GLSL_TYPE,symbol:string};
export type GLSL_VARY = GLSL_PARAM;
export type GLSL_PRECISION_DEFINE = {type:GLSL_TYPE,level:GLSL_PRECISION};

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

export class GLShaderComposerBase<T extends GLShaderComposerBase<T>>{
    protected composer:T;
    protected m_shadertype:GLSL_SHADER;
    protected m_attrs:GLSL_ATTR[]=[];
    protected m_varys:GLSL_VARY[] = [];
    protected m_uniform:GLSL_UNIFORM[] = [];
    protected m_precisions:GLSL_PRECISION_DEFINE[] = [];
    protected m_main:GLSL_FUNC= new GLSL_FUNC('main');
    protected m_funcs:GLSL_FUNC[] = [];
    protected m_shaderSource:string;
    public constructor(type:GLSL_SHADER){
        this.m_shadertype = type;
    }
    public attr(type:GLSL_TYPE,sym:string,prefix:GLSL_PREFIX = GLSL.in):T{
        this.m_attrs.push({symbol:sym,type:type});
        return  this.composer;
    }
    public vary(type:GLSL_TYPE,sym:string,prefix:GLSL_PREFIX):T{
        this.m_varys.push({type:type,symbol:sym,prefix:prefix});
        return this.composer;
    }
    public uniform(type:GLSL_TYPE,sym:string):T{
        this.m_uniform.push({type:type,symbol:sym});
        return  this.composer;
    }
    public attrs(attr:GLSL_ATTR[]):T{
        this.m_attrs = this.m_attrs.concat(attr);
        return  this.composer;
    }
    public main(init:(f:GLSL_FUNC)=>void):T{
        init(this.m_main);
        return  this.composer;
    }
    public func(name:string,init:(f:GLSL_FUNC)=>void):T{
        let f = new GLSL_FUNC(name);
        init(f);
        this.m_funcs.push(f);
        return  this.composer;
    }
    public precision(type:GLSL_TYPE,level:GLSL_PRECISION):T{
        this.m_precisions.push({type:type,level:level});
        return  this.composer;
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

export class GLShaderComposer extends GLShaderComposerBase<GLShaderComposer>{
    private constructor(type:GLSL_SHADER){
        super(type);
        this.composer = this;
    }
    public static create(type:GLSL_SHADER){
        return new GLShaderComposer(type);
    }
}
