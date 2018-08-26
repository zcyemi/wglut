export declare class GLProgram {
    Program: WebGLProgram;
    Attributes: {
        [key: string]: number;
    };
    Unifroms: {
        [key: string]: WebGLUniformLocation | null;
    };
    GetUnifrom(key: string): WebGLUniformLocation | null;
    GetAttribute(key: string): any;
    constructor(gl: WebGLRenderingContext, program: WebGLProgram);
}
