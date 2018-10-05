

export class GLProgram{

    public Program: WebGLProgram;

    public Attributes: { [key: string]: number } = {};
    public Uniforms: { [key: string]: WebGLUniformLocation | null } = {};
    public UniformsInfo:{[key:string]:WebGLActiveInfo} = {};

    public UniformBlock:{[key:string]:number} = {};

    public extras?:any;

    public GetUniform(key:string):WebGLUniformLocation | null{
        return this.Uniforms[key];
    }

    public GetAttribute(key:string):any{
        return this.Attributes[key];
    }

    public constructor(gl: WebGL2RenderingContext, program: WebGLProgram) {
        this.Program = program;

        const numAttrs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < numAttrs; i++) {
            let attrInfo = gl.getActiveAttrib(program, i);
            if (attrInfo == null) continue;
            let attrLoca = gl.getAttribLocation(program, attrInfo.name);
            this.Attributes[attrInfo.name] = attrLoca;
        }

        const numUniform = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < numUniform; i++) {
            let uniformInfo = gl.getActiveUniform(program, i);
            if (uniformInfo == null) continue;
            let uname = uniformInfo.name;
            this.UniformsInfo[uname] = uniformInfo;
            let uniformLoca = gl.getUniformLocation(program, uname);
            this.Uniforms[uname] = uniformLoca;
        }

        const numublock = gl.getProgramParameter(program,gl.ACTIVE_UNIFORM_BLOCKS);
        for(let i=0;i<numublock;i++){
            let ublockName = gl.getActiveUniformBlockName(program,i);
            if(ublockName != null){
                this.UniformBlock[ublockName] = i;
            }
        }
    }
}