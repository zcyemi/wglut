"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GLProgram = /** @class */ (function () {
    function GLProgram(gl, program) {
        this.Attributes = {};
        this.Unifroms = {};
        this.Program = program;
        var numAttrs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (var i = 0; i < numAttrs; i++) {
            var attrInfo = gl.getActiveAttrib(program, i);
            if (attrInfo == null)
                continue;
            var attrLoca = gl.getAttribLocation(program, attrInfo.name);
            this.Attributes[attrInfo.name] = attrLoca;
        }
        var numUniform = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (var i = 0; i < numUniform; i++) {
            var uniformInfo = gl.getActiveUniform(program, i);
            if (uniformInfo == null)
                continue;
            var uniformLoca = gl.getUniformLocation(program, uniformInfo.name);
            this.Unifroms[uniformInfo.name] = uniformLoca;
        }
    }
    GLProgram.prototype.GetUnifrom = function (key) {
        return this.Unifroms[key];
    };
    GLProgram.prototype.GetAttribute = function (key) {
        return this.Attributes[key];
    };
    return GLProgram;
}());
exports.GLProgram = GLProgram;
//# sourceMappingURL=GLProgram.js.map