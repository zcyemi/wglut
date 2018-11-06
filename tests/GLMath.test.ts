import * as chai from 'chai';
import { pairwise, expectPair, expectVec3, expectVec4, expectQuat } from './helper/GLTestHelper';
import { glmath, vec3, vec4, mat3, mat4, quat } from '../src/wglut';
import { Transform } from 'stream';
import { version } from 'punycode';

const expect = chai.expect;



describe("glmath", () => {
    it("colne-mat3", () => {
        let mtx = mat3.fromRS(quat.Random(), vec3.Random());
        let raw = mtx.raw.slice(0);
        let mtxc = mtx.clone();
        let rawclone = mtxc.raw;
        expectPair(raw, rawclone);
        expectPair(mtx.raw, rawclone);
        expect(mtx.raw).not.eq(mtxc.raw);
    });
    it("colne-mat4", () => {
        let mtx = mat4.TRS(vec3.Random(), quat.Random(), vec3.Random());
        let raw = mtx.raw.slice(0);
        let mtxc = mtx.clone();
        let rawclone = mtxc.raw;
        expectPair(raw, rawclone);
        expectPair(mtx.raw, rawclone);
        expect(mtx.raw).not.eq(mtxc.raw);
    });
    it("colne-vec3", () => {
        let v = vec3.Random();
        let vc = v.clone();
        expectPair(v.raw, vc.raw);
        expect(v.raw).not.eq(vc.raw);
    });
    it("colne-vec4", () => {
        let v = vec4.Random();
        let vc = v.clone();
        expectPair(v.raw, vc.raw);
        expect(v.raw).not.eq(vc.raw);
    });
    it("colne-quat", () => {
        let v = quat.Random();
        let vc = v.clone();
        expectPair(v.raw, vc.raw);
        expect(v.raw).not.eq(vc.raw);
    });
})