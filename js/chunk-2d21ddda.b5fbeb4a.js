(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d21ddda"],{d2b8:function(e,t,i){"use strict";i.r(t);var r=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticStyle:{position:"relative"}},[i("div",{ref:"pixi_area",staticStyle:{position:"absolute",width:"320px",height:"240px"}},[i("div",{staticStyle:{position:"absolute",left:"8px",top:"8px","background-color":"#0000ff66",color:"#fff"}},[e._v("矢印キーで移動")]),i("b-button",{staticStyle:{position:"absolute",bottom:"8px",right:"8px"},on:{click:e.onClickToggleDebugMode}},[e._v(e._s(e.isDebugMode?"デバッグ非表示":"デバッグ表示"))])],1)])},a=[],n=(i("d3b7"),i("6062"),i("3ca3"),i("ddb0"),i("2b0e")),o=i("22a2"),s=(i("18a5"),i("3835")),d=i("262e"),h=i("2caf"),c=i("bee2"),l=i("d4ec"),u=i("426a"),p=function e(t,i,r){Object(l["a"])(this,e),this.moveX=t,this.moveY=i,this.nextDirection=r},f=function(){function e(t,i,r){Object(l["a"])(this,e),this.textureOffset=i,this.routine=r,this.x=0,this.y=0,this.hitCircle=new o["Circle"](0,0,12),this.animationFrame=0,this._currentDirection=2,this.preUpdateInfo=null,this.animationStep=0,this.bodySprite=new u["a"],this.bodySprite.texture=new o["Texture"](t.baseTexture,new o["Rectangle"](i.x,i.y,32,64)),r.character=this,this.bodySprite.anchor.set(.5,1);var a=new o["Texture"](t.baseTexture,new o["Rectangle"](0,224,32,32));this.shadowSprite=o["Sprite"].from(a),this.shadowSprite.alpha=.5,this.shadowSprite.anchor.set(.5,.5),this.debugCircle=new o["Graphics"],this.debugCircle.lineStyle(2,16733525,1),this.debugCircle.drawCircle(0,0,11)}return Object(c["a"])(e,[{key:"currentDirection",get:function(){return this._currentDirection},set:function(e){this._currentDirection=e,this.syncTexture()}},{key:"syncTexture",value:function(){var e=0,t=0;switch(this.currentDirection){case 1:e=96;break;case 2:break;case 3:e=96,t=64;break;case 4:t=64;break;case 6:t=128;break;case 7:e=96,t=128;break;case 8:t=192;break;case 9:e=96,t=192;break}e+=32*(3===this.animationStep?1:this.animationStep);var i=new o["Rectangle"](this.textureOffset.x+e,this.textureOffset.y+t,32,64);this.bodySprite.texture.frame=i}},{key:"preUpdate",value:function(){this.routine.preUpdate()}},{key:"update",value:function(){var e=[this.x,this.y+8];this.bodySprite.x=e[0],this.bodySprite.y=e[1];var t=[this.x,this.y];this.shadowSprite.x=t[0],this.shadowSprite.y=t[1];var i=[this.x,this.y];this.hitCircle.x=i[0],this.hitCircle.y=i[1];var r=[this.x,this.y];this.debugCircle.x=r[0],this.debugCircle.y=r[1],this.bodySprite.zOrder=this.bodySprite.position.y,++this.animationFrame,this.animationFrame>30&&(this.animationFrame=0,this.animationStep=(this.animationStep+1)%4,this.syncTexture())}}]),e}(),v=function e(){Object(l["a"])(this,e)},C=37,y=38,b=39,g=40,m=function(e,t){var i=.7*t;switch(e){case 1:return[-i,i];case 2:return[0,t];case 3:return[i,i];case 4:return[-t,0];case 6:return[t,0];case 7:return[-i,-i];case 8:return[0,-t];case 9:return[i,-i]}return[0,0]},w=function(e){Object(d["a"])(i,e);var t=Object(h["a"])(i);function i(e){var r;return Object(l["a"])(this,i),r=t.call(this),r.pressedKeyCodeSet=e,r}return Object(c["a"])(i,[{key:"preUpdate",value:function(){var e=null;if(this.pressedKeyCodeSet.has(C)?e=this.pressedKeyCodeSet.has(g)?1:this.pressedKeyCodeSet.has(y)?7:4:this.pressedKeyCodeSet.has(b)?e=this.pressedKeyCodeSet.has(g)?3:this.pressedKeyCodeSet.has(y)?9:6:this.pressedKeyCodeSet.has(y)?e=8:this.pressedKeyCodeSet.has(g)&&(e=2),null!=e){var t=m(e,1),i=Object(s["a"])(t,2),r=i[0],a=i[1];this.character.preUpdateInfo=new p(r,a,e)}}}]),i}(v),x=function(e){Object(d["a"])(i,e);var t=Object(h["a"])(i);function i(){var e,r=arguments.length>0&&void 0!==arguments[0]&&arguments[0],a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:60;return Object(l["a"])(this,i),e=t.call(this),e.isMoving=r,e.frameCountToWait=a,e.frameCountToMove=n,e}return Object(c["a"])(i,[{key:"preUpdate",value:function(){}}]),i}(v),S=(i("a623"),i("4160"),i("159b"),i("d820")),k=i("2e24"),O=i.n(k),M=function(e){Object(d["a"])(i,e);var t=Object(h["a"])(i);function i(e){var r;Object(l["a"])(this,i),r=t.call(this),r.texture=e,r.horizontalGridNum=30,r.verticalGridNum=30,r.targetCharacter=null,r.characters=[],r.sortableChildren=!0,r.bgLayerContainer=new o["ParticleContainer"](2e4,{uvs:!1}),r.layerContainer=new S["a"](2e4,{uvs:!0,vertices:!0,tint:!0}),r.debugLayerContainer=new o["Container"],r.debugLayerContainer.visible=!1,r.addChild(r.bgLayerContainer),r.addChild(r.layerContainer),r.addChild(r.debugLayerContainer),r.fpsCounter=new O.a,r.fpsCounter.position.set(4,220),r.fpsCounter.style={fontSize:16,fill:"#FFF"},r.fpsCounter.visible=!1;var a=e.clone();a.frame=new o["Rectangle"](16,0,16,16);for(var n=0;n<r.verticalGridNum;++n)for(var s=0;s<r.horizontalGridNum;++s){var d=o["Sprite"].from(a);d.position=new o["Point"](16*s,16*n),r.bgLayerContainer.addChild(d)}var h=e.clone();h.frame=new o["Rectangle"](96,64,16,16);var c=e.clone();c.frame=new o["Rectangle"](112,64,16,16);for(var u=1;u<r.verticalGridNum-1;++u){var p=o["Sprite"].from(h);p.position=new o["Point"](0,16*u),r.bgLayerContainer.addChild(p);var f=o["Sprite"].from(c);f.position=new o["Point"](16*r.horizontalGridNum-16,16*u),r.bgLayerContainer.addChild(f)}var v=e.clone();v.frame=new o["Rectangle"](96,96,16,16);var C=e.clone();C.frame=new o["Rectangle"](112,96,16,16);for(var y=1;y<r.horizontalGridNum-1;++y){var b=o["Sprite"].from(v);b.position=new o["Point"](16*y,0),r.bgLayerContainer.addChild(b);var g=o["Sprite"].from(C);g.position=new o["Point"](16*y,16*r.verticalGridNum-16),r.bgLayerContainer.addChild(g)}var m=e.clone();m.frame=new o["Rectangle"](96,48,16,16);var w=o["Sprite"].from(m);w.position=new o["Point"](0,0),r.bgLayerContainer.addChild(w);var x=e.clone();x.frame=new o["Rectangle"](112,48,16,16);var k=o["Sprite"].from(x);k.position=new o["Point"](16*r.horizontalGridNum-16,0),r.bgLayerContainer.addChild(k);var M=e.clone();M.frame=new o["Rectangle"](96,80,16,16);var N=o["Sprite"].from(M);N.position=new o["Point"](0,16*r.verticalGridNum-16),r.bgLayerContainer.addChild(N);var G=e.clone();G.frame=new o["Rectangle"](112,80,16,16);var L=o["Sprite"].from(G);L.position=new o["Point"](16*r.horizontalGridNum-16,16*r.verticalGridNum-16),r.bgLayerContainer.addChild(L);var D=e.clone();D.frame=new o["Rectangle"](32,64,64,16);var R=o["Sprite"].from(D);R.position=new o["Point"](16*r.horizontalGridNum/2-32,18*r.verticalGridNum/2),r.bgLayerContainer.addChild(R);var j=e.clone();j.frame=new o["Rectangle"](32,0,64,64);var K=new o["Sprite"](j);K.position=new o["Point"](16*r.horizontalGridNum/2-32,18*r.verticalGridNum/2-64),K.zOrder=K.position.y+68,r.layerContainer.addChild(K);var P=e.clone();P.frame=new o["Rectangle"](32,64,64,16);var T=o["Sprite"].from(P);T.position=new o["Point"](14*r.horizontalGridNum/2-32,15*r.verticalGridNum/2),r.bgLayerContainer.addChild(T);var z=e.clone();z.frame=new o["Rectangle"](32,0,64,64);var U=new o["Sprite"](z);return U.position=new o["Point"](14*r.horizontalGridNum/2-32,15*r.verticalGridNum/2-64),U.zOrder=U.position.y+68,r.layerContainer.addChild(U),r.on("added",(function(){r.parent.addChild(r.fpsCounter)})),r}return Object(c["a"])(i,[{key:"addCharacter",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];this.characters.push(e),t&&(this.targetCharacter=e),this.layerContainer.addChildZ(e.bodySprite,1),this.layerContainer.addChildZ(e.shadowSprite,1),this.debugLayerContainer.addChild(e.debugCircle)}},{key:"update",value:function(){var e=this;this.characters.forEach((function(e){return e.preUpdate()})),this.characters.forEach((function(t){if(null!=t.preUpdateInfo){var i=[t.preUpdateInfo.moveX,t.preUpdateInfo.moveY],r=i[0],a=i[1];0==r&&0==a||!e.canMoveCharacter(t,r,a)||(t.x+=r,t.y+=a),t.currentDirection=t.preUpdateInfo.nextDirection,t.preUpdateInfo=null,t.update()}else t.update()}));var t=224,i=96,r=144,a=96;if(this.targetCharacter){var n=this.targetCharacter.x+this.x;n>t?this.x=-(this.targetCharacter.x-t):n<i&&(this.x=-(this.targetCharacter.x-i));var o=this.targetCharacter.y+this.y;o>r?this.y=-(this.targetCharacter.y-r):o<a&&(this.y=-(this.targetCharacter.y-a))}this.x=Math.floor(Math.min(0,Math.max(-(16*this.horizontalGridNum-320),this.x))),this.y=Math.floor(Math.min(0,Math.max(-(16*this.verticalGridNum-240),this.y))),this.layerContainer.sortChildren()}},{key:"canMoveCharacter",value:function(e,t,i){var r=e.hitCircle.clone();return r.x+=t,r.y+=i,this.characters.every((function(t){if(e===t)return!0;var i=[r.x,r.y,t.hitCircle.x,t.hitCircle.y],a=i[0],n=i[1],o=i[2],s=i[3];return Math.sqrt(Math.pow(o-a,2)+Math.pow(s-n,2))>r.radius+t.hitCircle.radius}))}},{key:"setDebugMode",value:function(e){this.debugLayerContainer.visible=e,this.fpsCounter.visible=e}}]),i}(o["Container"]),N=n["default"].extend({data:function(){return{pixiApp:null,field:null,pressedKeyCodeSet:new Set,isDebugMode:!1}},mounted:function(){var e=this;o["settings"].RESOLUTION=window.devicePixelRatio,o["settings"].SCALE_MODE=o["SCALE_MODES"].NEAREST,window.onkeydown=this.onKeyDown,window.onkeyup=this.onKeyUp;var t={width:320,height:240};this.pixiApp=new o["Application"](t);var i=this.$refs["pixi_area"];i.appendChild(this.pixiApp.view);var r=new o["Sprite"](o["Texture"].WHITE);r.width=320,r.height=240,r.tint=13421772,this.pixiApp.stage.addChild(r),o["utils"].clearTextureCache(),o["Loader"].shared.reset().add("/arpg-sample/images/stages/007/all.png").load((function(){var t=o["Loader"].shared.resources["/arpg-sample/images/stages/007/all.png"].texture;e.field=new M(t),e.pixiApp.stage.addChild(e.field);var i=new f(t,new o["Point"](0,256),new w(e.pressedKeyCodeSet));i.x=200,i.y=140,e.field.addCharacter(i,!0);var r=new f(t,new o["Point"](192,256),new x);r.x=100,r.y=120,e.field.addCharacter(r)})),this.pixiApp.ticker.add(this.update)},methods:{onKeyDown:function(e){this.pressedKeyCodeSet.add(e.keyCode)},onKeyUp:function(e){this.pressedKeyCodeSet["delete"](e.keyCode)},update:function(e){null!=this.field&&this.field.update()},onClickToggleDebugMode:function(){this.isDebugMode=!this.isDebugMode,this.field.setDebugMode(this.isDebugMode)}},beforeDestroy:function(){console.log("bdd"),this.pixiApp.destroy(!0)},components:{},computed:{},props:[]}),G=N,L=i("2877"),D=Object(L["a"])(G,r,a,!1,null,"8329b594",null);t["default"]=D.exports}}]);
//# sourceMappingURL=chunk-2d21ddda.b5fbeb4a.js.map