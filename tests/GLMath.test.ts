import * as chai from 'chai';
import { pairwise, expectPair, expectVec3, expectVec4, expectQuat} from './GLTestHelper';
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
    it('cross-crossverify',()=>{
        let v1 = vec3.Random().normalize;
        let v2 = vec3.Random().normalize;

        let cross = vec3.Cross(v1,v2);
        let dot = v1.dot(v2);
        expect(cross.length2 + dot * dot).to.closeTo(1.0,0.00001);
    })
    it('cross',()=>{
        let c = vec3.up.cross(vec3.down).normalize;
        let cs = vec3.SafeCross(vec3.up,vec3.down).normalize;

        expect(cs.x).not.eq(NaN);
        expect(cs.y).not.eq(NaN);
        expect(cs.z).not.eq(NaN);
    })
    it('normalize',()=>{
        let v =vec3.Random();
        let vn1 = v.normalized();
        expect(vn1.raw).not.eq(v.raw);
        let vn = v.normalize;
        expect(vn).eq(v);
        expectVec3(vn1,v);
    })
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

    it("Decompose TRS - 1",()=>{
        let s = glmath.vec3(Math.random(),Math.random(),Math.random());
        let r = quat.Random();
        let t = vec3.Random();

        let mtx = mat4.TRS(t,r,s);

        let [tx,rx,sx] = mat4.Decompose(mtx);

        expectVec3(t,tx);
        expectVec3(s,sx);
        expectQuat(r,rx);
    })

    it("Decompose TRS - 2",()=>{
        for(let i=0;i<20;i++){
            let s = vec3.Random();
            let r = quat.Random();
            let t = vec3.Random();
            let mtx = mat4.TRS(t,r,s);
            let [tx,rx,sx] = mat4.Decompose(mtx);
            expect(rx.magnitude2()).closeTo(1.0,0.0001);
        }
    })

    it("rotated-scaling",()=>{
        let s = vec3.Random();
        let s1 = vec3.Random();

        let q = quat.Random();
        let s2 = mat4.Decompose(mat4.TRS(vec3.zero,q,s1).mul(mat4.Scale(s)))[2];
        
        let s3 = s.mul(s1);
        expect(Math.abs(s3.x)).closeTo(Math.abs(s2.x),0.001);
        expect(Math.abs(s3.y)).closeTo(Math.abs(s2.y),0.001);
        expect(Math.abs(s3.z)).closeTo(Math.abs(s2.z),0.001);
    });

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

    it("coord-test",()=>{
        //rhs coordinate
        let f = glmath.vec3(0,0,-1);
        let u = glmath.vec3(0,1,0);

        let m1 = mat4.coord(vec3.zero,f,u);
        let m2 = mat4.coord(vec3.zero,f.mulToRef(-1.0),u);

        let m3 = mat4.coordCvt(vec3.zero,f,u);

        let p = glmath.vec4(1,1,-1,1);

        let p1 = m1.mulvec(p);
        let p2 = m2.mulvec(p);
        let p3 = m3.mulvec(p);
        
        expectVec4(p3,glmath.vec4(1,1,1,1));
        expectVec4(p2,glmath.vec4(1,1,-1,1));
        expectVec4(p1,glmath.vec4(-1,1,1,1));

    })

    it("coord-LH-RH",()=>{
        //PR(1,1,1,1)
        let pr = glmath.vec4(1,1,1,1);
        let mtxLH = mat4.coordCvt(vec3.zero,glmath.vec3(0,0,-1),glmath.vec3(0,1,0));
        let mtxRH = mat4.coord(vec3.zero,glmath.vec3(0,0,-1),glmath.vec3(0,1,0));
        expectVec4(mtxLH.mulvec(pr),glmath.vec4(1,1,-1,1),0.0001);
        expectVec4(mtxRH.mulvec(pr),glmath.vec4(-1,1,-1,1),0.0001);

        //PL (1,1,1,1)
        let pl = glmath.vec4(1,1,1,1);
        mtxLH = mat4.coord(vec3.zero,glmath.vec3(0,0,-1),glmath.vec3(0,1,0));
        mtxRH = mat4.coordCvt(vec3.zero,glmath.vec3(0,0,-1),glmath.vec3(0,1,0));
        expectVec4(mtxLH.mulvec(pl),glmath.vec4(-1,1,-1,1),0.0001);
        expectVec4(mtxRH.mulvec(pl),glmath.vec4(1,1,-1,1),0.0001);
    })

    it("orthographic",()=>{
        let f = 100.0;
        let n = 0.01;
        let mtx = mat4.orthographic(1,1,n,f);
        let p0 = glmath.vec4(-0.5,-0.5,n,1);
        let p1 = glmath.vec4(0.5,0.5,f,1);
        expectVec4(mtx.mulvec(p0),new vec4([-1,-1,-1,1]),0.0001);
        expectVec4(mtx.mulvec(p1),new vec4([1,1,1,1]),0.0001);
    })

    it("mat3Determiant",()=>{
        let m = mat4.RandomTRS();
        expect(m.mat3Determinant()).closeTo(m.toMat3().determinant(),0.00001);
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
        let mtx = mat3.Rotation(quat.fromEulerDeg(60.9,-75.2,17.4));
        let q = quat.fromEulerDeg(60.9,-75.2,17.4);
        let v = vec3.Random();
        let v1 = mtx.mulvec(v);
        let v2 = q.rota(v);

        expectPair(v1.raw,v2.raw);
    })

    it("mat3-toMat4",()=>{
        let rota = quat.Random();
        let v =vec3.Random();
        let rmat3 = mat3.Rotation(rota);
        let rmat4 =rmat3.toMat4();
        let v1 = rmat3.mulvec(v).vec4();
        let v2 = rmat4.mulvec(v.vec4(0));
        expectPair(v1.raw,v2.raw,0.00001);
    })

    it("mat3-clone",()=>{
        let mtx = mat4.TRS(vec3.Random(),quat.Random(),vec3.Random());

        let mtxc = mtx.clone();
        mtx.raw[4] = 123;
        expect(mtxc.raw[4]).to.that.not.eq(mtx.raw[4]);
    })

    it("mat3-decompose",()=>{

        let s = glmath.vec3(1,2,3);
        let q = quat.fromEulerDeg(30,20,70);

        let mtx = mat3.fromRS(q,s);

        let [qt,st] = mat3.Decompose(mtx);

        expectVec3(s,st);
        expectQuat(q,qt);
    })

    it("mat3-determination",()=>{
        for(let i=0;i<20;i++){
            let s = vec3.Random();
            let m = mat3.fromRS(quat.Random(),s);
            expect(m.determinant()).closeTo(s.x * s.y * s.z,0.0001);
        }
    })
})

