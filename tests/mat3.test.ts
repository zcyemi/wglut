import * as chai from 'chai';
import { pairwise, expectPair, expectVec3, expectVec4, expectQuat, expectMat3 } from './GLTestHelper';
import { glmath, vec3, vec4, mat3, mat4, quat } from '../src/wglut';

const expect = chai.expect;


describe('matrix-mat3',()=>{
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


})