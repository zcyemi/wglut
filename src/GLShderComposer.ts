
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
}

export class GLShaderComposer{

    private m_shadertype:GLShaderType;
    private m_attrs:GLSL_ATTR[]=[];
    private m_varys:GLSL_VARY[] = [];
    private m_uniform:GLSL_UNIFORM[] = [];
    private m_precisions:GLSL_PRECISION_DEFINE[] = [];

    private m_main:GLSL_FUNC= new GLSL_FUNC('main');
    private m_funcs:GLSL_FUNC[] = [];

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

    public compile(gl:WebGL2RenderingContext){
        return null;
    }

}