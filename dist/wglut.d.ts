/// <reference types="webgl2" />
declare module "GLProgram" {
    export class GLProgram {
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
}
declare module "GLContext" {
    import { GLProgram } from "GLProgram";
    export class GLContext {
        gl: WebGL2RenderingContext;
        private constructor();
        static createFromGL(wgl: WebGL2RenderingContext): GLContext;
        static createFromCanvas(canvas: HTMLCanvasElement): GLContext | null;
        createProgram(vsource: string, psource: string): GLProgram | null;
        createTextureImage(src: string, callback?: () => void): WebGLTexture | null;
        createTexture(internalFormat: number, width: number, height: number, linear?: boolean, mipmap?: boolean): WebGLTexture | null;
    }
}
declare module "wglut" {
    export * from "GLContext";
    export * from "GLProgram";
}
//# sourceMappingURL=wglut.d.ts.map