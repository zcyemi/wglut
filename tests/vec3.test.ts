import * as chai from 'chai';
import { pairwise, expectPair, expectVec3, expectVec4, expectQuat, expectMat3 } from './helper/GLTestHelper';
import { glmath, vec3, vec4, mat3, mat4, quat } from '../src/wglut';
const expect = chai.expect;

describe('vec3',()=>{
    it('ctor', () => {
        let v = glmath.vec3(1, 2, 3);
        expect(v.raw).that.deep.eq([1, 2, 3]);
    });
    it('clone', () => {
        let v = glmath.vec3(1, 2, 3);
        let v1 = v.clone();
        v.x = 2;
        expect(v1.raw).that.deep.eq([1, 2, 3]);
        expect(v.x).that.eq(2);
    })
    it('ctor null', () => {
        let v3 = new vec3();
        expect(v3.raw).to.be.an('array').that.deep.eq([0, 0, 0]);
    });
    it('toVec4', () => {
        let v3 = glmath.vec3(1, 2, 3);
        let v4 = v3.vec4(5);
        expect(v4.w).to.equal(5);
    });
    it('cross-crossverify', () => {
        let v1 = vec3.Random().normalize;
        let v2 = vec3.Random().normalize;
    
        let cross = vec3.Cross(v1, v2);
        let dot = v1.dot(v2);
        expect(cross.length2 + dot * dot).to.closeTo(1.0, 0.00001);
    })
    it('cross', () => {
        let c = vec3.up.cross(vec3.down).normalize;
        let cs = vec3.SafeCross(vec3.up, vec3.down).normalize;
    
        expect(cs.x).not.eq(NaN);
        expect(cs.y).not.eq(NaN);
        expect(cs.z).not.eq(NaN);
    })
    it('normalize', () => {
        let v = vec3.Random();
        let vn1 = v.normalized();
        expect(vn1.raw).not.eq(v.raw);
        let vn = v.normalize;
        expect(vn).eq(v);
        expectVec3(vn1, v);
    })
});

