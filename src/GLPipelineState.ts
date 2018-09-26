
export class GLPipelineState{

    private m_state:{type:number,data:any}[] = [];
    public constructor(gl:WebGL2RenderingContext,...type:number[]){
        if(gl == null) return;

        for(let i=0,len=type.length;i<len;i++){
            let glkey = type[i];
            var tarobj = gl.getParameter(glkey);
            this.m_state.push({type:glkey,data:tarobj});
        }
    }

    public restore(gl:WebGL2RenderingContext){
        let state = this.m_state;
        for(let i=0,len=state.length;i<len;i++){
            this.restoreParamter(gl,state[i]);
        }
    }

    private restoreParamter(gl:WebGL2RenderingContext,p:{type:number,data:any}){
        let data = p.data;
        switch(p.type){
            case gl.VIEWPORT:
                gl.viewport(data[0],data[1],data[2],data[3]);
                break;
            case gl.COLOR_CLEAR_VALUE:
                gl.clearColor(data[0],data[1],data[2],data[3]);
                break;
            case gl.DEPTH_CLEAR_VALUE:
                gl.clearDepth(data);
                break;
            case gl.STENCIL_CLEAR_VALUE:
                gl.clearStencil(data);
                break;
            case gl.TEXTURE_BINDING_2D:
                gl.bindTexture(gl.TEXTURE_2D,data);
                break;
            case gl.FRAMEBUFFER_BINDING:
                gl.bindFramebuffer(gl.FRAMEBUFFER,data);
                break;
            case gl.ARRAY_BUFFER_BINDING:
                gl.bindBuffer(gl.ARRAY_BUFFER,data);
                break;
            case gl.ELEMENT_ARRAY_BUFFER:
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,data);
                break;
            case gl.CULL_FACE:
                if(data){
                    gl.enable(gl.CULL_FACE);
                }
                else{
                    gl.disable(gl.CULL_FACE);
                }
                break;

        }
    }
}