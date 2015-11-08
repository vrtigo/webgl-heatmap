#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp int;
    precision highp float;
#else
    precision mediump int;
    precision mediump float;
#endif
uniform sampler2D source;
varying vec2 texcoord;