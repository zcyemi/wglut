

export class GLFrameBuffer{

    public colorTex0:WebGLTexture | null;
    public depthTex0:WebGLTexture | null;
    public frambuffer:WebGLFramebuffer;

    public colorFormat:number;
    public depthFormat:number|undefined;

    public width:number;
    public height:number;

    public static create(gl:WebGL2RenderingContext,colorInternalFormat:number,depthInternalFormat?:number,width?:number,height?:number):GLFrameBuffer|null{
        if(width == null) width = gl.canvas.width;
        if(height == null) height = gl.canvas.height;

        let fb = gl.createFramebuffer();
        if(fb == null) return null;

        let glfb = new GLFrameBuffer();

        gl.bindFramebuffer(gl.FRAMEBUFFER,fb);

        let colortex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,colortex);
        gl.texStorage2D(gl.TEXTURE_2D,1,colorInternalFormat,width,height);
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
        glfb.colorFormat =  colorInternalFormat;
        glfb.depthFormat = depthInternalFormat;


        return glfb;

    }

}