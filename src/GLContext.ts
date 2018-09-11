import { GLProgram } from "./GLProgram";
import { vec4 } from "./GLVec";
import { GLShaderComposer, GLShaderType, GLSL_TYPE, GLSL_PREFIX, GLSL_PRECISION } from "./GLShderComposer";

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
            get: function(tar:GLProgram | any,name:string){
                if(name in tar) return tar[name];

                if(name in tar.Unifroms){
                    tar[name] =tar.Unifroms[name];
                    return tar[name];
                }
                else if(name in tar.Attributes){
                    tar[name] = tar.Attributes[name];
                    return tar[name];
                }

                console.warn('program can not find attr/uniform:' + name);
                tar[name] = undefined;
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


    private m_tempFrameBuffer:WebGLFramebuffer;
    public saveTextureToImage(texture:WebGLTexture):HTMLImageElement | null{
        if(texture == null) return null;
        let gl =this.gl;
        if(this.m_tempFrameBuffer == null){
            this.m_tempFrameBuffer = <WebGLFramebuffer>gl.createFramebuffer();
        }

        let curfb = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        let curtex = gl.getParameter(gl.TEXTURE_BINDING_2D);

        gl.bindFramebuffer(gl.FRAMEBUFFER,this.m_tempFrameBuffer);
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);

        let image = this.saveCurrentFrameBufferToImage();

        gl.bindTexture(gl.TEXTURE_2D,curtex);
        gl.bindFramebuffer(gl.FRAMEBUFFER,curfb);

        return image;
    }
    public saveCurrentFrameBufferToImage(x:number=0,y:number =0,w:number|null =null,h:number| null = null):HTMLImageElement{
        let gl = this.gl;

        if(w == null || h == null){
            let canvas = gl.canvas;
            w = canvas.width;
            h = canvas.height;
        }

        let data = new Uint8Array(w *h *4);
        gl.readPixels(x,y,w,h,gl.RGBA,gl.UNSIGNED_BYTE,data);

        let tempcanvas = document.createElement('canvas');
        tempcanvas.width = w;
        tempcanvas.height = h;

        var ctx2d = <CanvasRenderingContext2D>tempcanvas.getContext('2d');
        var imgdata = ctx2d.createImageData(w,h);
        imgdata.data.set(data);
        ctx2d.putImageData(imgdata,0,0);

        var img = new Image();
        img.src = tempcanvas.toDataURL();
        return img;
    }

    private m_drawTexAryBuffer:WebGLBuffer;
    private m_drawTexBuffer:Float32Array = new Float32Array(16);
    private m_drawTexProgram:GLProgram;
    private m_drawTexInited:boolean =false;
    
    private drawTexCheckInit():boolean{
        if(this.m_drawTexInited) return true;
        let gl =this.gl;
        if(this.m_drawTexAryBuffer == null){
            this.m_drawTexAryBuffer = <WebGLBuffer>gl.createBuffer();
        }

        //vs
        let shadervs = GLShaderComposer.create(GLShaderType.vertex)
            .attr(GLSL_TYPE.vec2,'aPosition')
            .attr(GLSL_TYPE.vec2,'aUV')
            .vary(GLSL_TYPE.vec2,'vUV',GLSL_PREFIX.out)
            .precision(GLSL_TYPE.float,GLSL_PRECISION.mediump)
            .main(f=>f
                .line('gl_Position = vec4(aPosition,-1.0,1.0)')
                .line('vUV = aUV'))
            .compile();
        //ps
        let shderps = GLShaderComposer.create(GLShaderType.fragment)
        .uniform(GLSL_TYPE.sampler2D,'uSampler')
        .vary(GLSL_TYPE.vec2,'vUV',GLSL_PREFIX.in)
        .vary(GLSL_TYPE.vec4,'fragColor',GLSL_PREFIX.out)
        .precision(GLSL_TYPE.float,GLSL_PRECISION.lowp)
        .main(f=>f
            .line('fragColor = texture(uSampler,vUV)'))
        .compile();
        
        let program = this.createProgram(shadervs,shderps);
        if(program == null) return false;
        this.m_drawTexProgram = program;

        this.m_drawTexInited = true;

        return true;
    }
    public drawTexFullscreen(tex:WebGLTexture,retainState:boolean = true){
        let gl =this.gl;
        if(!gl.isTexture(tex))return;
        if(!this.drawTexCheckInit()){
            console.log('draw tex init failed');
            return;
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER,this.m_drawTexAryBuffer);
        this.m_drawTexBuffer.set([
            -1.0,1.0,0,1.0,
            1.0,1.0,1.0,1.0,
            -1.0,-1.0,0,0,
            1.0,-1.0,1.0,0
        ]);
        gl.bufferData(gl.ARRAY_BUFFER,this.m_drawTexBuffer,gl.DYNAMIC_DRAW);

        let p = this.m_drawTexProgram;
        gl.useProgram(p.Program);
        let attrp = p.Attributes['aPosition'];
        let attruv = p.Attributes['aUV'];
        gl.vertexAttribPointer(attrp,2,gl.FLOAT,false,16,0);
        gl.vertexAttribPointer(attruv,2,gl.FLOAT,false,16,8);
        gl.enableVertexAttribArray(attrp);
        gl.enableVertexAttribArray(attruv);

        gl.bindTexture(gl.TEXTURE_2D,tex);
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(p.Unifroms['uSampler'],0);

        gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    }

    public drawSampleRect(x:number,y:number,w:number,h:number,color:vec4){
        let gl =this.gl;
        if(!this.drawTexCheckInit()){
            console.log('draw tex init failed');
            return;
        }
    }
}
