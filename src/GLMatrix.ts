import { vec4, vec3 } from "./GLVec";


export class mat4{
    public raw: number[];

    public constructor(v?: number[]) {
        if (v != null) {
            this.raw = v;
        }
        else {
            this.raw = new Array<number>(16);
        }
    }

    public column(index:number):vec4{
        let raw = this.raw;
        let o = index * 4;
        return new vec4([raw[o], raw[o + 1], raw[o + 2], raw[o + 3]]);
    }

    public row(index:number):vec4{
        let raw = this.raw;
        let o = index;
        return new vec4([raw[o], raw[o + 4], raw[o + 8], raw[o + 12]]);
    }

    public static readonly Identity:mat4 = new mat4([
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1]);

}

export class mat3{
    public raw: number[];

    public constructor(v?: number[]) {
        if (v != null) {
            this.raw = v;
        }
        else {
            this.raw = new Array<number>(9);
        }
    }

    public column(index:number):vec3{
        let raw = this.raw;
        let o = index * 3;
        return new vec3([raw[o], raw[o + 1], raw[o + 2]]);
    }

    public row(index:number):vec3{
        let raw = this.raw;
        let o = index;
        return new vec3([raw[o], raw[o + 4], raw[o + 8]]);
    }

    public static readonly Identity:mat3 = new mat3([1,0,0,0,1,0,0,0,1]);
}