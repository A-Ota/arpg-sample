<style scoped lang="scss">
</style>
<template>
  <div style="position: relative;">
    <div style="position: absolute; width: 320px; height: 240px;" ref="pixi_area"></div>
    <div
      style="position: absolute; left: 10px; top: 10px; background-color: #0000ff66; color: #fff;"
    >矢印キーで移動</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as PIXI from "pixi.js";

// キャラクター
class Character extends PIXI.Container {
  private body!: PIXI.Sprite;
  private shadow!: PIXI.Graphics;
  private animationFrame = 0;
  private _currentDirection = 2;
  set currentDirection(value: number) {
    this._currentDirection = value;
    this.syncTexture();
  }
  get currentDirection() {
    return this._currentDirection;
  }
  private animationStep = 0;
  constructor(private sheet: PIXI.Spritesheet, private routine: BaseRoutine) {
    super();

    routine.character = this
    // 本体
    this.body = new PIXI.Sprite(sheet.textures[`character-2-0`]);
    this.body.anchor.set(0.5, 0.5);
    this.addChild(this.body);

    // 影
    this.shadow = new PIXI.Graphics();
    this.shadow.lineStyle(0); // lineStyleを0にすると枠線が描画されません。
    this.shadow.beginFill(0x000000, 1);
    this.shadow.drawEllipse(0, 28, 16, 10);
    this.shadow.endFill();
    this.shadow.alpha = 0.5;
    this.addChildAt(this.shadow, 0);
  }
  private syncTexture() {
    this.body.texture = this.sheet.textures[
      `character-${this.currentDirection}-${
        this.animationStep === 3 ? 1 : this.animationStep
      }`
    ];
  }
  public update() {
    this.routine.update()
    ++this.animationFrame;
    if (this.animationFrame > 30) {
      this.animationFrame = 0;
      this.animationStep = (this.animationStep + 1) % 4;
      this.syncTexture();
    }
  }
}

// ルーチン
abstract class BaseRoutine {
  public character!: Character
  abstract update(): void;
}

const KEY_CODE_LEFT = 37;
const KEY_CODE_UP = 38;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_DOWN = 40;

// 方向とスピードからx,yの移動速度算出
const calcMoveXY = function(direction: number, speed: number): [number, number] {
  const slantSpeed = speed * 0.7
  switch (direction) {
    case 1:
      return [-slantSpeed, slantSpeed]
    case 2:
      return [0, speed]
    case 3:
      return [slantSpeed, slantSpeed]
    case 4:
      return [-speed, 0]
    case 6:
      return [speed, 0]
    case 7:
      return [-slantSpeed, -slantSpeed]
    case 8:
      return [0, -speed]
    case 9:
      return [slantSpeed, -slantSpeed]
  }
  return [0, 0]
}

// プレイヤー操作用ルーチン
class PlayerRoutine extends BaseRoutine {
  constructor(private pressedKeyCodeSet: Set<number>) {
    super()
  }

  public update() {
    let direction: number | null = null 
    // 向き取得
    if (this.pressedKeyCodeSet.has(KEY_CODE_LEFT)) {
      if (this.pressedKeyCodeSet.has(KEY_CODE_DOWN)) {
        direction = 1;
      } else if (this.pressedKeyCodeSet.has(KEY_CODE_UP)) {
        direction = 7;
      } else {
        direction = 4;
      }
    } else if (this.pressedKeyCodeSet.has(KEY_CODE_RIGHT)) {
      if (this.pressedKeyCodeSet.has(KEY_CODE_DOWN)) {
        direction = 3;
      } else if (this.pressedKeyCodeSet.has(KEY_CODE_UP)) {
        direction = 9;
      } else {
        direction = 6;
      }
    } else if (this.pressedKeyCodeSet.has(KEY_CODE_UP)) {
      direction = 8;
    } else if (this.pressedKeyCodeSet.has(KEY_CODE_DOWN)) {
      direction = 2;
    }
    // 向かせたり歩かせたり
    if (direction != null) {
      this.character.currentDirection = direction
      const [moveX, moveY] = calcMoveXY(this.character.currentDirection, 1)
      this.character.position.x += moveX
      this.character.position.y += moveY
    }
  }
}

// うろうろルーチン
class UroUroRoutine extends BaseRoutine {
  constructor(
    private isMoving = false,
    private frameCountToWait: number = 0,
    private frameCountToMove: number = 60) {
    super()
  }
  update() {
    // 移動中
    if (this.isMoving) {
      const [moveX, moveY] = calcMoveXY(this.character.currentDirection, 0.6)
      this.character.position.x += moveX
      this.character.position.y += moveY
      --this.frameCountToWait
      if (this.frameCountToWait <= 0) {
        this.frameCountToWait = 0
        this.frameCountToMove = 60 + 30 * Math.floor(Math.random() * 3)
        this.isMoving = false
      }
    }
    // 待機中
    else {
      --this.frameCountToMove
      if (this.frameCountToMove <= 0) {
        this.frameCountToMove = 0
        this.frameCountToWait = 60
        this.character.currentDirection = [1, 2, 3, 4, 6, 7, 8, 9][Math.floor(Math.random() * 8)]
        this.isMoving = true
      }
    }
  }
}

export default Vue.extend({
  data(): { characters: Array<Character>; pressedKeyCodeSet: Set<number> } {
    return {
      characters: [],
      pressedKeyCodeSet: new Set()
    };
  },
  mounted() {
    PIXI.settings.RESOLUTION = window.devicePixelRatio;
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    window.onkeydown = this.onKeyDown;
    window.onkeyup = this.onKeyUp;

    const size = { width: 320, height: 240 };
    const pixiApp: PIXI.Application = new PIXI.Application(size);

    const container = this.$refs["pixi_area"] as any;
    container.appendChild(pixiApp.view);

    // 背景色
    const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
    bg.width = 320;
    bg.height = 240;
    bg.tint = 0xcccccc;
    pixiApp.stage.addChild(bg);

    PIXI.Loader.shared
      .reset()
      .add("/arpg-sample/images/chara01.json")
      .add("/arpg-sample/images/chara02.json")
      .load(() => {
        // プレイヤー
        const chara1 = new Character(
          PIXI.Loader.shared.resources["/arpg-sample/images/chara01.json"].spritesheet!,
          new PlayerRoutine(this.pressedKeyCodeSet)
        );
        chara1.position.set(180, 110);
        pixiApp.stage.addChild(chara1);
        this.characters.push(chara1);
        // NPC
        const chara2 = new Character(
          PIXI.Loader.shared.resources["/arpg-sample/images/chara02.json"].spritesheet!,
          new UroUroRoutine()
        );
        chara2.position.set(140, 90);
        pixiApp.stage.addChild(chara2);
        this.characters.push(chara2);
      });

    // アニメーション開始
    pixiApp.ticker.add(delta => {
      this.characters.forEach(chara => chara.update());
    });
  },
  methods: {
    onKeyDown(event: KeyboardEvent) {
      this.pressedKeyCodeSet.add(event.keyCode);
    },
    onKeyUp(event: any) {
      this.pressedKeyCodeSet.delete(event.keyCode);
    }
  },
  components: {},
  computed: {},
  props: []
});
</script>