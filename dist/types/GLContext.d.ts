/// <reference types="webgl2" />
import { GLProgram } from "./GLProgram";
export declare class GLContext {
    gl: WebGL2RenderingContext;
    private constructor();
    static createFromGL(wgl: WebGL2RenderingContext): GLContext;
    static createFromCanvas(canvas: HTMLCanvasElement): GLContext | null;
    createProgram(vsource: string, psource: string): GLProgram | null;
    createTextureImage(src: string, callback?: () => void): WebGLTexture | null;
    createTexture(internalFormat: number, width: number, height: number, linear?: boolean, mipmap?: boolean): WebGLTexture | null;
}
