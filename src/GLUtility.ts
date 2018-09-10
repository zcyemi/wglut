
type OnFrameFunc = (t:number)=>void;

export class GLUtility{


    private static s_animationFrameRegisted:boolean = false;

    private static s_animationFrameFunc:OnFrameFunc[]= [];


    public static registerOnFrame(f:OnFrameFunc){
        if(!GLUtility.s_animationFrameRegisted){
            window.requestAnimationFrame(GLUtility.onAnimationFrame);
            GLUtility.s_animationFrameRegisted = true;
        }

        GLUtility.s_animationFrameFunc.push(f);
    }

    public static removeOnFrame(f:OnFrameFunc){
        let func = GLUtility.s_animationFrameFunc;
        let index = func.indexOf(f);
        if(index >=0 ){
            GLUtility.s_animationFrameFunc = func.splice(index,1);
        }
    }

    private static onAnimationFrame(t:number){
        let func = GLUtility.s_animationFrameFunc;
        for(let i=0,len= func.length;i<len;i++){
            func[i](t);
        }
        window.requestAnimationFrame(GLUtility.onAnimationFrame);
    }
}