describe('quaternion',()=>{
    it("rota",()=>{
        let v = vec3.Random();
        let q = quat.fromEuler(v.x,v.y,v.z);
        let v1 = q.toEuler();
        expectVec3(v,v1);
    })

    it("fromEuler",()=>{
        let q = quat.fromEulerDeg(10,54,-78);
        let q1 = glmath.quat(-0.224268,0.400345,-0.5893449,0.6649063);
        expectQuat(q1,q);

        let v = q.toEulerDeg();
        expectVec3(glmath.vec3(10,54,-78),v,0.001);
    })

    it("mul-verify-1",()=>{
        let q1 = quat.Random();
        let q2 = quat.Random();
        let q3 = quat.Random();
        let qa = q1.mul(q2).mul(q3);
        let qb = q1.mul(q2.mul(q3));

        expectQuat(qa,qb);
    })

    it("mul-verify-2",()=>{
        let qt = quat.Random();
        let pt = quat.Random();

        let q0 = qt.w;
        let p0 = pt.w;

        let q = glmath.vec3(qt.x,qt.y,qt.z);
        let p = glmath.vec3(pt.x,pt.y,pt.z);

        let mul = qt.mul(pt);

        let t0 = p0 * q0 - p.dot(q);
        let t = p.mulNumToRef(q0).add(q.mulNumToRef(p0)).add(q.cross(p));
        let tt = new quat([t.x,t.y,t.z,t0]);

        expectQuat(mul,tt);
    })


    it("conjugate-verify",()=>{
        let q = quat.Random();
        let qc = q.conjugate();

        expectQuat(q.mul(qc),qc.mul(q));
        expectQuat(q.mul(qc),quat.Identity);

        let q1 = quat.Random();
        let q2 = quat.Random();

        let qc1 = q1.conjugate().mul(q2.conjugate());
        let qc2 = q2.mul(q1).conjugate();
        expectQuat(qc1,qc2);
    })

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
        var qm = qy.mul(qx.mul(qz));
        expectPair(qeuler.raw,qm.raw);
    })

    it("quat-2-mtx",()=>{
        var qeuler = quat.fromEulerDeg(51,-20,165);
        var v = new vec3([1,-2,3]).normalize;
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

    it("quat-from-to",()=>{
        //LH space
        let vf = vec3.forward;
        let vr = vec3.right;
        let vu = vec3.up;
        let vd = vec3.down;

        let qfr = quat.FromToNormal(vf,vr,vu);
        let qrf = quat.FromToNormal(vr,vf,vu);

        expectVec3(qfr.rota(vf),vr);
        expectVec3(qrf.rota(vr),vf);

        expectVec3(qfr.rota(vu),vu);
        expectVec3(qrf.rota(vu),vu);

        let qfrd = quat.FromToNormal(vf,vr,vd);
        let qrfd = quat.FromToNormal(vr,vf,vd);

        expectVec3(qfrd.rota(vf),vr);
        expectVec3(qrfd.rota(vr),vf);
        expectVec3(qfrd.rota(vd),vd);
        expectVec3(qrfd.rota(vd),vd);
    })

    it("quat-from-to-normalized",()=>{
        let v1 = vec3.Random();
        let v2 = vec3.Random();

        let q = quat.FromToNormal(v1,v2,vec3.Random());
        expectVec3(q.rota(v1).normalize,v2.normalize);
    })

    it("quat-from-to-parall",()=>{
        let v1 = vec3.Random();
        let v2 = vec3.Random();

        let v3 = v1.cross(v2);
        let up = v3.cross(v1);
        let q = quat.FromToNormal(v1,v2,up);
        expectVec3(q.rota(v1).normalize,v2.normalize);
    })

    it("quat-from-to-normal",()=>{
        let q0 = quat.Random();
        let v1 = vec3.Random();
        let v2 = vec3.Random();

        let cross = v1.cross(v2);

        let qu = quat.FromToNormal(v1,v2,cross);
        let qd = quat.FromToNormal(v1,v2,cross.mulToRef(-1));
        let q1 = qu.mul(q0);
        let q2 = qd.mul(q0);

        for(let i=0;i<4;i++){
            expect(q1.raw[i] + q2.raw[i]).to.eq(0);
        }

        for(var i=0;i<10;i++){
            let up = vec3.Random();
            let q = quat.FromToNormal(v1,v2,up);
            expectQuat(q,(up.dot(cross) >=0? qu:qd));
        }
    })

    it("quat-euler-rotamtx",()=>{
    })

    it("quat-from-to-coord",()=>{
        let coordverify = (f:vec3,u:vec3)=>{
            let rn = u.cross(f).normalize;
            let fn = f.normalized();
            let un = u.normalized();
            let q = quat.Coordinate(fn,un);
            expectVec3(fn,q.rota(vec3.forward));
            expectVec3(un,q.rota(vec3.up));
            expectVec3(rn,q.rota(vec3.right));
        }

        for(let i=0;i<10;i++){
            let vf = vec3.Random().normalize;
            let vu = vec3.Random();
            let vr = vec3.Cross(vu,vf).normalize;
            vu = vec3.Cross(vf,vr).normalize;
            coordverify(vf,vu);
        }

        coordverify(vec3.up,vec3.right);
        coordverify(vec3.down,vec3.right);
        coordverify(vec3.up,vec3.left);
        coordverify(vec3.down,vec3.left);

    })


    it("quat-div-1",()=>{
        let q1 = quat.fromEuler(Math.random(),Math.random(),Math.random());
        let q2 = quat.fromEuler(Math.random(),Math.random(),Math.random());
        let q = q1.mul(q2);
        let qdiv = quat.Div(q,q2,true);
        expectPair(qdiv.raw,q1.raw);
    })

    it("quat-div-2",()=>{
        let q1 = quat.Random();
        let q2 = quat.Random();
        let qdiv = quat.Div(q2,q1);
        let q = q1.mul(qdiv);
        expectPair(q.raw, q2.raw);
    })

    it("quat-clone",()=>{
        let q = quat.Random();
        let q1 = q.clone();
        expectPair(q1.raw,q.raw);
        expect(q.raw).not.eq(q1.raw);
    })

    it("quat-set",()=>{
        let q = quat.Random();
        let qc = q.clone();
        let q1 = quat.Random();
        q1.set(q);

        expectPair(q.raw,qc.raw,0.001);
        expectPair(q1.raw,q.raw);
        expect(q1.raw).not.eq(q.raw);
    })
})

