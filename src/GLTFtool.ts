import { GLUtility } from "./GLUtility";

type TODO = any;

type int = number;

export class GLTFaccessor{
    public bufferView?:number;
    public byteOffset:number = 0;
    public componentType:number;
    public normalized:boolean = false;
    public count:number;
    public type:string;
    public max?: number[];
    public min?:number[];
    public sparse?:GLTFsparse;
    public name?:string;
    public extensions?:object;
    public extras?:any;
}

export class GLTFanimation{
    public channels:GLTFchannel[];
    public samplers:GLTFsampler[];
    public name?:string;
    public extensions?:object;
    public extras?:any;
}

export class GLTFanimationSampler{
    public input:int;
    public interpolation:string = "LINEAR";
    public output:int;
    public extensions?:object;
    public extras?:any;
}

export class GLTFasset{
    public copyright?:string;
    public generator?:string;
    public version:string;
    public minVersion?:string;
    public extensions?:object;
    public extras?:any;
}

export class GLTFbuffer{
    public uri?:string;
    public byteLength:int;
    public name?:string;
    public extensions?:object;
    public extras?:any;
}

export class GLTFbufferView{
    public buffer:int;
    public byteOffset:int = 0;
    public byteLength:int;
    public byteStride?:int;
    public target?:int;
    public name?:string;
    public extensions?:object;
    public extras?:any;
}

export class GLTFcamera{
    public orthographic?:GLTForthographic;
    public perspective?:GLTFperspective;
    public type:string;
    public name?:string;
    public extensions?:object;
    public extras?:any;
}

export class GLTFchannel{
    public sampler:int;
    public target:GLTFtarget;
    public extensions?:object;
    public extras?:any;
}

export class GLTFimage{
    public uri?:string;
    public mimeType?:string;
    public bufferView?:int;
    public name?:string;
    public extensions?:object;
    public extras?:any;
}

export class GLTFindices{
    public bufferView:int;
    public byteOffset:int = 0;
    public componentType:int;
    public extensions?:object;
    public extras?:any;
}

export class GLTFmaterial{
    public name?:string;
    public extensions?:object;
    public extras?:any;

    public pbrMetallicRoughness?:GLTFpbrMetallicRoughness;
    public normalTexture?:GLTFnormalTextureInfo;
    public occlusionTexture?:GLTFocclusionTextureInfo;
    public emissiveTexture?:GLTFtextureInfo;
    public emissiveFactor?:number[] = [0,0,0];
    public alphaMode:string = "OPAQUE";
    public alphaCufOff?:number;
    public doubleSided?:boolean = false;
}

export class GLTFmesh{
    public primitives:GLTFprimitive[];
    public weights?:number[];
    public name?:string;
    public extensions?:object;
    public extras?:any;
}

export class GLTFnode{
    public camera?:int;
    public children?:int[];
    public skin?:int;
    public matrix:number[] = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
    public mesh?:int;
    public rotation:number[] = [0,0,0,1];
    public scale:number[] = [1,1,1];
    public translation:number[] = [0,0,0];
    public weights?:number[];
    public name?:string;
    public extensions?:object;
    public extras?:any;
}

export class GLTFnormalTextureInfo{
    public index:int;
    public texCoord?:int = 0;
    public scale?:number = 1;
    public extensions?:object;
    public extras?:any;
}

export class GLTFocclusionTextureInfo{
    public index:int;
    public texCoord?:int = 0;
    public strength:number = 1;
    public extensions?:object;
    public extras?:any;
}

export class GLTForthographic{
    public xmag:number;
    public ymag:number;
    public zfar:number;
    public znear:number;
    public extensions?:object;
    public extras?:any;
}

export class GLTFpbrMetallicRoughness{
    public baseColorFactor:number[] = [1,1,1,1];
    public baseColorTexture?:GLTFtextureInfo;
    public metallicFactor:number = 1;
    public roughnessFactor:number = 1;
    public metallicRoughnessTexture?:GLTFtextureInfo;
    public extensions?:object;
    public extras?:any;
}

export class GLTFperspective{
    public aspectRatio?:number;
    public yfov:number;
    public zfar?:number;
    public znear?:number;
    public extensions?:object;
    public extras?:any;
}
export class GLTFprimitive{
    public attributes:object;
    public indices?:int;
    public material?:int;
    public mode:int = 4;
    public targets?:object[];
    public extensions?:object;
    public extras?:any;
}

