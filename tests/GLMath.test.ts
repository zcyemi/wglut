import * as chai from 'chai';
import { pairwise, expectPair, expectVec3, expectVec4} from './GLTestHelper';
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

describe('mat4',()=>{
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
    });

    it("Translate",()=>{
        let v = vec3.Random();
        let v1 = vec3.Random();
        let mtx = mat4.Translate(v1);
        let v2 = v.addToRef(v1);
        let v3 = mtx.mulvec(v.vec4(1)).vec3();
        expectVec3(v2,v3);
    })

    it("Scale",()=>{
       let v = vec3.Random();
       let s =vec3.Random();
       let mtx = mat4.Scale(s);
       let v1 = v.mulToRef(s).vec4();
       let v2 = mtx.mulvec(v.vec4());
       expectVec4(v1,v2);
    })

    it("TS",()=>{
        let t = vec3.Random();
        let s = vec3.Random();
        let v=  vec3.Random();
        let mtxt = mat4.Translate(t);
        let mtxs = mat4.Scale(s);

        let mtxts = mtxt.mul(mtxs);
        let v1 = v.mulToRef(s).add(t);
        let v2 = mtxts.mulvec(v.vec4(1)).vec3();

        expectVec3(v1,v2);
    })

    it("RS",()=>{
        let r = quat.Random();
        let s = glmath.vec3(1,2,-1);
        let v = vec3.Random();
        let v1 = r.rota(v.mulToRef(s)).vec4(1);

        let mtxs = mat4.Scale(s);
        let mtxr = mat4.Rotation(r);

        let v2 = mtxs.mulvec(v.vec4(1));
        let v3 = mtxr.mulvec(v2);

        let mtxrs =mtxr.mul(mtxs);
        let v4 = mtxrs.mulvec(v.vec4(1));
        expectVec4(v1,v3);
        expectVec4(v1,v4);
    });


    it("TRS",()=>{
        let t = vec3.Random();
        let s = vec3.Random();
        let r = quat.Random();

        let trs = mat4.TRS(t,r,s);
        let trs1 = mat4.Translate(t).mul(mat4.Rotation(r).mul(mat4.Scale(s)));

        expectPair(trs.raw,trs1.raw);
        
    });

    it("TRS-setTRS",()=>{
        let mtx = mat4.TRS(vec3.zero,quat.Identity,vec3.one);
        let m = mat4.Identity;
        m.setTRS(vec3.zero,quat.Identity,vec3.one);
        expectPair(mtx.raw,m.raw);
    })

    it("Rota-vector",()=>{
        let q = quat.Random();
        let v = vec3.Random();
        let v1 = q.rota(v);
        let v2 = mat4.Rotation(q).mulvec(v.vec4(0)).vec3();
        expectVec3(v1,v2);
    })


    it("Rota-point",()=>{
        let q= quat.Random();
        let p = vec3.Random();
        let p1 = q.rota(p).vec4(1);
        let p2= mat4.Rotation(q).mulvec(p.vec4(1));
        expectVec4(p1,p2);
    })

    it("coord",()=>{
        let p = glmath.vec4(1,2,3,1);
        let cp = glmath.vec3(-5,0,0);

        let dist = glmath.vec3(6,2,3).length;

        for(let i=0;i<10;i++){
            let forward = vec3.Random();
            let random =  vec3.Random();
            let up = vec3.Cross(random,forward);
            let mat = mat4.coord(cp,forward,up);
            let p1 = mat.mulvec(p);

            expect(p1.vec3().length).closeTo(dist,0.00001);
        }

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

    it("mat3-mul-vec",()=>{
        let m = new mat3([5,6,4,8,9,7,-4,-5,-2]);
        let v = m.mulvec(new vec3([2,-3,1]));
        expectPair(v.raw,[-18,-20,-15]);
        
        let m4 = m.toMat4();
        let v4 =m4.mulvec(new vec4([2,-3,1,0]));
        expectPair(v4.raw,[-18,-20,-15,0]);
    })

    it("mat3-rotation",()=>{
        let mtx = mat3.RotationDeg(60.9,-75.2,17.4);
        let q = quat.fromEulerDeg(60.9,-75.2,17.4);
        let v = vec3.Random();
        let v1 = mtx.mulvec(v);
        let v2 = q.rota(v);

        expectPair(v1.raw,v2.raw);
    })

    it("mat3-toMat4",()=>{
        let rota = vec3.Random();
        let v =vec3.Random();
        let rmat3 = mat3.Rotation(rota.x,rota.y,rota.z);
        let rmat4 =rmat3.toMat4();
        let v1 = rmat3.mulvec(v).vec4();
        let v2 = rmat4.mulvec(v.vec4(0));
        expectPair(v1.raw,v2.raw,0.00001);
    
    })
})

