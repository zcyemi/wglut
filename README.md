# wglut
webgl utility toolkit in typescript - mainly mathematics library and handy helper functions for coding your WebGL program.
This lib was originally used for my personal WebGL engine. I will continue working on bugs fixes and unit-test coverage.

## install
`npm i wglut`

## Classes
- GLMath (vec4/vec3/quat/mat4/mat3)
  + Right-Hand coordinate, some functions offer left-hand coord versions.
  + Full bidirectional conversion for Euler-angle, quaternion and rotation matrix.
  + Euler-angle rotation follows the order Z-X-Y.
- GLContext
  + Wrap of `WebGLRenderingContxt`
- GLProgram
  + Wrap of `WebGLProgram` with prequeried shader uniforms/unifomrblocks
- GLPipelineState
  + Ideal model targets for managing GL-pipeline states (not working well)
- GLTFtool
  + GLTF parser, only implements .glb file parsing currently.
  
## License
MIT
