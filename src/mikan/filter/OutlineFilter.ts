/* eslint-disable @typescript-eslint/no-use-before-define */
// import {vertex} from '@tools/fragments';
// import fragment from './outline.frag';
import { Filter } from 'pixi.js'

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

uniform vec2 thickness;
uniform vec4 outlineColor;
uniform vec4 filterClamp;

const float DOUBLE_PI = 3.14159265358979323846264 * 2.;

void main(void) {
    vec4 ownColor = texture2D(uSampler, vTextureCoord);
    vec4 curColor;
    float maxAlpha = 0.;
    vec2 displaced;
    for (float angle = 0.; angle <= DOUBLE_PI; angle += {{angleStep}}) {
        displaced.x = vTextureCoord.x + thickness.x * cos(angle);
        displaced.y = vTextureCoord.y + thickness.y * sin(angle);
        curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));
        maxAlpha = max(maxAlpha, curColor.a);
    }
    float resultAlpha = max(maxAlpha, ownColor.a);
    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);
}
`

const toFragmentSrc = (quality: number) => {
    const samples =  Math.max(
        quality * OutlineFilter.MAX_SAMPLES,
        OutlineFilter.MIN_SAMPLES
    );
    const angleStep = (Math.PI * 2 / samples).toFixed(7);
    return fragment.replace(/\{\{angleStep\}\}/, angleStep)
}

/**
 * OutlineFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 * http://codepen.io/mishaa/pen/emGNRB<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/outline.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-outline|@pixi/filter-outline}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 * @param {number} [thickness=1] The tickness of the outline. Make it 2 times more for resolution 2
 * @param {number} [color=0x000000] The color of the outline.
 * @param {number} [quality=0.1] The quality of the outline from `0` to `1`, using a higher quality
 *        setting will result in slower performance and more accuracy.
 *
 * @example
 *  someSprite.filters = [new OutlineFilter(2, 0x99ff99)];
 */
class OutlineFilter extends Filter {
  /**
 * The minimum number of samples for rendering outline.
 * @static
 * @member {number} MIN_SAMPLES
 * @memberof PIXI.filters.OutlineFilter
 * @default 1
 */
  static MIN_SAMPLES = 1


/**
 * The maximum number of samples for rendering outline.
 * @static
 * @member {number} MAX_SAMPLES
 * @memberof PIXI.filters.OutlineFilter
 * @default 100
 */
 static MAX_SAMPLES = 100;
    constructor(thickness = 1, color = 0x000000, quality = 0.1) {
        super(vertex, toFragmentSrc(quality));

        this.uniforms.thickness = new Float32Array([0, 0]);
        this.uniforms.outlineColor = new Float32Array([0, 0, 0, 1]);

        Object.assign(this, { thickness, color, quality });
    }

    apply(filterManager: any, input: any, output: any, clear: any) {
        this.uniforms.thickness[0] = this._thickness / input._frame.width;
        this.uniforms.thickness[1] = this._thickness / input._frame.height;

        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * The color of the glow.
     * @member {number}
     * @default 0x000000
     */
    get color() {
        return PIXI.utils.rgb2hex(this.uniforms.outlineColor);
    }
    set color(value) {
        PIXI.utils.hex2rgb(value, this.uniforms.outlineColor);
    }

    /**
     * The thickness of the outline.
     * @member {number}
     * @default 1
     */
    private _thickness = 1
    get thickness() {
        return this._thickness;
    }
    set thickness(value) {
        this._thickness = value;
        this.padding = value;
    }
}



export { OutlineFilter };