describe("clone",()=>{
    it("mat3",()=>{
        let mtx= mat3.fromRS(quat.Random(),vec3.Random());
        let raw = mtx.raw.slice(0);
        let mtxc = mtx.clone();
        let rawclone = mtxc.raw;
        expectPair(raw,rawclone);
        expectPair(mtx.raw,rawclone);
        expect(mtx.raw).not.eq(mtxc.raw);
    });
    it("mat4",()=>{
        let mtx= mat4.TRS(vec3.Random(),quat.Random(),vec3.Random());
        let raw = mtx.raw.slice(0);
        let mtxc = mtx.clone();
        let rawclone = mtxc.raw;
        expectPair(raw,rawclone);
        expectPair(mtx.raw,rawclone);
        expect(mtx.raw).not.eq(mtxc.raw);
    });
    it("vec3",()=>{
        let v = vec3.Random();
        let vc = v.clone();
        expectPair(v.raw,vc.raw);
        expect(v.raw).not.eq(vc.raw);
    });
    it("vec4",()=>{
        let v = vec4.Random();
        let vc = v.clone();
        expectPair(v.raw,vc.raw);
        expect(v.raw).not.eq(vc.raw);
    });
    it("quat",()=>{
        let v = quat.Random();
        let vc = v.clone();
        expectPair(v.raw,vc.raw);
        expect(v.raw).not.eq(vc.raw);
    });
})