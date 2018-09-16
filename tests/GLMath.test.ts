import * as chai from 'chai';
import { pairwise, expectPair} from './GLTestHelper';
import { glmath,vec3,vec4,mat3,mat4,quat} from '../src/wglut';

const expect = chai.expect;

describe('vec3',()=>{
    it('ctor',()=>{
        let v = glmath.vec3(1,2,3);
        expect(v.raw).that.deep.eq([1,2,3]);
    });
    it('clone',()=>{
        let v = glmath.vec3(1,2,3);
        let v1 = v.clone();
        v.x = 2;
        expect(v1.raw).that.deep.eq([1,2,3]);
        expect(v.x).that.eq(2);
    })

    it('ctor null',()=>{
        let v3 = new vec3();
        expect(v3.raw).to.be.an('array').that.deep.eq([0,0,0]);
    });
    it('toVec4',()=>{
        let v3 = glmath.vec3(1,2,3);
        let v4 = v3.vec4(5); 
        expect(v4.w).to.equal(5);
    });
})

describe('matrix4',()=>{
    it('mat4 inverse',()=>{
        let m = new mat4([
            2,4,0,0,
            1,7,6,0,
            0,5,8,0,
            20,-30,4,1
        ]);

        let inv = m.inverse();
        pairwise(inv.raw,(s,t)=>{
            expect(s).to.closeTo(t,0.0001);
        },[
            1.3,-1.6,1.2,0,
            -0.4,0.8,-0.6,0,
            0.25,-0.5,0.5,0,
            -39,58,-44,1
        ])
    })
})

describe("mat3",()=>{
    it("mat3-transpose",()=>{
        let mtx = new mat3([
            3,5,-1,
            4,-7,0,
            2,6,3
        ]);
        let mtxtt = mtx.transpose().transpose();
        expectPair(mtx.raw,mtxtt.raw);
    })

    it("mat3-cross-lhs",()=>{
        let v1 = new vec3([1,4,6]);
        let v2 = new vec3([-6,-7,2]);
        let c1 = vec3.Cross(v1,v2);
        let mtxclhs = mat3.Cross(v1);
        let c2 = mtxclhs.mulvec(v2);
        expectPair(c1.raw,c2.raw);
    })

    it("mat3-cross-rhs",()=>{
        let v1 = new vec3([1,4,6]);
        let v2 = new vec3([-6,-7,2]);
        let c1 = v1.cross(v2);
        let mtxclhs = mat3.CrossRHS(v2);
        let c2 = mtxclhs.mulvec(v1);
        expectPair(c1.raw,c2.raw);
    })

    it("mat3-rotation",()=>{
        let mtx = mat3.RotationDeg(60.9,-75.2,17.4);
        let q = quat.fromEuler(60.9,-75.2,17.4);
        let v = glmath.vec3(1,-2,3);

        let v1 = mtx.mulvec(v);
        let v2 = q.rota(v);

        expectPair(v1.raw,v2.raw);
    })
})

describe('quaternion',()=>{
    it('fromEuler-0',()=>{
        let q = quat.fromEuler(10,20,30);
        pairwise(q.raw,(s,t)=>{
            expect(s).closeTo(t,0.001);
        },[0.128,0.145,0.269,0.944]);
    });
    it('fromEuler-1',()=>{
        let q = quat.fromEuler(-125.830, 90.831,-22.499);
        pairwise(q.raw,(s,t)=>{
            expect(s).closeTo(t,0.001);
        },[-0.676,0.196,-0.684,0.190]);
    });
    it('fromEuler-2',()=>{
        let q = quat.fromEuler(-90,0,-180.0);
        pairwise(q.raw,(s,t)=>{
            expect(s).closeTo(t,0.001);
        },[0.0,-0.707,-0.707,0.0]);
    });

    it('quat-multiple',()=>{
        var p = quat.axisRotation(glmath.vec3(2,3,5),1.0);
        var q = quat.axisRotation(glmath.vec3(-1,2,0.7),-5.0);

        var f = p.mul(q);
        //verify
        var p0 = p.w;
        var q0  =q.w;
        var pv = glmath.vec3(p.x,p.y,p.z);
        var qv = glmath.vec3(q.x,q.y,q.z);

        var cross = vec3.Cross(pv,qv);
        var dot = vec3.Dot(pv,qv);
``
        var s = cross.add(pv.mul(q0)).add(qv.mul(p0));
        let sv = new vec4([s.x,s.y,s.z, q0 * p0 - dot]);

        expectPair(f.raw,sv.raw);
    });

    it('quat_vec',()=>{
        var q = quat.axisRotation(glmath.vec3(2,3,5),1.0);
        var v = glmath.vec3(20,-11,4);
        var vr = q.rota(v);
        expectPair(vr.raw,[20.605,7.595,-7.399]);
    });

    it('quat_euler_cross_verify',()=>{
        var qeuler = quat.fromEuler(271,-34,59);
        var qx = quat.axisRotationDeg(vec3.right,271);
        var qy = quat.axisRotationDeg(vec3.up,-34);
        var qz = quat.axisRotationDeg(vec3.forward,59);
        var qm = qx.mul(qy).mul(qz);
        expectPair(qeuler.raw,qm.raw);
    })

    it("quat-2-mtx",()=>{
        var qeuler = quat.fromEuler(51,-20,165);

        var v = new vec3([1,-2,3]).normalize();
        let qmtx = quat.QuatToMtx(qeuler);

        var v1 = qeuler.rota(v);
        var v2 = qmtx.mulvec(v);

        expectPair(v1.raw,v2.raw);
    })

    it("mtx-2-quat-1",()=>{
        var qeuler = quat.fromEuler(51,-20,165);
        let qv4 = quat.MtxToQuat(quat.QuatToMtx(qeuler));
        expect(qeuler.equals(qv4)).that.eq(true);
    })

    it("mtx-2-quat-2",()=>{
        var q = quat.fromEuler(30,-70,90);

        let mtxrota =mat3.RotationDeg(30,-70,90);
        let qm = quat.MtxToQuat(mtxrota);

        expectPair(q.raw,qm.raw);

    });
})