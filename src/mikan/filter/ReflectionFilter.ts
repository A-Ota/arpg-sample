import { Filter } from 'pixi.js';

const vertex = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`

const fragment = `varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 filterArea;
uniform vec4 filterClamp;
uniform vec2 dimensions;

uniform bool mirror;
uniform float boundary;
uniform vec2 amplitude;
uniform vec2 waveLength;
uniform vec2 alpha;
uniform float time;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void)
{
    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;
    vec2 coord = pixelCoord / dimensions;

    if (coord.y < boundary) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
        return;
    }

    float k = 0.4;
    float areaY = boundary * dimensions.y / filterArea.y;
    float v = areaY + areaY - vTextureCoord.y;
    float y = mirror ? v : vTextureCoord.y;

    float _amplitude = ((amplitude.y - amplitude.x) * k + amplitude.x ) / filterArea.x;
    float _waveLength = ((waveLength.y - waveLength.x) * k + waveLength.x) / filterArea.y;
    float _alpha = (alpha.y - alpha.x) * k + alpha.x;

    float x = vTextureCoord.x + cos(v * 6.28 / _waveLength - time) * _amplitude;
    x = clamp(x, filterClamp.x, filterClamp.z);

    vec4 color = texture2D(uSampler, vec2(x, y));

    gl_FragColor = color * _alpha;
}`

/**
 * Applies a reflection effect to simulate the reflection on water with waves.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/reflection.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-reflection|@pixi/filter-reflection}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @param {object} [options] - The optional parameters of Reflection effect.
 * @param {number} [options.mirror=true] - `true` to reflect the image, `false` for waves-only
 * @param {number} [options.boundary=0.5] - Vertical position of the reflection point, default is 50% (middle)
 *                 smaller numbers produce a larger reflection, larger numbers produce a smaller reflection.
 * @param {number} [options.amplitude=[0, 20]] - Starting and ending amplitude of waves
 * @param {number} [options.waveLength=[30, 100]] - Starting and ending length of waves
 * @param {number} [options.alpha=[1, 1]] - Starting and ending alpha values
 * @param {number} [options.time=0] - Time for animating position of waves
 */
class ReflectionFilter extends Filter {
    constructor(options: any) {
        super(vertex, fragment);
        this.uniforms.amplitude = new Float32Array(2);
        this.uniforms.waveLength = new Float32Array(2);
        this.uniforms.alpha = new Float32Array(2);
        this.uniforms.dimensions = new Float32Array(2);

        Object.assign(this, {
            mirror: true,
            boundary: 0.5,
            amplitude: [0, 20],
            waveLength: [30, 100],
            alpha: [1, 1],

            /**
             * Time for animating position of waves
             *
             * @member {number}
             * @memberof PIXI.filters.ReflectionFilter#
             * @default 0
             */
            time: 0,
        }, options);
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    private time: any = 0

    apply(filterManager: any, input: any, output: any, clear: any) {
        this.uniforms.dimensions[0] = input.filterFrame.width;
        this.uniforms.dimensions[1] = input.filterFrame.height;

        this.uniforms.time = this.time;

        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * `true` to reflect the image, `false` for waves-only
     *
     * @member {boolean}
     * @default true
     */
    set mirror(value) {
        this.uniforms.mirror = value;
    }
    get mirror() {
        return this.uniforms.mirror;
    }

    /**
     * Vertical position of the reflection point, default is 50% (middle)
     * smaller numbers produce a larger reflection, larger numbers produce a smaller reflection.
     *
     * @member {number}
     * @default 0.5
     */
    set boundary(value) {
        this.uniforms.boundary = value;
    }
    get boundary() {
        return this.uniforms.boundary;
    }

    /**
     * Starting and ending amplitude of waves
     * @member {number[]}
     * @default [0, 20]
     */
    set amplitude(value) {
        this.uniforms.amplitude[0] = value[0];
        this.uniforms.amplitude[1] = value[1];
    }
    get amplitude() {
        return this.uniforms.amplitude;
    }

    /**
     * Starting and ending length of waves
     * @member {number[]}
     * @default [30, 100]
     */
    set waveLength(value) {
        this.uniforms.waveLength[0] = value[0];
        this.uniforms.waveLength[1] = value[1];
    }
    get waveLength() {
        return this.uniforms.waveLength;
    }

    /**
     * Starting and ending alpha values
     * @member {number[]}
     * @default [1, 1]
     */
    set alpha(value) {
        this.uniforms.alpha[0] = value[0];
        this.uniforms.alpha[1] = value[1];
    }
    get alpha() {
        return this.uniforms.alpha;
    }
}

export { ReflectionFilter };
