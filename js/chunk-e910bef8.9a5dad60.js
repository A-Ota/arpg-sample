(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e910bef8"],{"1f54":function(e,t,r){"use strict";r.r(t);var i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticStyle:{position:"relative"}},[r("div",{ref:"pixi_area",staticStyle:{position:"absolute",width:"320px",height:"240px"}},[r("div",{staticStyle:{position:"absolute",left:"8px",top:"8px","background-color":"#0000ff66",color:"#fff"}},[e._v("矢印キーで移動")]),r("b-button",{staticStyle:{position:"absolute",bottom:"8px",right:"8px"},on:{click:e.onClickToggleDebugMode}},[e._v(e._s(e.isDebugMode?"デバッグ非表示":"デバッグ表示"))])],1)])},a=[],n=(r("d3b7"),r("6062"),r("3ca3"),r("ddb0"),r("2b0e")),o=r("22a2"),s=(r("18a5"),r("3835")),c=r("262e"),h=r("2caf"),l=r("bee2"),d=r("d4ec"),u=r("426a"),f=function e(t,r,i){Object(d["a"])(this,e),this.moveX=t,this.moveY=r,this.nextDirection=i},p=function(){function e(t,r,i){Object(d["a"])(this,e),this.textureOffset=r,this.routine=i,this.x=0,this.y=0,this.hitCircle=new o["Circle"](0,0,12),this.hitRect=new o["Rectangle"](-12,-12,24,24),this.animationFrame=0,this._currentDirection=2,this.preUpdateInfo=null,this.animationStep=0,this.bodySprite=new u["a"],this.bodySprite.texture=new o["Texture"](t.baseTexture,new o["Rectangle"](r.x,r.y,32,64)),i.character=this,this.bodySprite.anchor.set(.5,1);var a=new o["Texture"](t.baseTexture,new o["Rectangle"](0,224,32,32));this.shadowSprite=o["Sprite"].from(a),this.shadowSprite.alpha=.5,this.shadowSprite.anchor.set(.5,.5),this.debugCircle=new o["Graphics"],this.debugCircle.lineStyle(2,16733525,1),this.debugCircle.alpha=.7,this.debugCircle.drawCircle(0,0,11),this.debugRect=new o["Graphics"],this.debugRect.lineStyle(2,5592575,1),this.debugRect.alpha=.7,this.debugRect.drawRect(this.hitRect.x,this.hitRect.y,this.hitRect.width,this.hitRect.height)}return Object(l["a"])(e,[{key:"currentDirection",get:function(){return this._currentDirection},set:function(e){this._currentDirection=e,this.syncTexture()}},{key:"syncTexture",value:function(){var e=0,t=0;switch(this.currentDirection){case 1:e=96;break;case 2:break;case 3:e=96,t=64;break;case 4:t=64;break;case 6:t=128;break;case 7:e=96,t=128;break;case 8:t=192;break;case 9:e=96,t=192;break}e+=32*(3===this.animationStep?1:this.animationStep);var r=new o["Rectangle"](this.textureOffset.x+e,this.textureOffset.y+t,32,64);this.bodySprite.texture.frame=r}},{key:"preUpdate",value:function(){this.routine.preUpdate()}},{key:"update",value:function(){var e=[this.x,this.y+8];this.bodySprite.x=e[0],this.bodySprite.y=e[1];var t=[this.x,this.y];this.shadowSprite.x=t[0],this.shadowSprite.y=t[1];var r=[this.x,this.y];this.hitCircle.x=r[0],this.hitCircle.y=r[1];var i=[this.x,this.y];this.debugCircle.x=i[0],this.debugCircle.y=i[1];var a=[this.x-12,this.y-12];this.hitRect.x=a[0],this.hitRect.y=a[1];var n=[this.x,this.y];this.debugRect.x=n[0],this.debugRect.y=n[1],this.bodySprite.zOrder=this.bodySprite.position.y,++this.animationFrame,this.animationFrame>30&&(this.animationFrame=0,this.animationStep=(this.animationStep+1)%4,this.syncTexture())}}]),e}(),v=function e(){Object(d["a"])(this,e)},y=37,b=38,m=39,C=40,g=function(e,t){var r=.7*t;switch(e){case 1:return[-r,r];case 2:return[0,t];case 3:return[r,r];case 4:return[-t,0];case 6:return[t,0];case 7:return[-r,-r];case 8:return[0,-t];case 9:return[r,-r]}return[0,0]},w=function(e){Object(c["a"])(r,e);var t=Object(h["a"])(r);function r(e){var i;return Object(d["a"])(this,r),i=t.call(this),i.pressedKeyCodeSet=e,i}return Object(l["a"])(r,[{key:"preUpdate",value:function(){var e=null;if(this.pressedKeyCodeSet.has(y)?e=this.pressedKeyCodeSet.has(C)?1:this.pressedKeyCodeSet.has(b)?7:4:this.pressedKeyCodeSet.has(m)?e=this.pressedKeyCodeSet.has(C)?3:this.pressedKeyCodeSet.has(b)?9:6:this.pressedKeyCodeSet.has(b)?e=8:this.pressedKeyCodeSet.has(C)&&(e=2),null!=e){var t=g(e,1),r=Object(s["a"])(t,2),i=r[0],a=r[1];this.character.preUpdateInfo=new f(i,a,e)}}}]),r}(v),x=function(e){Object(c["a"])(r,e);var t=Object(h["a"])(r);function r(){var e,i=arguments.length>0&&void 0!==arguments[0]&&arguments[0],a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:60;return Object(d["a"])(this,r),e=t.call(this),e.isMoving=i,e.frameCountToWait=a,e.frameCountToMove=n,e}return Object(l["a"])(r,[{key:"preUpdate",value:function(){if(this.isMoving){var e=g(this.character.currentDirection,.6),t=Object(s["a"])(e,2),r=t[0],i=t[1];this.character.preUpdateInfo=new f(r,i,this.character.currentDirection),--this.frameCountToWait,this.frameCountToWait<=0&&(this.frameCountToWait=0,this.frameCountToMove=60+30*Math.floor(3*Math.random()),this.isMoving=!1)}else if(--this.frameCountToMove,this.frameCountToMove<=0){this.frameCountToMove=0,this.frameCountToWait=60;var a=[1,2,3,4,6,7,8,9][Math.floor(8*Math.random())];this.character.preUpdateInfo=new f(0,0,a),this.isMoving=!0}}}]),r}(v),S=(r("4160"),r("45fc"),r("a9e3"),r("159b"),r("d820")),_=r("2e24"),O=r.n(_),N=function(e){Object(c["a"])(r,e);var t=Object(h["a"])(r);function r(e){var i;Object(d["a"])(this,r),i=t.call(this),i.texture=e,i.horizontalGridNum=26,i.verticalGridNum=22,i.targetCharacter=null,i.characters=[],i.walls=[],i.sortableChildren=!0,i.bgLayerContainer=new o["ParticleContainer"](2e4,{uvs:!1}),i.layerContainer=new S["a"](2e4,{uvs:!0,vertices:!0,tint:!0}),i.debugLayerContainer=new o["Container"],i.debugLayerContainer.visible=!1,i.addChild(i.bgLayerContainer),i.addChild(i.layerContainer),i.addChild(i.debugLayerContainer),i.fpsCounter=new O.a,i.fpsCounter.position.set(4,220),i.fpsCounter.style={fontSize:16,fill:"#FFF"},i.fpsCounter.visible=!1;var a=e.clone();a.frame=new o["Rectangle"](176,0,16,16);for(var n=0;n<i.verticalGridNum;++n)for(var s=0;s<i.horizontalGridNum;++s){var c=o["Sprite"].from(a);c.position=new o["Point"](16*s,16*n),i.bgLayerContainer.addChild(c)}var h=e.clone();h.frame=new o["Rectangle"](176,48,16,48);var l=e.clone();l.frame=new o["Rectangle"](176,16,16,32);for(var u=1;u<i.horizontalGridNum-1;++u){var f=o["Sprite"].from(h);f.position.set(16*u,0),i.bgLayerContainer.addChild(f);var p=o["Sprite"].from(l);p.position.set(16*u,16*i.verticalGridNum-32),i.layerContainer.addChildZ(p,Number.MAX_VALUE)}var v=e.clone();v.frame=new o["Rectangle"](192,32,16,16);var y=e.clone();y.frame=new o["Rectangle"](160,32,16,32);for(var b=1;b<i.verticalGridNum-2;++b){var m=o["Sprite"].from(v);m.position.set(0,16*b),i.layerContainer.addChildZ(m,Number.MAX_VALUE);var C=o["Sprite"].from(y);C.position.set(16*i.horizontalGridNum-16,16*b),i.layerContainer.addChildZ(C,Number.MAX_VALUE)}var g=e.clone();g.frame=new o["Rectangle"](176,32,16,16);var w=e.clone();w.frame=new o["Rectangle"](192,64,16,16);var x=o["Sprite"].from(w);i.layerContainer.addChildZ(x,Number.MAX_VALUE);var _=e.clone();_.frame=new o["Rectangle"](208,64,16,16);var N=o["Sprite"].from(_);N.position.set(16*i.horizontalGridNum-16,0),i.layerContainer.addChildZ(N,Number.MAX_VALUE);var T=e.clone();T.frame=new o["Rectangle"](192,80,16,16);var R=o["Sprite"].from(T);R.position.set(0,16*i.verticalGridNum-32),i.layerContainer.addChildZ(R,Number.MAX_VALUE);var M=o["Sprite"].from(g);M.position.set(0,16*i.verticalGridNum-16),i.layerContainer.addChildZ(M,Number.MAX_VALUE);var A=e.clone();A.frame=new o["Rectangle"](208,80,16,16);var E=o["Sprite"].from(A);E.position.set(16*i.horizontalGridNum-16,16*i.verticalGridNum-32),i.layerContainer.addChildZ(E,Number.MAX_VALUE);var k=o["Sprite"].from(g);k.position.set(16*i.horizontalGridNum-16,16*i.verticalGridNum-16),i.layerContainer.addChildZ(k,Number.MAX_VALUE);var L=e.clone();L.frame=new o["Rectangle"](128,32,32,32);for(var j=0;j<3;++j){var D=o["Sprite"].from(L);D.position.set(16+32*j,192),i.layerContainer.addChildZ(D,D.position.y)}var F=e.clone();F.frame=new o["Rectangle"](0,208,16,16);for(var I=1;I<i.horizontalGridNum-1;++I){var U=o["Sprite"].from(F);U.alpha=.3,U.position.set(16*I,48),i.bgLayerContainer.addChild(U)}for(var G=4;G<i.verticalGridNum-1;++G){var P=o["Sprite"].from(F);P.alpha=.3,P.position.set(16,16*G),i.bgLayerContainer.addChild(P)}var V=e.clone();V.frame=new o["Rectangle"](16,192,16,16);var K=e.clone();K.frame=new o["Rectangle"](32,192,16,16);var W=e.clone();W.frame=new o["Rectangle"](16,208,16,16);for(var z=2;z<7;++z){var Z=o["Sprite"].from(V);Z.alpha=.3,Z.position.set(16*z,224),i.bgLayerContainer.addChild(Z)}var X=o["Sprite"].from(W);X.alpha=.3,X.position.set(112,224),i.bgLayerContainer.addChild(X);var Y=o["Sprite"].from(K);Y.alpha=.3,Y.position.set(112,208),i.bgLayerContainer.addChild(Y);var $=e.clone();$.frame=new o["Rectangle"](0,192,16,16);var J=o["Sprite"].from($);return J.alpha=.3,J.position.set(112,192),i.bgLayerContainer.addChild(J),i.addWall(new o["Rectangle"](0,0,16,16*i.verticalGridNum)),i.addWall(new o["Rectangle"](16*i.horizontalGridNum-16,0,16,16*i.verticalGridNum)),i.addWall(new o["Rectangle"](16,0,16*i.horizontalGridNum-32,48)),i.addWall(new o["Rectangle"](16,16*i.verticalGridNum,16*i.horizontalGridNum-32,16)),i.addWall(new o["Rectangle"](16,192,96,32)),i.on("added",(function(){i.parent.addChild(i.fpsCounter)})),i}return Object(l["a"])(r,[{key:"addWall",value:function(e){this.walls.push(e);var t=new o["Graphics"];t.lineStyle(2,5592575,1),t.drawRect(e.x+1,e.y+1,e.width-2,e.height-2),this.debugLayerContainer.addChild(t)}},{key:"addCharacter",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];this.characters.push(e),t&&(this.targetCharacter=e),this.layerContainer.addChildZ(e.bodySprite,1),this.layerContainer.addChildZ(e.shadowSprite,1),this.debugLayerContainer.addChild(e.debugCircle),this.debugLayerContainer.addChild(e.debugRect)}},{key:"update",value:function(){var e=this;this.characters.forEach((function(e){return e.preUpdate()})),this.characters.forEach((function(t){if(null!=t.preUpdateInfo){var r=[t.preUpdateInfo.moveX,t.preUpdateInfo.moveY],i=r[0],a=r[1];0==i&&0==a||e.hitOtherCaracter(t,i,a)||(e.hitWall(t,i,a)?e.hitWall(t,0,a)?e.hitWall(t,i,0)||(t.x+=i):t.y+=a:(t.x+=i,t.y+=a)),t.currentDirection=t.preUpdateInfo.nextDirection,t.preUpdateInfo=null,t.update()}else t.update()}));var t=224,r=96,i=144,a=96;if(this.targetCharacter){var n=this.targetCharacter.x+this.x;n>t?this.x=-(this.targetCharacter.x-t):n<r&&(this.x=-(this.targetCharacter.x-r));var o=this.targetCharacter.y+this.y;o>i?this.y=-(this.targetCharacter.y-i):o<a&&(this.y=-(this.targetCharacter.y-a))}this.x=Math.floor(Math.min(0,Math.max(-(16*this.horizontalGridNum-320),this.x))),this.y=Math.floor(Math.min(0,Math.max(-(16*this.verticalGridNum-240),this.y))),this.layerContainer.sortChildren()}},{key:"hitOtherCaracter",value:function(e,t,r){var i=e.hitCircle.clone();return i.x+=t,i.y+=r,this.characters.some((function(t){if(e===t)return!1;var r=[i.x,i.y,t.hitCircle.x,t.hitCircle.y],a=r[0],n=r[1],o=r[2],s=r[3];return Math.sqrt(Math.pow(o-a,2)+Math.pow(s-n,2))<=i.radius+t.hitCircle.radius}))}},{key:"hitWall",value:function(e,t,r){var i=e.hitRect.clone();return i.x+=t,i.y+=r,this.walls.some((function(e){var t=i.left<=e.right&&i.right>=e.left,r=i.top<=e.bottom&&i.bottom>=e.top;return t&&r}))}},{key:"setDebugMode",value:function(e){this.debugLayerContainer.visible=e,this.fpsCounter.visible=e}}]),r}(o["Container"]),T=n["default"].extend({data:function(){return{pixiApp:null,field:null,pressedKeyCodeSet:new Set,isDebugMode:!1}},mounted:function(){var e=this;o["settings"].RESOLUTION=window.devicePixelRatio,o["settings"].SCALE_MODE=o["SCALE_MODES"].NEAREST,window.onkeydown=this.onKeyDown,window.onkeyup=this.onKeyUp;var t={width:320,height:240};this.pixiApp=new o["Application"](t);var r=this.$refs["pixi_area"];r.appendChild(this.pixiApp.view);var i=new o["Sprite"](o["Texture"].WHITE);i.width=320,i.height=240,i.tint=13421772,this.pixiApp.stage.addChild(i),o["utils"].clearTextureCache(),o["Loader"].shared.reset().add("/arpg-sample/images/stages/007/all.png").load((function(){var t=o["Loader"].shared.resources["/arpg-sample/images/stages/007/all.png"].texture;e.field=new N(t),e.pixiApp.stage.addChild(e.field);var r=new p(t,new o["Point"](0,256),new w(e.pressedKeyCodeSet));r.x=200,r.y=160,e.field.addCharacter(r,!0);var i=new p(t,new o["Point"](192,256),new x);i.x=240,i.y=180,e.field.addCharacter(i)})),this.pixiApp.ticker.add(this.update)},methods:{onKeyDown:function(e){this.pressedKeyCodeSet.add(e.keyCode)},onKeyUp:function(e){this.pressedKeyCodeSet["delete"](e.keyCode)},update:function(e){null!=this.field&&this.field.update()},onClickToggleDebugMode:function(){this.isDebugMode=!this.isDebugMode,this.field.setDebugMode(this.isDebugMode)}},beforeDestroy:function(){console.log("bdd"),this.pixiApp.destroy(!0)},components:{},computed:{},props:[]}),R=T,M=r("2877"),A=Object(M["a"])(R,i,a,!1,null,"04959594",null);t["default"]=A.exports},"2e24":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=r("8e32"),a=i.PixiFps;t.default=a},"45fc":function(e,t,r){"use strict";var i=r("23e7"),a=r("b727").some,n=r("a640"),o=r("ae40"),s=n("some"),c=o("some");i({target:"Array",proto:!0,forced:!s||!c},{some:function(e){return a(this,e,arguments.length>1?arguments[1]:void 0)}})},5899:function(e,t){e.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(e,t,r){var i=r("1d80"),a=r("5899"),n="["+a+"]",o=RegExp("^"+n+n+"*"),s=RegExp(n+n+"*$"),c=function(e){return function(t){var r=String(i(t));return 1&e&&(r=r.replace(o,"")),2&e&&(r=r.replace(s,"")),r}};e.exports={start:c(1),end:c(2),trim:c(3)}},"8e32":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PixiFps=void 0;var i=a(r("22a2"));function a(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){var i=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,r):{};i.get||i.set?Object.defineProperty(t,r,i):t[r]=e[r]}return t.default=e,t}function n(e){return n="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},i=Object.keys(r);"function"===typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(r).filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})))),i.forEach((function(t){v(e,t,r[t])}))}return e}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function h(e,t,r){return t&&c(e.prototype,t),r&&c(e,r),e}function l(e,t){return!t||"object"!==n(t)&&"function"!==typeof t?p(e):t}function d(e){return d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},d(e)}function u(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&f(e,t)}function f(e,t){return f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},f(e,t)}function p(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function v(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var y=function(e){function t(e){var r;s(this,t),r=l(this,d(t).call(this)),v(p(p(r)),"_fpsTextField",void 0),v(p(p(r)),"_fpsTicker",void 0),v(p(p(r)),"_timeValues",void 0),v(p(p(r)),"_lastTime",void 0);var a=new i.TextStyle({fontSize:t.DEFAULT_FONT_SIZE,fill:t.DEFAULT_FONT_COLOR});return r._timeValues=[],r._lastTime=(new Date).getTime(),r._fpsTextField=new i.Text("",o({},a,e)),r._fpsTicker=new i.Ticker,r._fpsTicker.add((function(){r.measureFPS()})),r._fpsTicker.start(),r.addChild(r._fpsTextField),r}return u(t,e),h(t,[{key:"measureFPS",value:function(){var e=(new Date).getTime();if(this._timeValues.push(1e3/(e-this._lastTime)),30===this._timeValues.length){for(var t=0,r=0;r<30;r++)t+=this._timeValues[r];this._fpsTextField.text=(t/30).toFixed(2),this._timeValues.length=0}this._lastTime=e}},{key:"style",set:function(e){this._fpsTextField.style=e}}]),t}(i.Container);t.PixiFps=y,v(y,"DEFAULT_FONT_SIZE",30),v(y,"DEFAULT_FONT_COLOR",16711680)},a9e3:function(e,t,r){"use strict";var i=r("83ab"),a=r("da84"),n=r("94ca"),o=r("6eeb"),s=r("5135"),c=r("c6b6"),h=r("7156"),l=r("c04e"),d=r("d039"),u=r("7c73"),f=r("241c").f,p=r("06cf").f,v=r("9bf2").f,y=r("58a8").trim,b="Number",m=a[b],C=m.prototype,g=c(u(C))==b,w=function(e){var t,r,i,a,n,o,s,c,h=l(e,!1);if("string"==typeof h&&h.length>2)if(h=y(h),t=h.charCodeAt(0),43===t||45===t){if(r=h.charCodeAt(2),88===r||120===r)return NaN}else if(48===t){switch(h.charCodeAt(1)){case 66:case 98:i=2,a=49;break;case 79:case 111:i=8,a=55;break;default:return+h}for(n=h.slice(2),o=n.length,s=0;s<o;s++)if(c=n.charCodeAt(s),c<48||c>a)return NaN;return parseInt(n,i)}return+h};if(n(b,!m(" 0o1")||!m("0b1")||m("+0x1"))){for(var x,S=function(e){var t=arguments.length<1?0:e,r=this;return r instanceof S&&(g?d((function(){C.valueOf.call(r)})):c(r)!=b)?h(new m(w(t)),r,S):w(t)},_=i?f(m):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger,fromString,range".split(","),O=0;_.length>O;O++)s(m,x=_[O])&&!s(S,x)&&v(S,x,p(m,x));S.prototype=C,C.constructor=S,o(a,b,S)}}}]);
//# sourceMappingURL=chunk-e910bef8.9a5dad60.js.map