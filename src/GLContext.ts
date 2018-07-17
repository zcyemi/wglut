import { GLProgram } from "./GLProgram";

export class GLContext{

    public gl:WebGL2RenderingContext;
    private constructor(wgl:WebGL2RenderingContext){
        this.gl = wgl;
    }

    public static createFromGL(wgl:WebGL2RenderingContext) :GLContext{
        return new GLContext(wgl);
    }

    public static createFromCanvas(canvas:HTMLCanvasElement):GLContext | null{
        let g:any = canvas.getContext('webgl2');
        if(g == null){
            g = canvas.getContext('webgl');
        }
        if(g == null) return null;
        return new GLContext(g);
    }

    public createProgram(vsource:string,psource:string): GLProgram | null{

        let gl = this.gl;
        let vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vsource);
        gl.compileShader(vs);

        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            console.error('compile vertex shader failed: ' + gl.getShaderInfoLog(vs));
            gl.deleteShader(vs);
            return null;
        }

        let ps = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(ps, psource);
        gl.compileShader(ps);

        if (!gl.getShaderParameter(ps, gl.COMPILE_STATUS)) {
            console.error('compile fragment shader failed: ' + gl.getShaderInfoLog(ps));
            gl.deleteShader(ps);
            return null;
        }

        let program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, ps);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('link shader program failed!:' + gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            gl.deleteShader(vs);
            gl.deleteShader(ps);
            return null;
        }

        if(program == null) return null;

        let p = new GLProgram(gl, program);
        let handler = {
            get: function(tar:GLProgram,name:string){
                if(name in tar) return tar[name];

                if(name in tar.Unifroms){
                    tar[name] =tar.Unifroms[name];
                    console.log('get:' +name);
                    return tar[name];
                }
                else if(name in tar.Attributes){
                    tar[name] = tar.Attributes[name];
                    console.log('get:' +name);
                    return tar[name];
                }
                return null;
            }
        }

        return new Proxy(p,handler);
    }

    public createTextureImage(src: string,callback?:()=>void): WebGLTexture | null{
        var img = new Image();
        var gl = this.gl;
        var tex = gl.createTexture();
        img.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);

            gl.bindTexture(gl.TEXTURE_2D,null);

            console.log('init webgl texture');
            if(callback!= null) callback();
        };
        img.src = src;
        return tex;
    }

    public createTexture(internalFormat: number, width: number, height: number,linear:boolean = false,mipmap:boolean = false): WebGLTexture | null {
        let gl = this.gl;

        let tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texStorage2D(gl.TEXTURE_2D,1,internalFormat,width,height);
        
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,linear? gl.LINEAR: gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, linear?( mipmap? gl.LINEAR_MIPMAP_LINEAR:gl.LINEAR): gl.NEAREST);

        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);

        if(mipmap)
            gl.generateMipmap(gl.TEXTURE_2D);

        return tex;
    }
}