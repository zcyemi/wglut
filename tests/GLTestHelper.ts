import * as chai from 'chai';
import { vec3, vec4, quat } from '../src/wglut';
const expect = chai.expect;

export function pairwise(src:Array<any>,f:(s:any,t:any)=>void,dest:Array<any>){
    for(let i=0,len= src.length;i<len;i++){
        f(src[i],dest[i]);
    }
}


export function expectPair(src:Array<any>,dest:Array<any>,torenlance:number = 0.001){
    pairwise(src,(s,t)=>{
        expect(s).closeTo(t,torenlance);
    },dest);
}

export function expectVec3(v1:vec3,v2:vec3,torenlance:number = 0.001){
    expectPair(v1.raw,v2.raw,torenlance);
}

export function expectVec4(v1:vec4,v2:vec4,torenlance:number = 0.001){
    expectPair(v1.raw,v2.raw,torenlance);
}

export function expectQuat(q1:quat,q2:quat){
    expect(q1.equals(q2)).to.eq(true,`${q1.raw} , ${q2.raw}`);
}