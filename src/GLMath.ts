import { isNumber } from "util";

const DEG2RAD_HALF = Math.PI / 360.0;
const DEG2RAD = Math.PI / 180.0;
const RAD2DEG = 180.0 / Math.PI;

export class glmath {
    public static vec3(x: number, y: number, z: number): vec3 {
        return new vec3([x, y, z]);
    }

    public static vec4(x: number, y: number, z: number, w: number): vec4 {
        return new vec4([x, y, z, w]);
    }

    public static quat(x: number, y: number, z: number, w: number) {
        return new quat([x, y, z, w]);
    }

    public static clamp(v: number, min: number, max: number) {
        return v > max ? max : (v < min ? min : v);
    }

    public static readonly Deg2Rad:number = DEG2RAD;
    public static readonly Rad2Deg:number = RAD2DEG;
}

export class Vec2{
    public raw:number[] = [0,0];
    public get x(): number { return this.raw[0]; }
    public get y(): number { return this.raw[1]; }
    public set x(v: number) { this.raw[0] = v; }
    public set y(v: number) { this.raw[1] = v; }

    public get maginatude(): number {
        let x = this.raw[0];
        let y = this.raw[1];
        return Math.sqrt(x*x+ y*y);
    }

    public constructor(v?:number[]){
        if(v!=null){
            this.raw[0] = v[0];
            this.raw[1] = v[1];
        } 
    }
    
    public add(v:Vec2):Vec2{
        this.x += v.x;
        this.y +=v.y;
        return this;
    }
    public addToRef(v:Vec2,ref?:Vec2):Vec2{
        if(ref == null){
            return new Vec2([this.x + v.x,this.y + v.y]);
        }
        else{
            ref.x = this.x + v.x;
            ref.y = this.y + v.y;
            return ref;
        }
    }
    public sub(v:Vec2):Vec2{
        this.x -= v.x;
        this.y -=v.y;
        return this;
    }
    public subToRef(v:Vec2,ref?:Vec2):Vec2{
        if(ref == null){
            return new Vec2([this.x - v.x,this.y - v.y]);
        }
        else{
            ref.x = this.x - v.x;
            ref.y = this.y - v.y;
            return ref;
        }
    }

    public mulNum(v:number){
        this.x*=v;
        this.y*=v;
    }
    public mulNumToRef(v:number,ref?:Vec2):Vec2{
        if(ref){
            ref.x = this.x *v;
            ref.y = this.y * v;
            return ref;
        }
        return new Vec2([this.x * v,this.y *v]);
    }

    public mul(v:Vec2){
        this.x *=v.x;
        this.y *= v.y;
    }

    public mulToRef(v:Vec2,ref?:Vec2):Vec2{
        if(ref){
            ref.x = this.x * v.x;
            ref.y = this.y * v.y;
            return ref;
        }
        return new Vec2([this.x * v.x,this.y * v.y]);
    }

    public div(v:Vec2){
        this.x /=v.x;
        this.y /= v.y;
    }

    public divToRef(v:Vec2,ref?:Vec2):Vec2{
        if(ref){
            ref.x = this.x / v.x;
            ref.y = this.y / v.y;
            return ref;
        }
        return new Vec2([this.x / v.x,this.y / v.y]);
    }

    public dot(v:Vec2):number{
        return this.x * v.x + this.y * v.y;
    }

    public clone():Vec2{
        return new Vec2([this.x,this.y]);
    }
    
    public get normalize():Vec2{
        this.mulNum(1.0/this.maginatude);
        return this;
    }

    public normalized():Vec2{
        return this.mulNumToRef(this.maginatude);
    }

    public set(v:Vec2){
        this.x = v.x;
        this.y = v.y;
    }

