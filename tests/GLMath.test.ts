import * as chai from 'chai';


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

