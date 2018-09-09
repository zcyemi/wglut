
export class quat{

    public raw:number[];
    
    public get x():number{return this.raw[0];}
    public get y():number{return this.raw[1];}
    public get z():number{return this.raw[2];}
    public get w():number{return this.raw[3];}

    public set x(v:number){this.raw[0]=v;}
    public set y(v:number){this.raw[1]=v;}
    public set z(v:number){this.raw[2]=v;}
    public set w(v:number){this.raw[3]=v;}

    public constructor(v?:number[]){
        if(v != null){
            this.raw = v;
        }
        else{
            this.raw = [0,0,0,0];
        }
    }

}