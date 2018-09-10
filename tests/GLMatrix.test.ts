import * as chai from 'chai';
import { glmath,vec3,vec4,mat3,mat4,quat} from '../src/wglut';
const expect = chai.expect;
const should = chai.should;

import { pairwise} from './GLTestHelper';


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