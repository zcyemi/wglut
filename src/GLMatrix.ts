import { vec4, vec3 } from "./GLVec";


export class mat4 {
    public raw: number[];

    public constructor(v?: number[]) {
        if (v != null) {
            this.raw = v;
        }
        else {
            this.raw = new Array<number>(16);
        }
    }

    public column(index: number): vec4 {
        let raw = this.raw;
        let o = index * 4;
        return new vec4([raw[o], raw[o + 1], raw[o + 2], raw[o + 3]]);
    }

    public row(index: number): vec4 {
        let raw = this.raw;
        let o = index;
        return new vec4([raw[o], raw[o + 4], raw[o + 8], raw[o + 12]]);
    }

    public static readonly Identity: mat4 = new mat4([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1]);

    public static lookAt(eye: vec3, target: vec3, up: vec3) {
        let vz = eye.sub(target).normalize();
        let vx = up.cross(vz).normalize();
        var vy = vz.cross(vx);

        return mat4.inverse(new mat4([
            vx.x, vx.y, vx.z, 0,
            vy.x, vy.y, vy.z, 0,
            vz.x, vz.y, vz.z, 0,
            -vx.dot(eye),
            -vy.dot(eye),
            -vz.dot(eye),
            1
        ]));
    }

    public static coord(pos: vec3, forward: vec3, up: vec3) {
        let vz = forward.normalize();
        let vy = up.normalize();
        let vx = vy.cross(vz);

        return new mat4([
            vx.x, vx.y, vx.z, 0,
            vy.x, vy.y, vy.z, 0,
            vz.x, vz.y, vz.z, 0,
            pos.x, pos.y, pos.z, 1
        ]);
    }

    public static perspective(w: number, h: number, n: number, f: number) {
        return new mat4([
            2 * n / w, 0, 0, 0,
            0, 2 * n / h, 0, 0,
            0, 0, (n + f) / (n - f), -1,
            0, 0, 2 * n * f / (n - f), 0
        ])
    }

    public static perspectiveFoV(fov: number, aspect: number, n: number, f: number) {
        let h = Math.tan(fov / 360.0 * Math.PI) * n * 2;
        let w = h * aspect;
        return this.perspective(w, h, n, f);
    }

    public inverse(): mat4 {
        return mat4.inverse(this);
    }

    public static inverse(mtx: mat4): mat4 {
        let m = mtx.raw;
        let dst = new Array<number>(16);

        var m00 = m[0 * 4 + 0];
        var m01 = m[0 * 4 + 1];
        var m02 = m[0 * 4 + 2];
        var m03 = m[0 * 4 + 3];
        var m10 = m[1 * 4 + 0];
        var m11 = m[1 * 4 + 1];
        var m12 = m[1 * 4 + 2];
        var m13 = m[1 * 4 + 3];
        var m20 = m[2 * 4 + 0];
        var m21 = m[2 * 4 + 1];
        var m22 = m[2 * 4 + 2];
        var m23 = m[2 * 4 + 3];
        var m30 = m[3 * 4 + 0];
        var m31 = m[3 * 4 + 1];
        var m32 = m[3 * 4 + 2];
        var m33 = m[3 * 4 + 3];
        var tmp_0 = m22 * m33;
        var tmp_1 = m32 * m23;
        var tmp_2 = m12 * m33;
        var tmp_3 = m32 * m13;
        var tmp_4 = m12 * m23;
        var tmp_5 = m22 * m13;
        var tmp_6 = m02 * m33;
        var tmp_7 = m32 * m03;
        var tmp_8 = m02 * m23;
        var tmp_9 = m22 * m03;
        var tmp_10 = m02 * m13;
        var tmp_11 = m12 * m03;
        var tmp_12 = m20 * m31;
        var tmp_13 = m30 * m21;
        var tmp_14 = m10 * m31;
        var tmp_15 = m30 * m11;
        var tmp_16 = m10 * m21;
        var tmp_17 = m20 * m11;
        var tmp_18 = m00 * m31;
        var tmp_19 = m30 * m01;
        var tmp_20 = m00 * m21;
        var tmp_21 = m20 * m01;
        var tmp_22 = m00 * m11;
        var tmp_23 = m10 * m01;

        var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

        dst[0] = d * t0;
        dst[1] = d * t1;
        dst[2] = d * t2;
        dst[3] = d * t3;
        dst[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
        dst[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
        dst[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
        dst[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
        dst[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
        dst[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
        dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
        dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
        dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
        dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
        dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
        dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));
        return new mat4(dst);
    }

    
    public static translate(v:vec3){
        return new mat4([
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            v.x,v.y,v.z,1
        ]);
    }

    public static mul(mtx:mat4,v:vec4):vec4{
        return new vec4([
            v.dot(mtx.row(0)),
            v.dot(mtx.row(1)),
            v.dot(mtx.row(2)),
            v.dot(mtx.row(3))
        ])
    }

    public mulvec(v:vec4):vec4{
        return mat4.mul(this,v);
    }

    public mul(n:mat4):mat4{
        let m0 = this.row(0);
        let m1 = this.row(1);
        let m2 = this.row(2);
        let m3 = this.row(3);

        let n0 = n.column(0);
        let n1 = n.column(1);
        let n2 = n.column(2);
        let n3 = n.column(3);

        return new mat4([
            m0.dot(n0),m0.dot(n1),m0.dot(n2),m0.dot(n3),
            m1.dot(n0),m1.dot(n1),m1.dot(n2),m1.dot(n3),
            m2.dot(n0),m2.dot(n1),m2.dot(n2),m2.dot(n3),
            m3.dot(n0),m3.dot(n1),m3.dot(n2),m3.dot(n3)
        ])
    }

}

export class mat3 {
    public raw: number[];

    public constructor(v?: number[]) {
        if (v != null) {
            this.raw = v;
        }
        else {
            this.raw = new Array<number>(9);
        }
    }

    public column(index: number): vec3 {
        let raw = this.raw;
        let o = index * 3;
        return new vec3([raw[o], raw[o + 1], raw[o + 2]]);
    }

    public row(index: number): vec3 {
        let raw = this.raw;
        let o = index;
        return new vec3([raw[o], raw[o + 4], raw[o + 8]]);
    }


    public static readonly Identity: mat3 = new mat3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
}