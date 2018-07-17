

export class GLProgram{

    public Program: WebGLProgram;

    public Attributes: { [key: string]: number } = {};
    public Unifroms: { [key: string]: WebGLUniformLocation | null } = {};

    public GetUnifrom(key:string):WebGLUniformLocation | null{
        return this.Unifroms[key];
    }

    public GetAttribute(key:string):any{
        return this.Attributes[key];

    }

    public constructor(gl: WebGLRenderingContext, program: WebGLProgram) {
        this.Program = program;

        const numAttrs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < numAttrs; i++) {
            const attrInfo = gl.getActiveAttrib(program, i);
            if (attrInfo == null) continue;
            const attrLoca = gl.getAttribLocation(program, attrInfo.name);
            this.Attributes[attrInfo.name] = attrLoca;
        }

        const numUniform = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < numUniform; i++) {
            const uniformInfo = gl.getActiveUniform(program, i);
            if (uniformInfo == null) continue;
            const uniformLoca = gl.getUniformLocation(program, uniformInfo.name);
            this.Unifroms[uniformInfo.name] = uniformLoca;
        }
    }
}