export class GLTFsampler{
    public magFilter?:int;
    public minFilter?:int;
    public wrapS:int = 10497;
    public wrapT:int = 10497;
    public name?:string;
    public extensions?:object;
    public extras?:any;
}

export class GLTFscene{
    public nodes?:int[];
    public name?:string;
    public extensions?:object;
    public extras?:any;
}

export class GLTFskin{
    public inverseBindMatrices?:int;
    public skeleton?:int;
    public joints:int[];
    public name?:string;
    public extensions?:object;
    public extras?:any;
}

export class GLTFsparse{
    public count:int;
    public indices:GLTFindices;
    public values:GLTFvalues;
    public extensions?:object;
    public extras?:any;
}

export class GLTFtarget{
    public node?:int;
    public path:string;
    public extensions?:object;
    public extras?:any;
}

export class GLTFtexture{
    public sampler?:int;
    public sources?:int;
    public name?:string;
    public extensions?:object;
    public extras?:any;
}

export class GLTFtextureInfo{
    public index:int;
    public texCoord:int = 0;
    public extensions?:object;
    public extras?:any;
}

export class GLTFvalues{
    public bufferView:int;
    public byteOffset:int = 0;
    public extensions?:object;
    public extras?:any;
}

export class GLTFfile {
    public extensionsUsed?: string[];
    public extensionsRequired?: string[];
    public accessors?: GLTFaccessor[];
    public animations?: GLTFanimation[];
    public asset: GLTFasset;
    public buffers?: GLTFbuffer[];
    public bufferViews?: GLTFbufferView[];
    public cameras?: GLTFcamera[];
    public images?: GLTFimage[];
    public materials?:GLTFmaterial[];
    public meshes?:GLTFmesh[];
    public nodes?:GLTFnode[];
    public samplers?:GLTFsampler[];
    public scene?:int;
    public scenes?:GLTFscene[];
    public skins?:GLTFskin[];
    public textures?:GLTFtexture[];
    public extensions?:object;
    public extras?:any;
}

export class GLTFdata{
    public gltf:GLTFfile;
    public rawBinary:ArrayBuffer;
}

export class GLTFbinary{
    private constructor(){
    }
    public static fromBuffer(arybuffer:ArrayBuffer):GLTFdata|undefined{
    
        let dataview = new DataView(arybuffer,0,arybuffer.byteLength);
        let pos = 0;
        let magic = dataview.getUint32(0,true);
        if(magic != 0x46546C67) return undefined;
        let data = new GLTFdata();
        pos+=4;
        let version =dataview.getUint32(pos,true);
        pos +=4;
        let length = dataview.getUint32(pos);
        pos +=4;
        pos =this.parseChunk(data,dataview,pos);
        pos =this.parseChunk(data,dataview,pos);
        return data;
    }

    private static parseChunk(data:GLTFdata,dataview:DataView,pos:number):number{
        let chunkLen = dataview.getUint32(pos,true);
        pos +=4;
        let chunkType = dataview.getUint32(pos,true);
        pos+=4;

        let start = pos;

        if(chunkType == 0x4E4F534A){
            let jsonstr = String.fromCharCode.apply(null,new Uint8Array(dataview.buffer,start,chunkLen));
            data.gltf = JSON.parse(jsonstr);
        }
        else if(chunkType == 0x004E4942){
            let binary = dataview.buffer.slice(start,start+ chunkLen);
            data.rawBinary = binary;
        }
        else{
            throw new Error("unknown chunk. ");
        }

        pos+=chunkLen;
        return pos;
    }
}

export class GLTFtool{
    public static async LoadGLTF(json:string,bin?:string,images?:string[]){
        return new Promise<GLTFdata>((res,rej)=>{
        });
    }
    public static async LoadGLTFBinary(uri:string):Promise<GLTFdata>{
        return new Promise<GLTFdata>((res,rej)=>{
            let buffer:Promise<ArrayBuffer> = GLUtility.HttpGet(uri,"arraybuffer");
            buffer.then((result)=>{
                res(GLTFbinary.fromBuffer(result));
            },(err)=>{
                rej("load failed");
            })
        });
    }
}

