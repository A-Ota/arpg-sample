(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0bdcaf"],{"2e06":function(e,t,i){"use strict";i.r(t);var r=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticStyle:{position:"relative"}},[i("div",{ref:"pixi_area",staticStyle:{position:"absolute",width:"320px",height:"240px"}}),i("div",{staticStyle:{position:"absolute",left:"10px",top:"10px","background-color":"#0000ff66",color:"#fff"}},[e._v("矢印キーで移動")])])},a=[],n=(i("d3b7"),i("6062"),i("3ca3"),i("ddb0"),i("2b0e")),o=i("22a2"),s=(i("18a5"),i("3835")),h=i("262e"),d=i("2caf"),c=i("bee2"),l=i("d4ec"),p=i("426a"),u=function e(t,i,r){Object(l["a"])(this,e),this.moveX=t,this.moveY=i,this.nextDirection=r},f=function(){function e(t,i,r){Object(l["a"])(this,e),this.textureOffset=i,this.routine=r,this.x=0,this.y=0,this.hitCircle=new o["Circle"](0,0,12),this.animationFrame=0,this._currentDirection=2,this.preUpdateInfo=null,this.animationStep=0,this.bodySprite=new p["a"],this.bodySprite.texture=new o["Texture"](t.baseTexture,new o["Rectangle"](i.x,i.y,32,64)),r.character=this,this.bodySprite.anchor.set(.5,.5);var a=new o["Texture"](t.baseTexture,new o["Rectangle"](0,224,32,32));this.shadowSprite=o["Sprite"].from(a),this.shadowSprite.alpha=.5,this.shadowSprite.anchor.set(.5,.5)}return Object(c["a"])(e,[{key:"currentDirection",get:function(){return this._currentDirection},set:function(e){this._currentDirection=e,this.syncTexture()}},{key:"syncTexture",value:function(){var e=0,t=0;switch(this.currentDirection){case 1:e=96;break;case 2:break;case 3:e=96,t=64;break;case 4:t=64;break;case 6:t=128;break;case 7:e=96,t=128;break;case 8:t=192;break;case 9:e=96,t=192;break}e+=32*(3===this.animationStep?1:this.animationStep);var i=new o["Rectangle"](this.textureOffset.x+e,this.textureOffset.y+t,32,64);this.bodySprite.texture.frame=i}},{key:"preUpdate",value:function(){this.routine.preUpdate()}},{key:"update",value:function(){var e=[this.x,this.y-28];this.bodySprite.x=e[0],this.bodySprite.y=e[1];var t=[this.x,this.y];this.shadowSprite.x=t[0],this.shadowSprite.y=t[1];var i=[this.x,this.y];this.hitCircle.x=i[0],this.hitCircle.y=i[1],this.bodySprite.zOrder=this.bodySprite.position.y,++this.animationFrame,this.animationFrame>30&&(this.animationFrame=0,this.animationStep=(this.animationStep+1)%4,this.syncTexture())}}]),e}(),v=function e(){Object(l["a"])(this,e)},y=37,C=38,m=39,w=40,b=function(e,t){var i=.7*t;switch(e){case 1:return[-i,i];case 2:return[0,t];case 3:return[i,i];case 4:return[-t,0];case 6:return[t,0];case 7:return[-i,-i];case 8:return[0,-t];case 9:return[i,-i]}return[0,0]},g=function(e){Object(h["a"])(i,e);var t=Object(d["a"])(i);function i(e){var r;return Object(l["a"])(this,i),r=t.call(this),r.pressedKeyCodeSet=e,r}return Object(c["a"])(i,[{key:"preUpdate",value:function(){var e=null;if(this.pressedKeyCodeSet.has(y)?e=this.pressedKeyCodeSet.has(w)?1:this.pressedKeyCodeSet.has(C)?7:4:this.pressedKeyCodeSet.has(m)?e=this.pressedKeyCodeSet.has(w)?3:this.pressedKeyCodeSet.has(C)?9:6:this.pressedKeyCodeSet.has(C)?e=8:this.pressedKeyCodeSet.has(w)&&(e=2),null!=e){var t=b(e,1),i=Object(s["a"])(t,2),r=i[0],a=i[1];this.character.preUpdateInfo=new u(r,a,e)}}}]),i}(v),x=function(e){Object(h["a"])(i,e);var t=Object(d["a"])(i);function i(){var e,r=arguments.length>0&&void 0!==arguments[0]&&arguments[0],a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:60;return Object(l["a"])(this,i),e=t.call(this),e.isMoving=r,e.frameCountToWait=a,e.frameCountToMove=n,e}return Object(c["a"])(i,[{key:"preUpdate",value:function(){if(this.isMoving){var e=b(this.character.currentDirection,.6),t=Object(s["a"])(e,2),i=t[0],r=t[1];this.character.preUpdateInfo=new u(i,r,this.character.currentDirection),--this.frameCountToWait,this.frameCountToWait<=0&&(this.frameCountToWait=0,this.frameCountToMove=60+30*Math.floor(3*Math.random()),this.isMoving=!1)}else if(--this.frameCountToMove,this.frameCountToMove<=0){this.frameCountToMove=0,this.frameCountToWait=60;var a=[1,2,3,4,6,7,8,9][Math.floor(8*Math.random())];this.character.preUpdateInfo=new u(0,0,a),this.isMoving=!0}}}]),i}(v),S=(i("a623"),i("4160"),i("159b"),i("d820")),O=function(e){Object(h["a"])(i,e);var t=Object(d["a"])(i);function i(e){var r;Object(l["a"])(this,i),r=t.call(this),r.texture=e,r.horizontalGridNum=30,r.verticalGridNum=30,r.targetCharacter=null,r.characters=[],r.sortableChildren=!0,r.bgLayerContainer=new o["ParticleContainer"](2e4,{uvs:!1}),r.layerContainer=new S["a"](2e4,{uvs:!0,vertices:!0,tint:!0}),r.addChild(r.bgLayerContainer),r.addChild(r.layerContainer);var a=e.clone();a.frame=new o["Rectangle"](0,0,16,16);for(var n=0;n<r.verticalGridNum;++n)for(var s=0;s<r.horizontalGridNum;++s){var h=o["Sprite"].from(a);h.position=new o["Point"](16*s,16*n),r.bgLayerContainer.addChild(h)}var d=e.clone();d.frame=new o["Rectangle"](96,64,16,16);var c=e.clone();c.frame=new o["Rectangle"](112,64,16,16);for(var p=1;p<r.verticalGridNum-1;++p){var u=o["Sprite"].from(d);u.position=new o["Point"](0,16*p),r.bgLayerContainer.addChild(u);var f=o["Sprite"].from(c);f.position=new o["Point"](16*r.horizontalGridNum-16,16*p),r.bgLayerContainer.addChild(f)}var v=e.clone();v.frame=new o["Rectangle"](96,96,16,16);var y=e.clone();y.frame=new o["Rectangle"](112,96,16,16);for(var C=1;C<r.horizontalGridNum-1;++C){var m=o["Sprite"].from(v);m.position=new o["Point"](16*C,0),r.bgLayerContainer.addChild(m);var w=o["Sprite"].from(y);w.position=new o["Point"](16*C,16*r.verticalGridNum-16),r.bgLayerContainer.addChild(w)}var b=e.clone();b.frame=new o["Rectangle"](96,48,16,16);var g=o["Sprite"].from(b);g.position=new o["Point"](0,0),r.bgLayerContainer.addChild(g);var x=e.clone();x.frame=new o["Rectangle"](112,48,16,16);var O=o["Sprite"].from(x);O.position=new o["Point"](16*r.horizontalGridNum-16,0),r.bgLayerContainer.addChild(O);var k=e.clone();k.frame=new o["Rectangle"](96,80,16,16);var M=o["Sprite"].from(k);M.position=new o["Point"](0,16*r.verticalGridNum-16),r.bgLayerContainer.addChild(M);var N=e.clone();N.frame=new o["Rectangle"](112,80,16,16);var G=o["Sprite"].from(N);G.position=new o["Point"](16*r.horizontalGridNum-16,16*r.verticalGridNum-16),r.bgLayerContainer.addChild(G);var T=e.clone();T.frame=new o["Rectangle"](32,64,64,16);var j=o["Sprite"].from(T);j.position=new o["Point"](16*r.horizontalGridNum/2-32,18*r.verticalGridNum/2),r.bgLayerContainer.addChild(j);var R=e.clone();R.frame=new o["Rectangle"](32,0,64,64);var L=new o["Sprite"](R);L.position=new o["Point"](16*r.horizontalGridNum/2-32,18*r.verticalGridNum/2-64),L.zOrder=L.position.y+48,r.layerContainer.addChild(L);var K=e.clone();K.frame=new o["Rectangle"](32,64,64,16);var P=o["Sprite"].from(K);P.position=new o["Point"](14*r.horizontalGridNum/2-32,15*r.verticalGridNum/2),r.bgLayerContainer.addChild(P);var U=e.clone();U.frame=new o["Rectangle"](32,0,64,64);var z=new o["Sprite"](U);return z.position=new o["Point"](14*r.horizontalGridNum/2-32,15*r.verticalGridNum/2-64),z.zOrder=z.position.y+48,r.layerContainer.addChild(z),r}return Object(c["a"])(i,[{key:"addCharacter",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];this.characters.push(e),t&&(this.targetCharacter=e),this.layerContainer.addChildZ(e.bodySprite,1),this.layerContainer.addChildZ(e.shadowSprite,1)}},{key:"update",value:function(){var e=this;this.characters.forEach((function(e){return e.preUpdate()})),this.characters.forEach((function(t){if(null!=t.preUpdateInfo){var i=[t.preUpdateInfo.moveX,t.preUpdateInfo.moveY],r=i[0],a=i[1];0==r&&0==a||!e.canMoveCharacter(t,r,a)||(t.x+=r,t.y+=a),t.currentDirection=t.preUpdateInfo.nextDirection,t.preUpdateInfo=null,t.update()}else t.update()}));var t=224,i=96,r=144,a=96;if(this.targetCharacter){var n=this.targetCharacter.x+this.x;n>t?this.x=-(this.targetCharacter.x-t):n<i&&(this.x=-(this.targetCharacter.x-i));var o=this.targetCharacter.y+this.y;o>r?this.y=-(this.targetCharacter.y-r):o<a&&(this.y=-(this.targetCharacter.y-a))}this.x=Math.floor(Math.min(0,Math.max(-(16*this.horizontalGridNum-320),this.x))),this.y=Math.floor(Math.min(0,Math.max(-(16*this.verticalGridNum-240),this.y))),this.layerContainer.sortChildren()}},{key:"canMoveCharacter",value:function(e,t,i){var r=e.hitCircle.clone();return r.x+=t,r.y+=i,this.characters.every((function(t){if(e===t)return!0;var i=[r.x,r.y,t.hitCircle.x,t.hitCircle.y],a=i[0],n=i[1],o=i[2],s=i[3];return Math.sqrt(Math.pow(o-a,2)+Math.pow(s-n,2))>r.radius+t.hitCircle.radius}))}}]),i}(o["Container"]),k=i("2e24"),M=i.n(k),N=n["default"].extend({data:function(){return{pixiApp:null,field:null,pressedKeyCodeSet:new Set,id:0}},mounted:function(){var e=this;o["settings"].RESOLUTION=window.devicePixelRatio,o["settings"].SCALE_MODE=o["SCALE_MODES"].NEAREST,window.onkeydown=this.onKeyDown,window.onkeyup=this.onKeyUp;var t={width:320,height:240};this.pixiApp=new o["Application"](t);var i=this.$refs["pixi_area"];i.appendChild(this.pixiApp.view);var r=new o["Sprite"](o["Texture"].WHITE);r.width=320,r.height=240,r.tint=13421772,this.pixiApp.stage.addChild(r),o["utils"].clearTextureCache(),o["Loader"].shared.reset().add("/arpg-sample/images/stages/005/all.png").load((function(){var t=o["Loader"].shared.resources["/arpg-sample/images/stages/005/all.png"].texture;e.field=new O(t),e.pixiApp.stage.addChild(e.field);var i=new f(t,new o["Point"](0,256),new g(e.pressedKeyCodeSet));i.x=200,i.y=140,e.field.addCharacter(i,!0);var r=new f(t,new o["Point"](192,256),new x);r.x=160,r.y=120,e.field.addCharacter(r);var a=new M.a;a.position.x=4,a.position.y=220,a.style={fontSize:16,fill:"#FFF"},e.pixiApp.stage.addChild(a)})),this.pixiApp.ticker.add(this.update)},methods:{onKeyDown:function(e){this.pressedKeyCodeSet.add(e.keyCode)},onKeyUp:function(e){this.pressedKeyCodeSet["delete"](e.keyCode)},update:function(e){null!=this.field&&this.field.update()}},beforeDestroy:function(){console.log("bdd"),this.pixiApp.destroy(!0)},components:{},computed:{},props:[]}),G=N,T=i("2877"),j=Object(T["a"])(G,r,a,!1,null,"22f0b692",null);t["default"]=j.exports}}]);
//# sourceMappingURL=chunk-2d0bdcaf.94ddbee1.js.map