import * as chai from 'chai';
import { pairwise, expectPair, expectVec3, expectVec4, expectQuat, expectMat3 } from './helper/GLTestHelper';
import { glmath, vec3, vec4, mat3, mat4, quat } from '../src/wglut';

const expect = chai.expect;


describe('mat4',()=>{
    it('mat4 inverse', () => {
        let m = new mat4([
            2, 4, 0, 0,
            1, 7, 6, 0,
            0, 5, 8, 0,
            20, -30, 4, 1
        ]);

        let inv = m.inverse();
        pairwise(inv.raw, (s, t) => {
            expect(s).to.closeTo(t, 0.0001);
        }, [
                1.3, -1.6, 1.2, 0,
                -0.4, 0.8, -0.6, 0,
                0.25, -0.5, 0.5, 0,
                -39, 58, -44, 1
            ])
    });

    it("Translate", () => {
        let v = vec3.Random();
        let v1 = vec3.Random();
        let mtx = mat4.Translate(v1);
        let v2 = v.addToRef(v1);
        let v3 = mtx.mulvec(v.vec4(1)).vec3();
        expectVec3(v2, v3);
    })

    it("Scale", () => {
        let v = vec3.Random();
        let s = vec3.Random();
        let mtx = mat4.Scale(s);
        let v1 = v.mulToRef(s).vec4();
        let v2 = mtx.mulvec(v.vec4());
        expectVec4(v1, v2);
    })

    it("TS", () => {
        let t = vec3.Random();
        let s = vec3.Random();
        let v = vec3.Random();
        let mtxt = mat4.Translate(t);
        let mtxs = mat4.Scale(s);

        let mtxts = mtxt.mul(mtxs);
        let v1 = v.mulToRef(s).add(t);
        let v2 = mtxts.mulvec(v.vec4(1)).vec3();

        expectVec3(v1, v2);
    })

    it("RS", () => {
        let r = quat.Random();
        let s = glmath.vec3(1, 2, -1);
        let v = vec3.Random();
        let v1 = r.rota(v.mulToRef(s)).vec4(1);

        let mtxs = mat4.Scale(s);
        let mtxr = mat4.Rotation(r);

        let v2 = mtxs.mulvec(v.vec4(1));
        let v3 = mtxr.mulvec(v2);

        let mtxrs = mtxr.mul(mtxs);
        let v4 = mtxrs.mulvec(v.vec4(1));
        expectVec4(v1, v3);
        expectVec4(v1, v4);
    });


    it("TRS-1", () => {
        let t = vec3.Random();
        let s = vec3.Random();
        let r = quat.Random();

        let trs = mat4.TRS(t, r, s);
        let trs1 = mat4.Translate(t).mul(mat4.Rotation(r).mul(mat4.Scale(s)));

        expectPair(trs.raw, trs1.raw);

    });


    it("TRS-2", () => {
        for (let i = 0; i < 10; i++) {
            let s = vec3.Random();
            let r = quat.Random();
            let t = vec3.Random();
            let mtx = mat4.TRS(t, r, s);
            let v = vec3.Random();
            let v1 = v.clone().mul(s).mul(r).add(t);
            let v2 = mtx.mulvec(v.vec4(1.0)).vec3();
            expectVec3(v1, v2);
        }
    })

    it("TRS-setTRS", () => {
        let mtx = mat4.TRS(vec3.zero, quat.Identity, vec3.one);
        let m = mat4.Identity;
        m.setTRS(vec3.zero, quat.Identity, vec3.one);
        expectPair(mtx.raw, m.raw);
    })

    it("Decompose TRS - 1", () => {
        let s = glmath.vec3(Math.random(), Math.random(), Math.random());
        let r = quat.Random();
        let t = vec3.Random();

        let mtx = mat4.TRS(t, r, s);

        let [tx, rx, sx] = mat4.Decompose(mtx);

        expectVec3(t, tx);
        expectVec3(s, sx);
        expectQuat(r, rx);
    })

    it("Decompose TRS - 2", () => {
        for (let i = 0; i < 20; i++) {
            let s = vec3.Random();
            let r = quat.Random();
            let t = vec3.Random();
            let mtx = mat4.TRS(t, r, s);
            let [tx, rx, sx] = mat4.Decompose(mtx);
            expect(rx.magnitude2()).closeTo(1.0, 0.0001);
        }
    })

    it("Decompose TRS- 3", () => {

        //translate
        let t1 = vec3.Random();
        let t2 = vec3.Random();
        expectVec3(t1.addToRef(t2), mat4.Decompose(mat4.Translate(t2).mul(mat4.Translate(t1)))[0]);
        //scale
        let s1 = vec3.Random();
        let s2 = vec3.Random();
        expectVec3(vec3.Abs(s1.mulToRef(s2)), vec3.Abs(mat4.Decompose(mat4.Scale(s2).mul(mat4.Scale(s1)))[2]));
        //rota
        let r1 = quat.Random();
        let r2 = quat.Random();
        expectQuat(r2.mul(r1), mat4.Decompose(mat4.Rotation(r2).mul(mat4.Rotation(r1)))[1]);

        //translate scale
        {
            let m1 = mat4.TRS(t1, quat.Identity, s1);
            let m2 = mat4.TRS(t2, quat.Identity, s2);
            let m3 = m2.mul(m1);
            let trd = mat4.Decompose(m3);

            let t3 = t2.addToRef(s2.mulToRef(t1));
            let t4 = trd[0];
            expectVec3(t3, t4);

            let s3 = s1.mulToRef(s2);
            let s4 = trd[2];
            expectVec3(vec3.Abs(s3), vec3.Abs(s4));
        }
        //translate rota
        {
            let m1 = mat4.TRS(t1, r1, vec3.one);
            let m2 = mat4.TRS(t2, r2, vec3.one);
            let m3 = m2.mul(m1);
            let trd = mat4.Decompose(m3);

            let t3 = t2.addToRef(r2.rota(t1));
            let t4 = trd[0];
            expectVec3(t3, t4);

            let r3 = r2.mul(r1);
            let r4 = trd[1];
            expect(r3.equals(r4)).to.equal(true);
        }
    })

    it("decompose-affine",()=>{
        //Decompose TRS with positive scale
        for(let i=0;i<20;i++){
            let t0 = vec3.Random();
            let q0 = quat.Random();
            let s0 = vec3.Random(true);
            let m = mat4.TRS(t0,q0,s0);
            let t1 = vec3.zero;
            let qmat = mat3.Identity;
            let s1 = vec3.one;
            let sk = vec3.zero;
            mat4.DecomposeAffine(m,t1,qmat,s1,sk);
            expectVec3(t0,t1);
            let q1 = quat.MtxToQuat(qmat);
            expectQuat(q0,q1);
            expectVec3(s0,s1);
            expectVec3(sk,new vec3([0,0,0]));
            let m2 = mat4.Translate(t1).mul(mat3.Rotation(q1).mul(mat3.ScaleShear(s1,sk)).toMat4());
            expectPair(m2.raw,m.raw);
        }

        for(let i=0;i<20;i++){
            let m = mat4.RandomTRS();
            let t1 = vec3.zero;
            let qmat = mat3.Identity;
            let s1 = vec3.one;
            let k = vec3.zero;
            mat4.DecomposeAffine(m,t1,qmat,s1,k);
            let q1 = quat.MtxToQuat(qmat);
            let m1 = mat4.TRS(t1,q1,s1);
            expectPair(m1.raw,m.raw);
        }
    });

    it("decompose-affine-2",()=>{
        let m1 = mat4.RandomTRS();
        let m2 = mat4.RandomTRS();

        let m3 = m2.mul(m1);
        
        let t = vec3.zero;
        let qmat=  mat3.Identity;
        let s = vec3.zero;
        let sk = vec3.zero;

        mat4.DecomposeAffine(m3,t,qmat,s,sk);

        let q = quat.MtxToQuat(qmat);
        expect(q.magnitude()).closeTo(1.0,0.0001);

        let m5 = mat4.TRS(t,q,s);

        let p = glmath.vec4(30,10,-10,0);

        let p1 = m3.mulvec(p);
        let p2 = m5.mulvec(p);

    })


    it("rotated-scaling", () => {
        let s = vec3.Random();
        let s1 = vec3.Random();

        let q = quat.Random();
        let s2 = mat4.Decompose(mat4.TRS(vec3.zero, q, s1).mul(mat4.Scale(s)))[2];

        let s3 = s.mul(s1);
        expect(Math.abs(s3.x)).closeTo(Math.abs(s2.x), 0.001);
        expect(Math.abs(s3.y)).closeTo(Math.abs(s2.y), 0.001);
        expect(Math.abs(s3.z)).closeTo(Math.abs(s2.z), 0.001);
    });

    it("Rota-vector", () => {
        let q = quat.Random();
        let v = vec3.Random();
        let v1 = q.rota(v);
        let v2 = mat4.Rotation(q).mulvec(v.vec4(0)).vec3();
        expectVec3(v1, v2);
    })

    it("Rota-point", () => {
        let q = quat.Random();
        let p = vec3.Random();
        let p1 = q.rota(p).vec4(1);
        let p2 = mat4.Rotation(q).mulvec(p.vec4(1));
        expectVec4(p1, p2);
    })

    it("coord", () => {
        let p = glmath.vec4(1, 2, 3, 1);
        let cp = glmath.vec3(-5, 0, 0);
        let dist = glmath.vec3(6, 2, 3).length;
        for (let i = 0; i < 10; i++) {
            let forward = vec3.Random();
            let random = vec3.Random();
            let up = vec3.Cross(random, forward);
            let mat = mat4.coord(cp, forward, up);
            let p1 = mat.mulvec(p);
            expect(p1.vec3().length).closeTo(dist, 0.00001);
        }
    })

    it("coord-test", () => {
        //rhs coordinate
        let f = glmath.vec3(0, 0, -1);
        let u = glmath.vec3(0, 1, 0);

        let m1 = mat4.coord(vec3.zero, f, u);
        let m2 = mat4.coord(vec3.zero, f.mulToRef(-1.0), u);

        let m3 = mat4.coordCvt(vec3.zero, f, u);

        let p = glmath.vec4(1, 1, -1, 1);

        let p1 = m1.mulvec(p);
        let p2 = m2.mulvec(p);
        let p3 = m3.mulvec(p);

        expectVec4(p3, glmath.vec4(1, 1, 1, 1));
        expectVec4(p2, glmath.vec4(1, 1, -1, 1));
        expectVec4(p1, glmath.vec4(-1, 1, 1, 1));

    })

    it("coord-LH-RH", () => {
        //PR(1,1,1,1)
        let pr = glmath.vec4(1, 1, 1, 1);
        let mtxLH = mat4.coordCvt(vec3.zero, glmath.vec3(0, 0, -1), glmath.vec3(0, 1, 0));
        let mtxRH = mat4.coord(vec3.zero, glmath.vec3(0, 0, -1), glmath.vec3(0, 1, 0));
        expectVec4(mtxLH.mulvec(pr), glmath.vec4(1, 1, -1, 1), 0.0001);
        expectVec4(mtxRH.mulvec(pr), glmath.vec4(-1, 1, -1, 1), 0.0001);

        //PL (1,1,1,1)
        let pl = glmath.vec4(1, 1, 1, 1);
        mtxLH = mat4.coord(vec3.zero, glmath.vec3(0, 0, -1), glmath.vec3(0, 1, 0));
        mtxRH = mat4.coordCvt(vec3.zero, glmath.vec3(0, 0, -1), glmath.vec3(0, 1, 0));
        expectVec4(mtxLH.mulvec(pl), glmath.vec4(-1, 1, -1, 1), 0.0001);
        expectVec4(mtxRH.mulvec(pl), glmath.vec4(1, 1, -1, 1), 0.0001);
    })

    it("orthographic", () => {
        let f = 100.0;
        let n = 0.01;
        let mtx = mat4.orthographic(1, 1, n, f);
        let p0 = glmath.vec4(-0.5, -0.5, n, 1);
        let p1 = glmath.vec4(0.5, 0.5, f, 1);
        expectVec4(mtx.mulvec(p0), new vec4([-1, -1, -1, 1]), 0.0001);
        expectVec4(mtx.mulvec(p1), new vec4([1, 1, 1, 1]), 0.0001);
    })

    it("mat3Determiant", () => {
        let m = mat4.RandomTRS();
        expect(m.mat3Determinant()).closeTo(m.toMat3().determinant(), 0.00001);
    })

})