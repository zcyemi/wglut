import { vec3 } from "./GLVec";
import { glmath } from "./GLMath";


const DEG2RAD_HALF = Math.PI / 360.0;
const RAD2DEG = 180.0 / Math.PI;

export class quat {

    public raw: number[];

    public get x(): number { return this.raw[0]; }
    public get y(): number { return this.raw[1]; }
    public get z(): number { return this.raw[2]; }
    public get w(): number { return this.raw[3]; }

    public set x(v: number) { this.raw[0] = v; }
    public set y(v: number) { this.raw[1] = v; }
    public set z(v: number) { this.raw[2] = v; }
    public set w(v: number) { this.raw[3] = v; }

    public constructor(v?: number[]) {
        if (v != null) {
            this.raw = v;
        }
        else {
            this.raw = [0, 0, 0, 0];
        }
    }

    public mul(r: quat) {
        let l = this;
        return new quat([
            r.w * l.x + l.w * r.x + l.y * r.z - l.z * r.y,
            r.w * l.y + l.w * r.y + l.z * r.x - l.x * r.z,
            r.w * l.z + l.w * r.z + l.x * r.y - l.y * r.x,
            r.w * l.w - l.x * r.x - l.y * r.y - l.z * r.z
        ])
    }

    public static readonly Identity: quat = new quat([
        0, 0, 0, 1
    ]);

    public rota(p: vec3) {
        var q = new vec3([this.x, this.y, this.z]);
        var t = q.cross(p).mul(2);
        return p.add(t.mul(this.w)).add(q.cross(t));
    }

    public static fromEuler(degx: number, degy: number, degz: number) {
        let rx = degx * DEG2RAD_HALF;
        let ry = degy * DEG2RAD_HALF;
        let rz = degz * DEG2RAD_HALF;

        let cosx = Math.cos(rx);
        let cosy = Math.cos(ry);
        let cosz = Math.cos(rz);
        let sinx = Math.sin(rx);
        let siny = Math.sin(ry);
        let sinz = Math.sin(rz);

        return new quat([
            sinx * cosy * cosz + cosx * siny * sinz,
            cosx * siny * cosz - sinx * cosy * sinz,
            cosx * cosy * sinz + sinx * siny * cosz,
            cosx * cosy * cosz - sinx * siny * sinz
        ]);
    }


    public toEuler() {
        let v = new vec3();
        let y = this.y;
        let x = this.x;
        let z = this.z;
        let w = this.w;
        let ysqr = y * y;
        var t0 = +2.0 * (w * x + y * z);
        var t1 = +1.0 - 2.0 * (x * x + ysqr);
        v.x = Math.atan2(t0, t1) * RAD2DEG;
        var t2 = +2.0 * (w * y - z * x);
        t2 = glmath.clamp(t2, -1, 1);
        v.y = Math.asin(t2) * RAD2DEG;
        var t3 = +2.0 * (w * z + x * y);
        var t4 = +1.0 - 2.0 * (ysqr + z * z);
        v.z = Math.atan2(t3, t4) * RAD2DEG;
        return v;
    }

    public axisRotation(axis:vec3,angle:number){
        let d = 1.0/ axis.lenth;
        let sin = Math.sin(angle /2);
        let cos = Math.cos(angle /2);
        let v4 = axis.mul(d * sin).vec4(cos);
        return new quat(v4.raw);
    }

    public equals(q: quat) {
        return this.x == q.x && this.y == q.y && this.z == q.z && this.w == q.w;
    }



    public determination() {
        let x = this.x;
        let y = this.y;
        let z = this.z;
        let w = this.w;

        return x * x + y * y + z * z + w * w;
    }


}