describe('quaternion',()=>{
    it('fromEuler-0',()=>{
        let q = quat.fromEulerDeg(10,20,30);
        pairwise(q.raw,(s,t)=>{
            expect(s).closeTo(t,0.001);
        },[0.128,0.145,0.269,0.944]);
    });
    it('fromEuler-1',()=>{
        let q = quat.fromEulerDeg(-125.830, 90.831,-22.499);
        pairwise(q.raw,(s,t)=>{
            expect(s).closeTo(t,0.001);
        },[-0.676,0.196,-0.684,0.190]);
    });
    it('fromEuler-2',()=>{
        let q = quat.fromEulerDeg(-90,0,-180.0);
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
        var qeuler = quat.fromEulerDeg(271,-34,59);
        var qx = quat.axisRotationDeg(vec3.right,271);
        var qy = quat.axisRotationDeg(vec3.up,-34);
        var qz = quat.axisRotationDeg(vec3.forward,59);
        var qm = qx.mul(qy).mul(qz);
        expectPair(qeuler.raw,qm.raw);
    })

    it("quat-2-mtx",()=>{
        var qeuler = quat.fromEulerDeg(51,-20,165);
        var v = new vec3([1,-2,3]).normalize();
        let qmtx = quat.QuatToMtx(qeuler);
        var v1 = qeuler.rota(v);
        var v2 = qmtx.mulvec(v);
        expectPair(v1.raw,v2.raw);
    })

    it("mtx-2-quat-1",()=>{
        var qeuler = quat.fromEulerDeg(51,-20,165);
        let qv4 = quat.MtxToQuat(quat.QuatToMtx(qeuler));
        expect(qeuler.equals(qv4)).that.eq(true);
    })

    it("mtx-2-quat-2",()=>{
        var q = quat.fromEulerDeg(30,-70,90);
        let mtxrota =mat3.RotationDeg(30,-70,90);
        let qm = quat.MtxToQuat(mtxrota);
        expectPair(q.raw,qm.raw);
    });

    it("quat-rota-to",()=>{
        let tar = new vec3([-1.9,13.5,2.7]);
        let length = tar.length;
        let q =quat.RotaTo(tar);
        let v = q.rota(vec3.right.mulToRef(length));
        expectPair(v.raw, tar.raw);
    });

    it("quat-from-to",()=>{

        let from = glmath.vec3(23,-3,5);
        let to = glmath.vec3(-7,11,3);

        let q = quat.FromTo(from,to);
        let v = q.rota(from).normalize().mul(to.length);

        expectPair(v.raw,to.raw);
    });

    it("quat-div-1",()=>{
        let q1 = quat.fromEuler(Math.random(),Math.random(),Math.random());
        let q2 = quat.fromEuler(Math.random(),Math.random(),Math.random());
        let q = q1.mul(q2);
        let qdiv = quat.Div(q,q2);
        expectPair(qdiv.raw,q1.raw);
    })

    it("quat-div-2",()=>{
        let q1 = quat.Random();
        let q2 = quat.Random();

        let qdiv = quat.Div(q2,q1);

        let q = qdiv.mul(q1);

        expectPair(q.raw, q2.raw);
    })
})