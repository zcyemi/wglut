import * as chai from 'chai';
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