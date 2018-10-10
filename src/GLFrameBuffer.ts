import { GLContext } from "./GLContext";


export class GLFrameBuffer{

    public colorTex0:WebGLTexture | null;
    public depthTex0:WebGLTexture | null;
    public frambuffer:WebGLFramebuffer;

    public colorFormat:number;
    public depthFormat:number|undefined;

    public width:number;
    public height:number;

    private m_valid:boolean = false;

    public static create(retain:boolean,glctx:GLContext,colorInternalFormat:number,depthInternalFormat?:number,width?:number,height?:number,glfb?:GLFrameBuffer):GLFrameBuffer|null{
        let gl = glctx.gl;
        if(width == null) width = gl.canvas.width;
        if(height == null) height = gl.canvas.height;

        if(glfb == null){
            glfb = new GLFrameBuffer();
        }
        else{
            if(glfb.isvalid){
                glfb.release(glctx);
            }
        }

        let fb = gl.createFramebuffer();
        if(fb == null) return null;

        let state = retain? glctx.savePipeline(
            gl.FRAMEBUFFER_BINDING,
            gl.TEXTURE_BINDING_2D
            ): null;

        gl.bindFramebuffer(gl.FRAMEBUFFER,fb);

        let colortex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,colortex);
        gl.texStorage2D(gl.TEXTURE_2D,1,colorInternalFormat,width,height);

        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.bindTexture(gl.TEXTURE_2D,null);
        gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,colortex,0);


        let depthTex:WebGLTexture|null = null;
        if(depthInternalFormat != null){
            depthTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D,depthTex);
            gl.texStorage2D(gl.TEXTURE_2D,1,depthInternalFormat,width,height);
            gl.bindTexture(gl.TEXTURE_2D,null);
            gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,depthTex,0);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER,null);

        glfb.colorTex0 = colortex;
        glfb.depthTex0 = depthTex;
        glfb.frambuffer = fb;
        glfb.width = width;
        glfb.height = height;
        glfb.colorFormat = colorInternalFormat;
        glfb.depthFormat = depthInternalFormat;

        if(state != null){
            glctx.restorePipeline(state);
        }

        glfb.m_valid= true;
        return glfb;
    }

    public release(glctx:GLContext){
        let gl = glctx.gl;
        gl.deleteFramebuffer(this.frambuffer);
        this.frambuffer = null;

        gl.deleteTexture(this.colorTex0);
        gl.deleteTexture(this.depthTex0);
        this.colorTex0 = null;
        this.depthTex0 = null;

        this.m_valid = false;
    }

    public get isvalid():boolean{
        return this.m_valid;
    }

    public bind(gl:WebGL2RenderingContext){
        gl.bindFramebuffer(gl.FRAMEBUFFER,this.frambuffer);
    }

}