    public static get zero():Vec2{ return new Vec2()};
    public static get one():Vec2{ return new Vec2([1,1])};
}

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

    public get length(): number {
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

    public add(v: number | vec3 | vec4 | number[]):vec4{
        if (v instanceof vec3 || v instanceof vec4) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            this.w += ((v instanceof vec4) ? v.w : 0);
        }
        else if (v instanceof Array) {
            this.x += v[0];
            this.y += v[1];
            this.z += v[2];
            this.w += v[3];
        }
        else {
            this.x += v;
            this.y += v;
            this.z += v;
            this.w += v;
        }

        return this;
    }

    public addToRef(v: number | vec3 | vec4 | number[]) {
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


    public sub(v: number | vec3 | vec4 | number[]):vec4 {
        if (v instanceof vec3 || v instanceof vec4) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            this.w -= ((v instanceof vec4) ? v.w : 0);
        }
        else if (v instanceof Array) {
            this.x -= v[0];
            this.y -= v[1];
            this.z -= v[2];
            this.w -= v[3];
        }
        else {
            this.x -= v;
            this.y -= v;
            this.z -= v;
            this.w -= v;
        }
        return this;
    }

    public subToRef(v: number | vec3 | vec4 | number[]) {
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

    public mulNum(v:number){
        this.x *=v;
        this.y *=v;
        this.z *=v;
        this.w *=v;
        return this;
    }

    public mulNumToRef(v:number){
        return glmath.vec4(this.x * v, this.y * v, this.z * v, this.w * v);
    }

    public mul(v: number | vec4 | mat4 | number[] | quat):vec4{
        if (v instanceof vec4) {
            this.x *=v.x;
            this.y *=v.y;
            this.z *=v.z;
            this.w *=v.w;
        }
        else if (v instanceof Array) {
            this.x *= v[0];
            this.y *= v[1];
            this.z *= v[2];
            this.w *= v[3];
        }
        else if (v instanceof mat4) {
            this.raw =v.mulvec(this).raw;
        }
        else if (v instanceof quat) {
            this.raw = v.rota(new vec3([this.x,this.y,this.z])).raw;
        }
        else if(isNumber(v)){
            this.x *=v;
            this.y *=v;
            this.z *=v;
            this.w *=v;
        }
        return this;
    }

    public mulToRef(v: number | vec4 | mat4 | number[] | quat) {
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
        else if(isNumber(v)){
            return glmath.vec4(this.x * v, this.y * v, this.z * v, this.w * v);
        }
    }

    public div(v: number) {
        this.x /=v;
        this.y /=v;
        this.z /=v;
        this.w /=v;
        return this;
    }

    public divToRef(v: number) {
        return glmath.vec4(this.x / v, this.y / v, this.z / v, this.w / v);
    }

    public vec3(): vec3 {
        return glmath.vec3(this.x, this.y, this.z);
    }

    public dot(v: vec4): number {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    }

    public clone(): vec4 {
        return new vec4([this.x, this.y, this.z, this.w]);
    }

    public get normalize(): vec4 {
        return this.div(this.length);
    }

    /** return new vec4 ref */
    public normalized():vec4{
        return this.divToRef(this.length);
    }

    public static Random():vec4{
        return new vec4([Math.random(),Math.random(),Math.random(),Math.random()]);
    }

    public equals(v: vec4) {
        let r = this.raw;
        let rv = v.raw;
        for(let i=0;i<4;i++){
            if(r[i] != rv[i]) return false;
        }
        return true;
    }

    public set(v:vec4){
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
    }

    public static get zero(): vec4{ return new vec4();}
    public static get one(): vec4{return new vec4([1, 1, 1,1]);}
}

export class vec3 {

    public raw: number[];

    public get x(): number { return this.raw[0]; }
    public get y(): number { return this.raw[1]; }
    public get z(): number { return this.raw[2]; }

    public set x(v: number) { this.raw[0] = v; }
    public set y(v: number) { this.raw[1] = v; }
    public set z(v: number) { this.raw[2] = v; }

    public get length(): number {
        return Math.sqrt(this.dot(this));
    }

    public get length2():number{
        let x = this.x;
        let y = this.y;
        let z = this.z;
        return x*x + y* y +z*z;
    }

    public constructor(v?: number[]) {
        if (v != null) {
            this.raw = v;
        }
        else {
            this.raw = [0, 0, 0];
        }
    }

