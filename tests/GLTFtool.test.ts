import * as chai from 'chai';
import { pairwise, expectPair, expectVec3, expectVec4} from './GLTestHelper';


import { GLTFtool}from '../src/GLTFtool';

describe("gltf",async ()=>{

    let path = 'data/scene.glb';

    let gltfdata = await GLTFtool.LoadGLTFBinary(path);

    if(gltfdata == null) return;

    let images = gltfdata.gltf.images;
});