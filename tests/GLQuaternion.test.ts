import * as chai from 'chai';


import { glmath,vec3,vec4,mat3,mat4,quat} from '../src/wglut';
import { pairwise } from './GLTestHelper';

const expect = chai.expect;


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
})