    public add(v: number | vec3 | vec4 | number[]):vec3{
        if (v instanceof vec3 || v instanceof vec4) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
        }
        else if (v instanceof Array) {
            this.x += v[0];
            this.x += v[1];
            this.x += v[2];
        }
        else {
            this.x +=v;
            this.y +=v;
            this.z +=v;
        }
        return this;
    }

    public addToRef(v: number | vec3 | vec4 | number[]):vec3{
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
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
        }
        else if (v instanceof Array) {
            this.x -= v[0];
            this.y -= v[1];
            this.z -= v[2];
        }
        else {
            this.x -= v;
            this.y -= v;
            this.z -= v;
        }
        return this;
    }

    public subToRef(v: number | vec3 | vec4 | number[]): vec3 {
        if (v instanceof vec3 || v instanceof vec4) {
            let x = this.x - v.x;
            let y = this.y - v.y;
            let z = this.z - v.z;
            return glmath.vec3(x, y, z);
        }
        else if (v instanceof Array) {
            let x = this.x- v[0];
            let y = this.y- v[1];
            let z = this.z- v[2];
            return glmath.vec3(x, y, z);
        }
        else {
            return glmath.vec3(this.x - v, this.y - v, this.z - v);
        }
    }

    /**
     * multiply a number
     * @param n
     */
    public mulNum(n:number):vec3{
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    }

    public mulNumToRef(n:number):vec3{
        return glmath.vec3(this.x *n ,this.y *n ,this.z *n);
    }


    public mul(v: number | vec3 | vec4 | mat3 | number[] | quat): vec3 {
        if (v instanceof vec3 || v instanceof vec4) {
            this.x *=v.x;
            this.y *=v.y;
            this.z *=v.z;
        }
        else if (v instanceof Array) {
            this.x *= v[0];
            this.y *= v[1];
            this.z *= v[2];
        }
        else if (v instanceof mat3) {
            this.raw = v.mulvec(this).raw;
        }
        else if (v instanceof quat) {
            this.raw = v.rota(this).raw;
        }
        else {
            this.x *=v;
            this.y *=v;
            this.z *=v;
        }
        return this;
    }

    public mulToRef(v: number | vec3 | vec4 | mat3 | number[] | quat): vec3 {
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

    public div(v: number):vec3 {
        this.x /=v;
        this.y /=v;
        this.z /=v;
        return this;
    }

    public divToRef(v: number):vec3 {
        return glmath.vec3(this.x / v, this.y / v, this.z / v);
    }

    public vec4(w: number = 0):vec4{
        return glmath.vec4(this.x, this.y, this.z, w);
    }

    public dot(v: vec3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    public clone(): vec3 {
        return new vec3([this.x, this.y, this.z]);
    }

    /**
     * CrossProduct operation
     * @param rhs right hand side
     */
    public cross(rhs: vec3) {
        return vec3.Cross(this,rhs);
    }

    /**
     * Reverse CrossProduct operation
     * @param lhs left hand side
     */
    public crossRev(lhs: vec3) {
        return vec3.Cross(lhs,this);
    }

    public static Cross(lhs:vec3,rhs:vec3):vec3{
        return new vec3([
            lhs.y * rhs.z - lhs.z * rhs.y,
            lhs.z * rhs.x - lhs.x * rhs.z,
            lhs.x * rhs.y - lhs.y * rhs.x
        ]);
    }

    public static SafeCross(lhs:vec3,rhs:vec3):vec3{
        let c = new vec3([
            lhs.y * rhs.z - lhs.z * rhs.y,
            lhs.z * rhs.x - lhs.x * rhs.z,
            lhs.x * rhs.y - lhs.y * rhs.x
        ]);
        if(c.x == 0 && c.y == 0 && c.z == 0){
            return this.Cross(lhs.addToRef([0.0000001,0.0000001,0.0000001]),rhs);
        }
        return c;
    }

    public static Dot(v1: vec3, v2: vec3) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    public static Add(v1:vec3,v2:vec3){
        return new vec3([v1.x+v2.x,v1.y+v2.y,v1.z+v2.z]);
    }

    public get normalize(): vec3 {
        return this.div(this.length);
    }

    public normalized(): vec3 {
        return this.divToRef(this.length);
    }

    public static Random():vec3{
        return new vec3([Math.random() - 0.5,Math.random()  - 0.5,Math.random()  - 0.5]);
    }

    public static Abs(v:vec3):vec3{
        return new vec3([Math.abs(v.x),Math.abs(v.y),Math.abs(v.z)]);
    }

    public set(v:vec3){
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }

    public static get zero(): vec3 { return new vec3([0, 0, 0]) };
    public static get one(): vec3 { return new vec3([1, 1, 1]) };
    public static get up(): vec3 { return new vec3([0, 1, 0]) };
    public static get forward(): vec3 { return new vec3([0, 0, 1]) };
    public static get back(): vec3 { return new vec3([0, 0, -1]) };
    public static get left(): vec3 { return new vec3([-1, 0, 0]) };
    public static get right(): vec3 { return new vec3([1, 0, 0]) };
    public static get down(): vec3 { return new vec3([0, -1, 0]); }
}

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

    public conjugate():quat{
        return quat.Conjugate(this);
    }

    public mul(r: quat):quat {
        let l = this;
        let rw = r.w;
        let rx = r.x;
        let ry = r.y;
        let rz = r.z;
        let lx = l.x;
        let ly = l.y;
        let lz = l.z;
        let lw = l.w;

        return new quat([
            rw * lx + lw * rx + ly * rz - lz * ry,
            rw * ly + lw * ry + lz * rx - lx * rz,
            rw * lz + lw * rz + lx * ry - ly * rx,
            rw * lw - lx * rx - ly * ry - lz * rz
        ])
    }

    /**
     * Multiply self with quat <param l>, then return self
     * @param l
     */
    public selfRota(l:quat):quat{
        let rw = this.w;
        let rx = this.x;
        let ry = this.y;
        let rz = this.z;
        let lx = l.x;
        let ly = l.y;
        let lz = l.z;
        let lw = l.w;

        this.x = rw * lx + lw * rx + ly * rz - lz * ry;
        this.y = rw * ly + lw * ry + lz * rx - lx * rz;
        this.z = rw * lz + lw * rz + lx * ry - ly * rx;
        this.w = rw * lw - lx * rx - ly * ry - lz * rz;

        return this;
    }



    /**
     * Identity quaternion [0,0,0,1]
     */
    public static get Identity(): quat{
        return new quat([
            0, 0, 0, 1
        ]);
    }

    /**
     * Rotate vector by self
     * @param v
     */
    public rota(v: vec3):vec3 {
        var q = new vec3([this.x, this.y, this.z]);
        var t = q.cross(v).mul(2);
        return v.clone().add(t.mulToRef(this.w)).add(q.cross(t));
    }

    /**
     * Convert euler angle (degree) to quaternion
     * width order Z-X-Y
     * @param degx
     * @param degy
     * @param degz
     */
    public static fromEulerDeg(degx: number, degy: number, degz: number) {
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
            cosx * cosy * sinz - sinx * siny * cosz,
            cosx * cosy * cosz + sinx * siny * sinz
        ]);
    }

    /**
     * Convert euler angle (radians) to quaternion
     * width order Z-X-Y
     * @param rx
     * @param ry
     * @param rz
     */
    public static fromEuler(rx: number, ry: number, rz: number) {
        let rxh = rx/2.0;
        let ryh = ry/2.0;
        let rzh = rz/2.0;
        let cosx = Math.cos(rxh);
        let cosy = Math.cos(ryh);
        let cosz = Math.cos(rzh);
        let sinx = Math.sin(rxh);
        let siny = Math.sin(ryh);
        let sinz = Math.sin(rzh);
        return new quat([
            sinx * cosy * cosz + cosx * siny * sinz,
            cosx * siny * cosz - sinx * cosy * sinz,
            cosx * cosy * sinz - sinx * siny * cosz,
            cosx * cosy * cosz + sinx * siny * sinz
        ]);
    }


    /**
     * Convert quaternion to Euler angle (radians).
     * Z-X-Y order
     */
    public toEuler():vec3{
        let v = new vec3();
        let x = this.z;
        let y = this.x;
        let z = this.y;
        let w = this.w;
        let t0 = 2.0 * (w * x + y * z);
        let t1 = 1.0 - 2.0 * (x * x + y * y);
        v.z = Math.atan2(t0, t1);

        let t2 = 2.0 * (w * y - z * x);
          if(t2 > 1.0) {
          t2 = 1.0;
        } else if(t2 < -1.0){
            t2 = -1.0;
        }
        v.x = Math.asin(t2);
        let t3 = 2.0 * (w * z + x * y);
        let t4 = 1.0 - 2.0 * (y * y + z * z);
        v.y = Math.atan2(t3, t4);
        return v;
    }

    /**
     * Covert quaternion to Euler angle (degree).
     */
    public toEulerDeg(): vec3 {
        let v = new vec3();
        let x = this.z;
        let y = this.x;
        let z = this.y;
        let w = this.w;
        let t0 = 2.0 * (w * x + y * z);
        let t1 = 1.0 - 2.0 * (x * x + y * y);
        v.z = Math.atan2(t0, t1) * RAD2DEG;

        let t2 = 2.0 * (w * y - z * x);
          if(t2 > 1.0) {
          t2 = 1.0;
        } else if(t2 < -1.0){
            t2 = -1.0;
        }
        v.x = Math.asin(t2) * RAD2DEG;
        let t3 = 2.0 * (w * z + x * y);
        let t4 = 1.0 - 2.0 * (y * y + z * z);
        v.y = Math.atan2(t3, t4) * RAD2DEG;
        return v;
    }

    public static axisRotation(axis: vec3, angle: number) {
        let d = 1.0 / axis.length;
        let sin = Math.sin(angle / 2);
        let cos = Math.cos(angle / 2);
        let v4 = axis.mulToRef(d * sin).vec4(cos);
        return new quat(v4.raw);
    }

    public get axis():vec3{
        let magnitude = this.magnitude2();
        if(magnitude >= 1.0000001){
            throw new Error();
        }

        let w = this.w
        let sin = Math.sqrt(1.0 -w *w);
        
        return glmath.vec3(this.x/sin,this.y/sin,this.z/sin);
    }


    public static axisRotationDeg(axis: vec3, deg: number) {
        let angle = deg * DEG2RAD;
        let d = 1.0 / axis.length;
        let sin = Math.sin(angle / 2);
        let cos = Math.cos(angle / 2);
        let v4 = axis.mulToRef(d * sin).vec4(cos);
        return new quat(v4.raw);
    }

    /**
     * Calculate quaternion of rotation of vec3[from] -> vec3[to]
     * @param from
     * @param to
     * @param normal
     */
    public static FromToNormal(from:vec3,to:vec3,normal:vec3){
        let f = from.normalized();
        let t = to.normalized();
        let n = normal.normalized();
        let cross = vec3.Cross(f,t);

        let croosLen2 = cross.length2;
        if(croosLen2 == 0){
            let dot = f.dot(t);
            if(dot == 1){
                return quat.Identity;
            }
            let cr = vec3.Cross(n,f);
            let cu = vec3.Cross(f,cr);
            let nor = cu.normalize;
            return new quat([nor.x,nor.y,nor.z,0]);
        }
        cross.div(Math.sqrt(croosLen2));
        let cos = f.dot(t);
        let cosh = Math.sqrt((1+cos)/2.0);
        let sinh =  Math.sqrt((1-cos)/2.0);

        let cdotn = cross.dot(n);
        if(cdotn < 0){
            cross.mul(-1.0);
            cosh *=-1.0;
        }
        return new quat([cross.x * sinh,cross.y * sinh,cross.z * sinh,cosh]);
    }

    public static Coordinate(forward:vec3,up:vec3):quat{
        if(forward.dot(up) >Number.EPSILON){
            throw new Error("<forward> must be perpendicular ot <up>");
        }
        let f = forward.normalized();
        let u =  up.normalized();

        let qf = quat.FromToNormal(vec3.forward,f,u);
        let u1 = qf.rota(vec3.up);
        let qu = quat.FromToNormal(u1,up,f);
        return qu.mul(qf);
    }

    public static QuatToMtx(q:quat):mat3{
        let x = q.x;
        let y = q.y;
        let z = q.z;
        let w = q.w;
        let x2 = 2 * x * x;
        let y2 = 2 * y * y;
        let z2 = 2 * z * z;

        let xy2 = x * y * 2;
        let yz2 = y * z * 2;
        let zx2 = z * x * 2;

        let wx2 = w * x * 2;
        let wy2 = w * y * 2;
        let wz2 = w * z * 2;

        return new mat3([
            1 - y2 - z2, xy2 + wz2, zx2 - wy2,
            xy2 - wz2, 1 - x2 - z2, yz2 + wx2,
            zx2 + wy2, yz2 - wx2, 1 - x2 - y2
        ]);

    }
    public static Conjugate(q:quat):quat{
        return new quat([-q.x,-q.y,-q.z,q.w]);
    }

    /**
     * Flip coordinate axis of quaternion
     * @param q 
     * @param xaxis 
     * @param yaxis 
     * @param zaxis 
     */
    public static Flip(q:quat,xaxis:boolean,yaxis:boolean,zaxis:boolean):quat{
        let r = q.clone();
        let c = 0;
        if(xaxis){
            r.x = - r.x;
            c++;
        }
        if(yaxis){
            r.y = -r.y;
            c++;
        }
        if(zaxis){
            r.z = -r.z;
            c++;
        }
        if(c %2 == 1){
            r.x = -r.x;
            r.y = -r.y;
            r.z = -r.z;
        }
        return r;
    }
    /**
     * div LHS quat by default
     * @param p 
     * @param q 
     * @param rhs false: p = rq, true: p =qr
     */
    public static Div(p:quat,q:quat,rhs:boolean = false): quat{
        if(rhs){
            return p.mul(q.conjugate());
        }
        else{
            return q.conjugate().mul(p);
        }
    }
    public static MtxToQuat(mtx:mat3){
        let raw = mtx.raw;
        let a1 = raw[1];
        let a2 = raw[2];
        let a3 = raw[3];
        let a5 = raw[5];
        let a7 = raw[7];
        let a8 = raw[8];
        let a0 = raw[0];
        let a4 = raw[4];
        let a6 = raw[6];
        let w2 = (a0 + a4 + 1 + a8)/4;
        let x2 = (a0 + 1 - 2*w2)/2;
        let x = Math.sqrt(x2);
        let y =0;
        let z =0;
        let w = 0;
        if(x < 0.000001){
            x = 0;
            let y2 = 1- a8;
            if(y2 == 0){
                y =0;
                let zw = -a3/2.0;
                w = Math.sqrt((a0+1)/2.0);
                z = w == 0 ? 1.0: zw/w;
            }
            else{
                y = Math.sqrt(y2/2.0);
                z = a7 /2.0 / y;
                w = a6 / 2.0 /y;
            }
        }
        else{
            y = (a1 + a3)/4.0 /x;
            if(y == 0){
                z = a2 / 2.0 / x;
                w = a7 / -2.0 / x;
            }
            else{
                z = (a5+a7)/4.0 / y;
                w = z == 0 ? (a7 / -2.0 / x):((a1 - a3) /4.0/z);
            }
        }
        return new quat([x,y,z,w]);
    }
    public equals(q: quat) {
        let qraw = (q.w * this.w < 0) ? [-q.x,-q.y,-q.z,-q.w] : q.raw;
        for(let i=0;i<4;i++){
            if(Math.abs(qraw[i] - this.raw[i]) > 0.001) return false;
        }
        return true;
    }
    public magnitude2():number{
        let x = this.x;
        let y = this.y;
        let z = this.z;
        let w = this.w;
        return x * x + y * y + z * z + w * w;
    }
    public magnitude():number{
        return Math.sqrt(this.magnitude2());
    }
    public clone():quat{
        return new quat([this.x,this.y,this.z,this.w]);
    }
    public static Random():quat{
        return quat.axisRotation(glmath.vec3(Math.random(),Math.random(),Math.random()),Math.PI * 2 * Math.random());
    }
    public set(q:quat){
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w;
    }
}

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

    public static get Identity(): mat4 {
        return new mat4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1]);
    }

    public static lookAt(eye: vec3, target: vec3, up: vec3) {
        let vz = eye.subToRef(target).normalize;
        let vx = up.cross(vz).normalize;
        var vy = vz.cross(vx).normalize;

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

    /**
     * Build coordinate change matrix RH->RH LH->LH
     * @param pos pos
     * @param forward dir
     * @param up dir
     */
    public static coord(pos: vec3, forward: vec3, up: vec3):mat4{
        let f = forward.normalized();
        let u = up.normalized();
        let r = u.cross(f).normalize;
        u = f.cross(r).normalize;
        return new mat4([
            r.x, u.x, f.x, 0,
            r.y, u.y, f.y, 0,
            r.z, u.z, f.z, 0,
            -r.dot(pos), -u.dot(pos), -f.dot(pos), 1
        ]);
    }

    /**
     * Build matrix for coordinate conversion RH->LH LH->RH
     * @param pos pos
     * @param forward dir
     * @param up dir
     */
    public static coordCvt(pos: vec3, forward: vec3, up: vec3) {
        let f = forward.normalized();
        let u = up.normalized();
        let r = u.crossRev(f).normalize;
        u = f.crossRev(r).normalize;
        return new mat4([
            r.x, u.x, f.x, 0,
            r.y, u.y, f.y, 0,
            r.z, u.z, f.z, 0,
            -r.dot(pos), -u.dot(pos), -f.dot(pos), 1
        ]);
    }

    /**
     * Left Hand Coordinate
     * @param w
     * @param h
     * @param n
     * @param f
     */
    public static perspective(w: number, h: number, n: number, f: number) {
        return new mat4([
            2 * n / w, 0, 0, 0,
            0, 2 * n / h, 0, 0,
            0, 0, (n + f) / (n - f), -1,
            0, 0, 2 * n * f / (n - f), 0
        ])
    }


    /**
     * Left Hand Coordinate
     * @param fov
     * @param aspect
     * @param n
     * @param f
     */
    public static perspectiveFoV(fov: number, aspect: number, n: number, f: number) {
        let h = Math.tan(fov / 360.0 * Math.PI) * n * 2;
        let w = h * aspect;
        return this.perspective(w, h, n, f);
    }

    /**
     * Left Hand coordinate
     * @param w
     * @param h
     * @param n
     * @param f
     */
    public static orthographic(w:number,h:number,n:number,f:number){
        let d = f-n;
        return new mat4([
            2.0/w,0,0,0,
            0,2.0/h,0,0,
            0,0,2.0/d,0,
            0,0,-(n+f)/d,1
        ]);
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

    public static Translate(v:vec3){
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

    public add(m:mat4){
        return mat4.add(this,m);
    }

    public static add(m1:mat4,m2:mat4){
        let ary = [];
        let raw1 = m1.raw;
        let raw2 = m2.raw;
        for(var i=0;i<16;i++){
            ary.push(raw1[i] + raw2[i]);
        }
        return new mat4(ary);
    }

    public mulvec(v:vec4):vec4{
        return mat4.mul(this,v);
    }


    public mulnum(n:number):mat4{
        let nary = [];
        let raw = this.raw;
        for(var i=0;i<16;i++){
            nary.push(raw[i] *n);
        }
        return new mat4(nary);
    }

    public static Scale(scale:vec3):mat4{
        return new mat4([
            scale.x,0,0,0,
            0,scale.y,0,0,
            0,0,scale.z,0,
            0,0,0,1
        ]);
    }

    public static Rotation(q:quat):mat4{
        let mtx = quat.QuatToMtx(q).toMat4();
        return mtx;
    }
    public static RotationEler(rad:vec3):mat4{
        return mat3.Rotation(quat.fromEuler(rad.x,rad.y,rad.z)).toMat4();
    }

    public static TRS(translate:vec3,rota:quat,scale:vec3){
        let mtxr = quat.QuatToMtx(rota).raw;
        let x = scale.x;
        let y = scale.y;
        let z = scale.z;
        return new mat4([
            mtxr[0] * x, mtxr[1] * x, mtxr[2] * x, 0,
            mtxr[3] * y, mtxr[4] * y, mtxr[5] * y, 0,
            mtxr[6] * z, mtxr[7] * z, mtxr[8] * z, 0,
            translate.x, translate.y, translate.z, 1
        ]);
    }

    public setTRS(translate:vec3,rota:quat,scale:vec3){
        let raw = this.raw;
        let r = quat.QuatToMtx(rota).raw;
        let x = scale.x;
        let y = scale.y;
        let z = scale.z;
        raw[0] = r[0] * x;
        raw[1] = r[1] * x;
        raw[2] = r[2] * x;
        raw[3] = 0;
        raw[4] = r[3] * y;
        raw[5] = r[4] * y;
        raw[6] = r[5] * y;
        raw[7] = 0;
        raw[8] = r[6] * z;
        raw[9] = r[7] * z;
        raw[10] = r[8] * z;
        raw[11] = 0;
        raw[12] = translate.x;
        raw[13] = translate.y;
        raw[14] = translate.z;
        raw[15] = 1;
    }

    public set(mtx:mat4){
        let raw =this.raw;
        let mraw = mtx.raw;
        for(let i=0;i<16;i++){
            raw[i] = mraw[i];
        }
    }

    public mul(rhs:mat4):mat4{
        let m0 = this.row(0);
        let m1 = this.row(1);
        let m2 = this.row(2);
        let m3 = this.row(3);
        let n0 = rhs.column(0);
        let n1 = rhs.column(1);
        let n2 = rhs.column(2);
        let n3 = rhs.column(3);
        return new mat4([
            m0.dot(n0),m1.dot(n0),m2.dot(n0),m3.dot(n0),
            m0.dot(n1),m1.dot(n1),m2.dot(n1),m3.dot(n1),
            m0.dot(n2),m1.dot(n2),m2.dot(n2),m3.dot(n2),
            m0.dot(n3),m1.dot(n3),m2.dot(n3),m3.dot(n3)
        ])
    }

    public transpose():mat4{
        return mat4.Transpose(this);
    }

    public static Transpose(m:mat4){
        let raw = m.raw;
        return new mat4([
            raw[0],raw[4],raw[8],raw[10],
            raw[1],raw[5],raw[7],raw[11],
            raw[2],raw[6],raw[8],raw[12],
            raw[3],raw[7],raw[9],raw[13],
        ]);
    }

    /**
     * Decompose mat4 into translation rotation and scale, No shear
     * @param mat 
     * @param hasNegativeScale optimize when scale components all positive.
     * @returns [T,R,S]
     */
    public static Decompose(mat:mat4,hasNegativeScale?:boolean):[vec3,quat,vec3]{
        let raw = mat.raw;
        let t = glmath.vec3(raw[12],raw[13],raw[14]);

        let r0 = raw[0];
        let r1 = raw[1];
        let r2 = raw[2];

        let r4 = raw[4];
        let r5 = raw[5];
        let r6 = raw[6];

        let r8 = raw[8];
        let r9 = raw[9];
        let r10 = raw[10];

        let c0 = glmath.vec3(r0,r1,r2);
        let c1 = glmath.vec3(r4,r5,r6);
        let c2 = glmath.vec3(r8,r9,r10);
        let scale = glmath.vec3(c0.length,c1.length,c2.length);

        //
        if(hasNegativeScale == null || hasNegativeScale == true){
            let determinant = r0*(r5*r10-r6*r9)-r1*(r4*r10-r8*r6)+r2*(r4*r9-r5*r8);
            if(determinant <0) {
                scale.z = -scale.z; //set z to negative ensures that MtxToQuat not get the NaN value.
            }
        }

        let mtx3 = mat3.fromColumns(
            c0.div(scale.x),
            c1.div(scale.y),
            c2.div(scale.z)
        );

        let rota = quat.MtxToQuat(mtx3);
        if(isNaN(rota.w) || isNaN(rota.x) || isNaN(rota.y) || isNaN(rota.z)){
            throw new Error(`quat is NaN, ${mtx3.raw}`)
        }
        return [t,rota,scale];
    }

    /**
     * Decompose Affine Matrix
     * https://matthew-brett.github.io/transforms3d/reference/transforms3d.affines.html#decompose44?tdsourcetag=s_pctim_aiomsg
     * @param mat 
     * @param t translate
     * @param q rotation
     * @param s zoom [sx,sy,sz]
     * @param sk skew [sxy,sxz,syz]
     */
    public static DecomposeAffine(mat:mat4,t:vec3,q:quat,s:vec3,sk:vec3){
        let raw = mat.raw;
        t.x = raw[12];
        t.y = raw[13];
        t.z = raw[14];

        let r0 = raw[0];
        let r1 = raw[1];
        let r2 = raw[2];
        let r4 = raw[4];
        let r5 = raw[5];
        let r6 = raw[6];
        let r8 = raw[8];
        let r9 = raw[9];
        let r10 = raw[10];

        let M0 = glmath.vec3(r0,r1,r2);
        let M1 = glmath.vec3(r4,r5,r6);
        let M2 = glmath.vec3(r8,r9,r10);

        let sx = M0.length;
        M0.div(sx);
        let sx_sxy = M0.dot(M1);
        M1.sub(M0.mulNumToRef(sx_sxy)); //c1:= R1 * sy
        let sy = M1.length; //mag(R1) == 1
        M1.div(sy) // c1:= R1;
        let sxy = sx_sxy / sy;
        let sx_sxz =  M0.dot(M2);
        let sy_syz = M1.dot(M2);
        M2.sub(M0.mulNumToRef(sx_sxz).add(M1.mulNumToRef(sy_syz)));
        let sz = M2.length;
        M2.div(sz);
        let sxz = sx_sxz / sx;
        let syz = sy_syz / sy;

        let Rmat = mat3.fromColumns(M0,M1,M2);
        if(Rmat.determinant() < 0){
            sx *=-1;
            let raw = Rmat.raw;
            raw[0] *=-1;
            raw[1] *=-1;
            raw[2] *=-1;
        }
        q.set(quat.MtxToQuat(Rmat));
        s.x = sx;
        s.y = sy;
        s.z = sz;
        sk.x = sxy;
        sk.y = sxz;
        sk.z = syz;
    }

    /**
     * Decompose mat4 into translation and roataion with scale component provided.
     * @param mat 
     * @param scale 
     */
    public static DecomposeTR(mat:mat4,scale:vec3):[vec3,quat]{
        let raw = mat.raw;
        let t = glmath.vec3(raw[12],raw[13],raw[14]);
        let c0 = glmath.vec3(raw[0],raw[1],raw[2]);
        let c1 = glmath.vec3(raw[4],raw[5],raw[6]);
        let c2 = glmath.vec3(raw[8],raw[9],raw[10]);
        let rota = quat.MtxToQuat(mat3.fromColumns(
            c0.div(scale.x),
            c1.div(scale.y),
            c2.div(scale.z)
        ));
        return [t,rota];
    }

    public clone():mat4{
        let ary = this.raw.slice(0);
        return new mat4(ary);
    }

    public static RandomTRS():mat4{
        return mat4.TRS(vec3.Random(),quat.Random(),vec3.Random());
    }

    public mat3Determinant():number{
        let raw = this.raw;
        return raw[0]*(raw[5]* raw[10] - raw[6]* raw[9]) -
        raw[4]*(raw[1]* raw[10] - raw[2]* raw[9]) +
        raw[8]*(raw[1]* raw[6] - raw[2]* raw[5]);
    }

    public toMat3():mat3{
        let raw = this.raw;
        return new mat3([raw[0],raw[1],raw[2],
                        raw[4],raw[5],raw[6],
                        raw[8],raw[9],raw[10]])
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

    /**
     * Get column of matrix
     * @param index 
     */
    public column(index: number): vec3 {
        let raw = this.raw;
        let o = index * 3;
        return new vec3([raw[o], raw[o + 1], raw[o + 2]]);
    }

    /**
     * Get row of matrix
     * @param index 
     */
    public row(index: number): vec3 {
        let raw = this.raw;
        let o = index;
        return new vec3([raw[o], raw[o + 3], raw[o + 6]]);
    }

    public static get Identity(): mat3 {
        return new mat3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    }

    public static Transpose(m:mat3){
        let raw = m.raw;
        return new mat3([
            raw[0],raw[3],raw[6],
            raw[1],raw[4],raw[7],
            raw[2],raw[5],raw[8]
        ]);
    }

    public transpose():mat3{
        return mat3.Transpose(this);
    }

    public toMat4(){
        return mat3.ToMat4(this);
    }

    public static ToMat4(m:mat3){
        let r = m.raw;
        return new mat4([
            r[0],r[1],r[2],0,
            r[3],r[4],r[5],0,
            r[6],r[7],r[8],0,
            0,0,0,1
        ])
    }

    public static Cross(lhs:vec3){
        return new mat3([
            0, lhs.z, -lhs.y,
            -lhs.z,0,lhs.x,
            lhs.y,-lhs.x,0
        ])
    }

    /**
     * Create mat3 from composition of scaling and rotation.
     * @param rota 
     * @param s 
     */
    public static fromRS(rota:quat,s:vec3){
        return mat3.Mul(quat.QuatToMtx(rota),mat3.Scale(s.x,s.y,s.z));
    }

    public static Mul(lhs:mat3,rhs:mat3):mat3{
        let m0 = lhs.row(0);
        let m1 = lhs.row(1);
        let m2 = lhs.row(2);
        let n0 = rhs.column(0);
        let n1 = rhs.column(1);
        let n2 = rhs.column(2);
        return new mat3([
            m0.dot(n0),m1.dot(n0),m2.dot(n0),
            m0.dot(n1),m1.dot(n1),m2.dot(n1),
            m0.dot(n2),m1.dot(n2),m2.dot(n2)
        ])
    }
    
    public static fromRows(r0:vec3,r1:vec3,r2:vec3):mat3{
        return new mat3([
            r0.x,r1.x,r2.x,
            r0.y,r1.y,r2.y,
            r0.z,r1.z,r2.z
        ]);
    }

    public static fromColumns(c0:vec3,c1:vec3,c2:vec3):mat3{
        return new mat3([
            c0.x,c0.y,c0.z,
            c1.x,c1.y,c1.z,
            c2.x,c2.y,c2.z,
        ])
    }

    public mul(rhs:mat3):mat3{
        return mat3.Mul(this,rhs);
    }

    /**
     * Decompose mat3 into scale and rotation.
     * @param mat 
     */
    public static Decompose(mat:mat3):[quat,vec3]{

        let c0 = mat.column(0);
        let c1 = mat.column(1);
        let c2 = mat.column(2);

        let scale = glmath.vec3(c0.length,c1.length,c2.length);

        let rota = quat.MtxToQuat(mat3.fromColumns(
            c0.div(scale.x),
            c1.div(scale.y),
            c2.div(scale.z)
        ))

        return [rota,scale];
    }

    public static CrossRHS(rhs:vec3){
        return new mat3([
            0, -rhs.z, rhs.y,
            rhs.z,0,-rhs.x,
            -rhs.y,rhs.x,0
        ])
    }

    public mulvec(v:vec3):vec3{
        return mat3.MulVec(this,v);
    }

    public static MulVec(mat:mat3,v:vec3):vec3{
        return new vec3([
            mat.row(0).dot(v),
            mat.row(1).dot(v),
            mat.row(2).dot(v),
        ])
    }

    public static Scale(sx:number,sy:number,sz:number):mat3{
        return new mat3([
            sx,0,0,
            0,sy,0,
            0,0,sz
        ]);
    }

    // /**
    //  * Rotation matrix with order Z-Y-X
    //  * @param rx
    //  * @param ry
    //  * @param rz
    //  */
    // public static Rotation(rx:number, ry:number, rz:number): mat3 {
    //     let cosx = Math.cos(rx);
    //     let sinx = Math.sin(rx);
    //     let cosy = Math.cos(ry);
    //     let siny = Math.sin(ry);
    //     let cosz = Math.cos(rz);
    //     let sinz = Math.sin(rz);
    //     return new mat3([
    //         cosy * cosz, sinx * siny * cosz + cosx * sinz, -cosx * siny * cosz + sinx * sinz,
    //         -cosy * sinz, -sinx * siny * sinz + cosx * cosz, cosx * siny * sinz + sinx * cosz,
    //         siny, -sinx * cosy, cosx * cosy
    //     ]);
    // }

    // /**
    //  * Rotation matrix with order Z-Y-X
    //  * @param degx
    //  * @param degy
    //  * @param degz
    //  */
    // public static RotationDeg(degx:number,degy:number,degz:number){
    //     let rx = degx * DEG2RAD;
    //     let ry = degy * DEG2RAD;
    //     let rz = degz * DEG2RAD;

    //     return this.Rotation(rx,ry,rz);
    // }

    /**
     * Convert quaternion rotation to Matrix
     * @param q 
     */
    public static Rotation(q:quat):mat3{
        return quat.QuatToMtx(q);
    }

    public clone():mat3{
        let ary = this.raw.slice(0);
        return new mat3(ary);
    }

    public determinant():number{
        let raw = this.raw;
        return raw[0]*(raw[4]* raw[8] - raw[5]* raw[7]) -
        raw[3]*(raw[1]* raw[8] - raw[2]* raw[7]) +
        raw[6]*(raw[1]* raw[5] - raw[2]* raw[4]);
    }

}