import { vec3, vec4 } from "./GLVec";
import { quat } from "./GLQuaternion";

export class glmath{


    public static vec3(x:number,y:number,z:number):vec3{
        return new vec3([x,y,z]);
    }

    public static vec4(x:number,y:number,z:number,w:number):vec4{
        return new vec4([x,y,z,w]);
    }

    public static quat(x:number,y:number,z:number,w:number){
        return new quat([x,y,z,w]);
    }

    public static clamp(v:number,min:number,max:number){
        return v > max ? max: (v < min? min: v);
    }


}