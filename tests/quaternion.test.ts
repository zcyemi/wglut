import * as chai from 'chai';
import { pairwise, expectPair, expectVec3, expectVec4, expectQuat, expectMat3 } from './helper/GLTestHelper';
import { glmath, vec3, vec4, mat3, mat4, quat } from '../src/wglut';

const expect = chai.expect;

describe('quaternion',()=>{
    it("rota", () => {
        let v = vec3.Random();
        let q = quat.fromEuler(v.x, v.y, v.z);
        let v1 = q.toEuler();
        expectVec3(v, v1);
    })

    it("fromEuler", () => {
        let q = quat.fromEulerDeg(10, 54, -78);
        let q1 = glmath.quat(-0.224268, 0.400345, -0.5893449, 0.6649063);
        expectQuat(q1, q);

        let v = q.toEulerDeg();
        expectVec3(glmath.vec3(10, 54, -78), v, 0.001);
    })

    it("mul-verify-1", () => {
        let q1 = quat.Random();
        let q2 = quat.Random();
        let q3 = quat.Random();
        let qa = q1.mul(q2).mul(q3);
        let qb = q1.mul(q2.mul(q3));

        expectQuat(qa, qb);
    })

    it("mul-verify-2", () => {
        let qt = quat.Random();
        let pt = quat.Random();

        let q0 = qt.w;
        let p0 = pt.w;

        let q = glmath.vec3(qt.x, qt.y, qt.z);
        let p = glmath.vec3(pt.x, pt.y, pt.z);

        let mul = qt.mul(pt);

        let t0 = p0 * q0 - p.dot(q);
        let t = p.mulNumToRef(q0).add(q.mulNumToRef(p0)).add(q.cross(p));
        let tt = new quat([t.x, t.y, t.z, t0]);

        expectQuat(mul, tt);
    })


    it("conjugate-verify", () => {
        let q = quat.Random();
        let qc = q.conjugate();

        expectQuat(q.mul(qc), qc.mul(q));
        expectQuat(q.mul(qc), quat.Identity);

        let q1 = quat.Random();
        let q2 = quat.Random();

        let qc1 = q1.conjugate().mul(q2.conjugate());
        let qc2 = q2.mul(q1).conjugate();
        expectQuat(qc1, qc2);
    })

    it('quat-multiple', () => {
        var p = quat.axisRotation(glmath.vec3(2, 3, 5), 1.0);
        var q = quat.axisRotation(glmath.vec3(-1, 2, 0.7), -5.0);
        var f = p.mul(q);
        //verify
        var p0 = p.w;
        var q0 = q.w;
        var pv = glmath.vec3(p.x, p.y, p.z);
        var qv = glmath.vec3(q.x, q.y, q.z);
        var cross = vec3.Cross(pv, qv);
        var dot = vec3.Dot(pv, qv);
        var s = cross.add(pv.mul(q0)).add(qv.mul(p0));
        let sv = new vec4([s.x, s.y, s.z, q0 * p0 - dot]);
        expectQuat(f,new quat(sv.raw));
    });

    it('quat_vec', () => {
        var q = quat.axisRotation(glmath.vec3(2, 3, 5), 1.0);
        var v = glmath.vec3(20, -11, 4);
        var vr = q.rota(v);
        expectPair(vr.raw, [20.605, 7.595, -7.399]);
    });

    it('quat_euler_cross_verify', () => {
        var qeuler = quat.fromEulerDeg(271, -34, 59);
        var qx = quat.axisRotationDeg(vec3.right, 271);
        var qy = quat.axisRotationDeg(vec3.up, -34);
        var qz = quat.axisRotationDeg(vec3.forward, 59);
        var qm = qy.mul(qx.mul(qz));
        expectQuat(qeuler,qm);
    })

    it("quat-2-mtx", () => {
        var qeuler = quat.fromEulerDeg(51, -20, 165);
        var v = new vec3([1, -2, 3]).normalize;
        let qmtx = quat.QuatToMtx(qeuler);
        var v1 = qeuler.rota(v);
        var v2 = qmtx.mulvec(v);
        expectPair(v1.raw, v2.raw);
    })

    it("mtx-2-quat-1", () => {
        var qeuler = quat.fromEulerDeg(51, -20, 165);
        let qv4 = quat.MtxToQuat(quat.QuatToMtx(qeuler));
        expect(qeuler.equals(qv4)).that.eq(true);
    })

    it("mtx-2-quat-2", () => {
        let mtx = mat3.Identity;
        let q = quat.MtxToQuat(mtx);
        expectQuat(q, quat.Identity);
    })

    it("mtx-2-quat-3", () => {
        let f = (q: quat) => {
            let mtx = mat4.Rotation(q).toMat3();
            let q1 = quat.MtxToQuat(mtx);
            let eq = q1.equals(q);
            expect(eq).eqls(true, `${q.raw} - ${q1.raw}`);
        }

        f(glmath.quat(1, 0, 0, 0));
        f(glmath.quat(0, 1, 0, 0));
        f(glmath.quat(0, 0, 1, 0));
        f(glmath.quat(0, 0, 0, 1));
        f(quat.axisRotationDeg(vec3.up, Math.random()));
        f(quat.axisRotationDeg(vec3.down, Math.random()));
        f(quat.axisRotationDeg(vec3.left, Math.random()));
        f(quat.axisRotationDeg(vec3.right, Math.random()));
        f(quat.axisRotationDeg(vec3.forward, Math.random()));
        f(quat.axisRotationDeg(vec3.back, Math.random()));
        f(quat.axisRotation(glmath.vec3(1, 1, 0), Math.random()));
        f(quat.axisRotation(glmath.vec3(-1, 1, 0), Math.random()));
        f(quat.axisRotation(glmath.vec3(0, 1, 1), Math.random()));
        f(quat.axisRotation(glmath.vec3(0, 1, -1), Math.random()));
        f(quat.axisRotation(glmath.vec3(1, 0, 1), Math.random()));
        f(quat.axisRotation(glmath.vec3(1, 0, -1), Math.random()));
    })

    it("quat-from-to", () => {
        //LH space
        let vf = vec3.forward;
        let vr = vec3.right;
        let vu = vec3.up;
        let vd = vec3.down;

        let qfr = quat.FromToNormal(vf, vr, vu);
        let qrf = quat.FromToNormal(vr, vf, vu);

        expectVec3(qfr.rota(vf), vr);
        expectVec3(qrf.rota(vr), vf);

        expectVec3(qfr.rota(vu), vu);
        expectVec3(qrf.rota(vu), vu);

        let qfrd = quat.FromToNormal(vf, vr, vd);
        let qrfd = quat.FromToNormal(vr, vf, vd);

        expectVec3(qfrd.rota(vf), vr);
        expectVec3(qrfd.rota(vr), vf);
        expectVec3(qfrd.rota(vd), vd);
        expectVec3(qrfd.rota(vd), vd);
    })

    it("quat-from-to-normalized", () => {
        let v1 = vec3.Random();
        let v2 = vec3.Random();

        let q = quat.FromToNormal(v1, v2, vec3.Random());
        expectVec3(q.rota(v1).normalize, v2.normalize);
    })

    it("quat-from-to-parall", () => {
        let v1 = vec3.Random();
        let v2 = vec3.Random();

        let v3 = v1.cross(v2);
        let up = v3.cross(v1);
        let q = quat.FromToNormal(v1, v2, up);
        expectVec3(q.rota(v1).normalize, v2.normalize);
    })

    it("quat-from-to-normal", () => {
        let q0 = quat.Random();
        let v1 = vec3.Random();
        let v2 = vec3.Random();

        let cross = v1.cross(v2);

        let qu = quat.FromToNormal(v1, v2, cross);
        let qd = quat.FromToNormal(v1, v2, cross.mulToRef(-1));
        let q1 = qu.mul(q0);
        let q2 = qd.mul(q0);

        expectQuat(q1,q2);

        for (var i = 0; i < 10; i++) {
            let up = vec3.Random();
            let q = quat.FromToNormal(v1, v2, up);
            expectQuat(q, (up.dot(cross) >= 0 ? qu : qd));
        }
    })

    it("quat-euler-rotamtx", () => {
    })

    it("quat-from-to-coord", () => {
        let coordverify = (f: vec3, u: vec3) => {
            let rn = u.cross(f).normalize;
            let fn = f.normalized();
            let un = u.normalized();
            let q = quat.Coordinate(fn, un);
            expectVec3(fn, q.rota(vec3.forward));
            expectVec3(un, q.rota(vec3.up));
            expectVec3(rn, q.rota(vec3.right));
        }

        for (let i = 0; i < 10; i++) {
            let vf = vec3.Random().normalize;
            let vu = vec3.Random();
            let vr = vec3.Cross(vu, vf).normalize;
            vu = vec3.Cross(vf, vr).normalize;
            coordverify(vf, vu);
        }

        coordverify(vec3.up, vec3.right);
        coordverify(vec3.down, vec3.right);
        coordverify(vec3.up, vec3.left);
        coordverify(vec3.down, vec3.left);

    })


    it("quat-div-1", () => {
        let q1 = quat.fromEuler(Math.random(), Math.random(), Math.random());
        let q2 = quat.fromEuler(Math.random(), Math.random(), Math.random());
        let q = q1.mul(q2);
        let qdiv = quat.Div(q, q2, true);
        expectQuat(qdiv, q1);
    })

    it("quat-div-2", () => {
        let q1 = quat.Random();
        let q2 = quat.Random();
        let qdiv = quat.Div(q2, q1);
        let q = q1.mul(qdiv);
        expectQuat(q,q2);
    })

    it("quat-clone", () => {
        let q = quat.Random();
        let q1 = q.clone();
        expectPair(q1.raw, q.raw);
        expect(q.raw).not.eq(q1.raw);
    })

    it("quat-set", () => {
        let q = quat.Random();
        let qc = q.clone();
        let q1 = quat.Random();
        q1.set(q);

        expectPair(q.raw, qc.raw, 0.001);
        expectPair(q1.raw, q.raw);
        expect(q1.raw).not.eq(q.raw);
    })

})