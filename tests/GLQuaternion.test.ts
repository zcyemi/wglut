import * as chai from 'chai';


import { glmath,vec3,vec4,mat3,mat4,quat} from '../src/wglut';

const expect = chai.expect;


describe('quaternion',()=>{
    it('fromEuler-0',()=>{
        let q = quat.fromEuler(10,20,30);
        expect(q.x).that.be.closeTo(0.128,0.001);
        expect(q.y).that.be.closeTo(0.145,0.001);
        expect(q.z).that.be.closeTo(0.269,0.001);
        expect(q.w).that.be.closeTo(0.944,0.001);
    });
    it('fromEuler-1',()=>{
        let q = quat.fromEuler(-125.830, 90.831,-22.499);
        expect(q.x).that.be.closeTo(-0.676,0.001);
        expect(q.y).that.be.closeTo(0.196,0.001);
        expect(q.z).that.be.closeTo(-0.684,0.001);
        expect(q.w).that.be.closeTo(0.190,0.001);
    });
    it('fromEuler-2',()=>{
        let q = quat.fromEuler(-90,0,-180.0);
        expect(q.x).that.be.closeTo(0.0,0.001);
        expect(q.y).that.be.closeTo(-0.707,0.001);
        expect(q.z).that.be.closeTo(-0.707,0.001);
        expect(q.w).that.be.closeTo(0.0,0.001);
    });
})