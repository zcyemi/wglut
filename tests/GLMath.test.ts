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

describe('matrix',()=>{
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

        var s = cross.add(pv.mul(q0)).add(qv.mul(p0));
        let sv = new vec4([s.x,s.y,s.z, q0 * p0 - dot]);

        expectPair(f.raw,sv.raw);
    })
})