
export function pairwise(src:Array<any>,f:(s:any,t:any)=>void,dest:Array<any>){
    for(let i=0,len= src.length;i<len;i++){
        f(src[i],dest[i]);
    }
}