import { mat4, mat3 } from "./GLMatrix";
import { quat } from "./GLQuaternion";
import { glmath } from "./GLMath";

export class vec4 {

    public raw: number[];

    public get x(): number { return this.raw[0]; }
    public get y(): number { return this.raw[1]; }
    public get z(): number { return this.raw[2]; }
    public get w(): number { return this.raw[3]; }

    public set x(v: number) { this.raw[0] = v; }
    public set y(v: number) { this.raw[1] = v; }
    public set z(v: number) { this.raw[2] = v; }
    public set w(v: number) { this.raw[3] = v; }

    public get lenth():number{
        return Math.sqrt(this.dot(this));
    }


    public constructor(v?: number[]) {
        if (v != null) {
            this.raw = v;
        }
        else {
            this.raw = [0, 0, 0, 0];
        }
    }

    public add(v: number | vec3 | vec4 | number[]) {
        if (v instanceof vec3 || v instanceof vec4) {
            let x = v.x + this.x;
            let y = v.y + this.y;
            let z = v.z + this.z;
            let w = ((v instanceof vec4) ? v.w : 0) + this.w;
            return glmath.vec4(x, y, z, w);
        }
        else if (v instanceof Array) {
            let x = v[0] + this.x;
            let y = v[1] + this.y;
            let z = v[2] + this.z;
            let w = v[3] + this.w;
            return glmath.vec4(x, y, z, w);
        }
        else {
            return glmath.vec4(this.x + v, this.y + v, this.z + v, this.w + v);
        }
    }

    public sub(v: number | vec3 | vec4 | number[]) {
        if (v instanceof vec3 || v instanceof vec4) {
            let x = v.x - this.x;
            let y = v.y - this.y;
            let z = v.z - this.z;
            let w = ((v instanceof vec4) ? v.w : 0) - this.w;
            return glmath.vec4(x, y, z, w);
        }
        else if (v instanceof Array) {
            let x = v[0] - this.x;
            let y = v[1] - this.y;
            let z = v[2] - this.z;
            let w = v[3] - this.w;
            return glmath.vec4(x, y, z, w);
        }
        else {
            return glmath.vec4(this.x - v, this.y - v, this.z - v, this.w - v);
        }
    }

    public mul(v: number | vec4 | mat4 | number[] | quat) {
        if (v instanceof vec4) {
            return glmath.vec4(v.x * this.x, v.y * this.y, v.z * this.z, v.w * this.w);
        }
        else if (v instanceof Array) {
            return glmath.vec4(v[0] * this.x, v[1] * this.y, v[2] * this.z, v[3] * this.w);
        }
        else if (v instanceof mat4) {
            return v.mulvec(this);
        }
        else if (v instanceof quat) {
            return null;
        }
        else {
            return glmath.vec4(this.x * v, this.y * v, this.z * v, this.w * v);
        }
    }

    public div(v:number){
        return glmath.vec4(this.x/v,this.y/v,this.z/v,this.w/v);
    }

    public vec3(): vec3 {
        return glmath.vec3(this.x, this.y, this.z);
    }

    public dot(v:vec4):number{
        return this.x* v.x + this.y*v.y+this.z* v.z + this.w* v.w;
    }
    
    public clone(): vec4 {
        return new vec4([this.x, this.y, this.z,this.w]);
    }

    public normalize():vec4{
        return this.div(this.lenth);
    }


}

export class vec3 {

    public raw: number[];

    public get x(): number { return this.raw[0]; }
    public get y(): number { return this.raw[1]; }
    public get z(): number { return this.raw[2]; }

    public set x(v: number) { this.raw[0] = v; }
    public set y(v: number) { this.raw[1] = v; }
    public set z(v: number) { this.raw[2] = v; }

    public get lenth():number{
        return Math.sqrt(this.dot(this));
    }

    public constructor(v?: number[]) {
        if (v != null) {
            this.raw = v;
        }
        else {
            this.raw = [0, 0, 0];
        }
    }

    public add(v: number | vec3 | vec4 | number[]): vec3 {
        if (v instanceof vec3 || v instanceof vec4) {
            let x = v.x + this.x;
            let y = v.y + this.y;
            let z = v.z + this.z;
            return glmath.vec3(x, y, z);
        }
        else if (v instanceof Array) {
            let x = v[0] + this.x;
            let y = v[1] + this.y;
            let z = v[2] + this.z;
            return glmath.vec3(x, y, z);
        }
        else {
            return glmath.vec3(this.x + v, this.y + v, this.z + v);
        }
    }

    public sub(v: number | vec3 | vec4 | number[]): vec3 {
        if (v instanceof vec3 || v instanceof vec4) {
            let x = v.x - this.x;
            let y = v.y - this.y;
            let z = v.z - this.z;
            return glmath.vec3(x, y, z);
        }
        else if (v instanceof Array) {
            let x = v[0] - this.x;
            let y = v[1] - this.y;
            let z = v[2] - this.z;
            return glmath.vec3(x, y, z);
        }
        else {
            return glmath.vec3(this.x - v, this.y - v, this.z - v);
        }
    }

    public mul(v: number | vec4 | mat3 | number[] | quat):vec3 {
        if (v instanceof vec3 || v instanceof vec4) {
            let x = v.x * this.x;
            let y = v.y * this.y;
            let z = v.z * this.z;
            return glmath.vec3(x, y, z);
        }
        else if (v instanceof Array) {
            let x = v[0] * this.x;
            let y = v[1] * this.y;
            let z = v[2] * this.z;
            return glmath.vec3(x, y, z);
        }
        else if (v instanceof mat3) {
            return vec3.zero;
        }
        else if (v instanceof quat) {
            return v.rota(this);
        }
        else {
            return glmath.vec3(this.x * v, this.y * v, this.z * v);
        }
    }

    public div(v:number){
        return glmath.vec3(this.x/v,this.y/v,this.z/v);
    }

    public vec4(w: number = 0) {
        return glmath.vec4(this.x, this.y, this.z, w);
    }

    public dot(v:vec3):number{
        return this.x* v.x + this.y*v.y+this.z* v.z;
    }

    public clone(): vec3 {
        return new vec3([this.x, this.y, this.z]);
    }

    public cross(v:vec3){
        return new vec3([
            this.y *v.z - this.z*v.y,
            this.z* v.x - this.x* v.z,
            this.x* v.y - this.y*v.x
        ]);
    }

    public normalize():vec3{
        return this.div(this.lenth);
    }

    public static readonly zero:vec3 = new vec3([0,0,0]);
    public static readonly one:vec3 = new vec3([1,1,1]);
}