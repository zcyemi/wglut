import { vec3, vec4 } from "./GLVec";

export class glmath{


    public static vec3(x:number,y:number,z:number):vec3{
        return new vec3([x,y,z]);
    }

    public static vec4(x:number,y:number,z:number,w:number):vec4{
        return new vec4([x,y,z,w]);
    }

}