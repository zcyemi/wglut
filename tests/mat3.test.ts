import * as chai from 'chai';
import { pairwise, expectPair, expectVec3, expectVec4, expectQuat, expectMat3 } from './helper/GLTestHelper';
import { glmath, vec3, vec4, mat3, mat4, quat } from '../src/wglut';

const expect = chai.expect;


describe('mat3',()=>{
    it("mat3-decompose",()=>{
        for(let i=0;i< 20;i++){
            let q = quat.Random();
            let s = vec3.Random();
            let mat1 = mat3.fromRS(q,s);
            let q1 = quat.Identity;
            let s1 = vec3.zero;
            mat3.DecomposeRS(mat1,q1,s1);
            let mat2 = mat3.fromRS(q1,s1);
            expectMat3(mat2,mat1);
            expect(q1.magnitude()).closeTo(1.0,0.0001);
            let p = vec3.Random();
            let p1 = mat1.mulvec(p);
            let p2 = mat2.mulvec(p);
            expectVec3(p1,p2);
        }
    })

    it("mat3-transpose", () => {
        let mtx = new mat3([
            3, 5, -1,
            4, -7, 0,
            2, 6, 3
        ]);
        let mtxtt = mtx.transpose().transpose();
        expectPair(mtx.raw, mtxtt.raw);
    })

    it("mat3-cross-lhs", () => {
        let v1 = new vec3([1, 4, 6]);
        let v2 = new vec3([-6, -7, 2]);
        let c1 = vec3.Cross(v1, v2);
        let mtxclhs = mat3.Cross(v1);
        let c2 = mtxclhs.mulvec(v2);
        expectPair(c1.raw, c2.raw);
    })

    it("mat3-cross-rhs", () => {
        let v1 = new vec3([1, 4, 6]);
        let v2 = new vec3([-6, -7, 2]);
        let c1 = v1.cross(v2);
        let mtxclhs = mat3.CrossRHS(v2);
        let c2 = mtxclhs.mulvec(v1);
        expectPair(c1.raw, c2.raw);
    })

    it("mat3-mul-vec", () => {
        let m = new mat3([5, 6, 4, 8, 9, 7, -4, -5, -2]);
        let v = m.mulvec(new vec3([2, -3, 1]));
        expectPair(v.raw, [-18, -20, -15]);

        let m4 = m.toMat4();
        let v4 = m4.mulvec(new vec4([2, -3, 1, 0]));
        expectPair(v4.raw, [-18, -20, -15, 0]);
    })

    it("mat3-rotation", () => {
        let mtx = mat3.Rotation(quat.fromEulerDeg(60.9, -75.2, 17.4));
        let q = quat.fromEulerDeg(60.9, -75.2, 17.4);
        let v = vec3.Random();
        let v1 = mtx.mulvec(v);
        let v2 = q.rota(v);

        expectPair(v1.raw, v2.raw);
    })

    it("mat3-toMat4", () => {
        let rota = quat.Random();
        let v = vec3.Random();
        let rmat3 = mat3.Rotation(rota);
        let rmat4 = rmat3.toMat4();
        let v1 = rmat3.mulvec(v).vec4();
        let v2 = rmat4.mulvec(v.vec4(0));
        expectPair(v1.raw, v2.raw, 0.00001);
    })

    it("mat3-clone", () => {
        let mtx = mat4.TRS(vec3.Random(), quat.Random(), vec3.Random());

        let mtxc = mtx.clone();
        mtx.raw[4] = 123;
        expect(mtxc.raw[4]).to.that.not.eq(mtx.raw[4]);
    })

    it("mat3-decompose-1", () => {
        let s = glmath.vec3(1, 2, 3);
        let q = quat.fromEulerDeg(30, 20, 70);
        let mtx = mat3.fromRS(q, s);
        let qt:quat = new quat();
        let st:vec3 = new vec3();
        mat3.DecomposeRS(mtx,qt,st);
        expectVec3(s, st);
        expectQuat(q, qt);
    })

    it("mat3-determination", () => {
        for (let i = 0; i < 20; i++) {
            let s = vec3.Random();
            let m = mat3.fromRS(quat.Random(), s);
            expect(m.determinant()).closeTo(s.x * s.y * s.z, 0.0001);
        }
    })


})