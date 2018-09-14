import { GLProgram } from "./GLProgram";
import { GLShaderComposer, GLSL } from "./GLShderComposer";
import { GLFrameBuffer } from "./GLFrameBuffer";
import { GLPipelineState } from "./GLPipelineState";
import { vec4 } from "./GLMath";

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

    public createFrameBuffer(retain:boolean,colorInternalFormat:number,depthInternalFormat?:number,width?:number,height?:number):GLFrameBuffer|null{
        return GLFrameBuffer.create(retain,this,colorInternalFormat,depthInternalFormat,width,height);
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
    private m_drawRectColorProgram:GLProgram;
    private m_drawTexInited:boolean =false;
    
    private drawTexCheckInit():boolean{
        if(this.m_drawTexInited) return true;
        let gl =this.gl;
        if(this.m_drawTexAryBuffer == null){
            this.m_drawTexAryBuffer = <WebGLBuffer>gl.createBuffer();
        }

        //vs
        let shadervs = GLShaderComposer.create(GLSL.vs)
            .attr(GLSL.vec2,'aPosition')
            .attr(GLSL.vec2,'aUV')
            .vary(GLSL.vec2,'vUV',GLSL.out)
            .precision(GLSL.float,GLSL.mediump)
            .main(f=>f
                .line('gl_Position = vec4(aPosition,-1.0,1.0)')
                .line('vUV = aUV'))
            .compile();
        //ps
        let shaderps = GLShaderComposer.create(GLSL.ps)
        .uniform(GLSL.sampler2D,'uSampler')
        .vary(GLSL.vec2,'vUV',GLSL.in)
        .vary(GLSL.vec4,'fragColor',GLSL.out)
        .precision(GLSL.float,GLSL.lowp)
        .main(f=>f
            .line('fragColor = texture(uSampler,vUV)'))
        .compile();
        //ps color
        let shaderpsCol = GLShaderComposer.create(GLSL.ps)
            .precision(GLSL.float,GLSL.lowp)
            .uniform(GLSL.vec4,'uColor')
            .vary(GLSL.vec2,'vUV',GLSL.in)
            .vary(GLSL.vec4,'fragColor',GLSL.out)
            .main(f=>f.line('fragColor = uColor'))
            .compile();
        {
            let program = this.createProgram(shadervs,shaderps);
            if(program == null) throw new Error('Internal shader compile error!');
            this.m_drawTexProgram = program;
        }
        {
            let program = this.createProgram(shadervs,shaderpsCol);
            if(program == null) throw new Error('Internal shader compile error!');
            this.m_drawRectColorProgram = program;
        }

        this.m_drawTexInited = true;

        return true;
    }
    public drawTexFullscreen(tex:WebGLTexture,flipY:boolean = false,retain:boolean = true){
        let gl =this.gl;
        if(!gl.isTexture(tex))return;
        if(!this.drawTexCheckInit()){
            console.log('draw tex init failed');
            return;
        }

        let state = retain? this.savePipeline(gl.ARRAY_BUFFER_BINDING,gl.TEXTURE_BINDING_2D) : null;

        const dataNoFlipped = [
            -1, 1, 0, 1,
            1, 1, 1.0, 1,
            -1, -1, 0, 0,
            1, -1, 1, 0
        ];
        const dataFlipped = [
            -1, 1, 0, 0,
            1, 1, 1, 0,
            -1, -1, 0, 1,
            1, -1, 1, 1
        ];
        
        gl.bindBuffer(gl.ARRAY_BUFFER,this.m_drawTexAryBuffer);
        this.m_drawTexBuffer.set(flipY? dataFlipped:dataNoFlipped);
        gl.bufferData(gl.ARRAY_BUFFER,this.m_drawTexBuffer,gl.STREAM_DRAW);

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

        if(state != null){
            this.restorePipeline(state);
        }
    }

    public drawSampleRect(retain:boolean,x:number,y:number,w:number,h:number,color:vec4 = vec4.one){
        let gl =this.gl;
        if(!this.drawTexCheckInit()){
            console.log('draw tex init failed');
            return;
        }

        let state = retain? this.savePipeline(gl.ARRAY_BUFFER_BINDING,gl.TEXTURE_BINDING_2D) : null;
        {
            let vp = gl.getParameter(gl.VIEWPORT);
            let vw = vp[2];
            let vh = vp[3];
            let dx1 = 2*x/vw -1;
            let dy1 = 2*y/vh -1;

            let dx2 = dx1+ 2*w /vw;
            let dy2 = dy1+ 2*h /vh;
           
            gl.bindBuffer(gl.ARRAY_BUFFER,this.m_drawTexAryBuffer);
            this.m_drawTexBuffer.set([
                dx1,dy2,0,1.0,
                dx2,dy2,1.0,1.0,
                dx1,dy1,0,0,
                dx2,dy1,1.0,0
            ]);

            gl.bufferData(gl.ARRAY_BUFFER,this.m_drawTexBuffer,gl.STREAM_DRAW);

            let p = this.m_drawRectColorProgram;
            gl.useProgram(p.Program);
            let attrp = p.Attributes['aPosition'];
            let attruv = p.Attributes['aUV'];
            gl.vertexAttribPointer(attrp,2,gl.FLOAT,false,16,0);
            gl.vertexAttribPointer(attruv,2,gl.FLOAT,false,16,8);
            gl.enableVertexAttribArray(attrp);
            gl.enableVertexAttribArray(attruv);
            gl.uniform4fv(p.Unifroms['uColor'],color.raw);
            gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
        }
        if(state != null) this.restorePipeline(state);
    }

    public savePipeline(...type:number[]):GLPipelineState{
        return new GLPipelineState(this.gl,...type);
    }

    public restorePipeline(state:GLPipelineState){
        if(state == null) return;
        state.restore(this.gl);
    }
}
