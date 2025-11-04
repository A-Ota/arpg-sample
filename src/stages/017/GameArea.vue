<style scoped lang="scss">
</style>
<template>
  <div style="position: relative;">
    <div style="width: 640px; height: 480px;" ref="pixiArea">
    </div>
    <div v-if="true" style="position: absolute; left: 4px; top: 4px; color: #fff;">{{ (1000 / fpsCounter.averageMs).toFixed(2) }} fps</div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, reactive, onUnmounted } from '@vue/composition-api'
import * as PIXI from "pixi.js"
import { Character, PlayerRoutine, UroUroRoutine, TextureInfo } from '@/stages/014/Character'
import { Field } from '@/stages/014/Field'
import InputManager from '../014/InputManager'

class FpsCounter {
  private ms = 0
  private counter = 0
  public averageMs = 0
  constructor(private oldNow = performance.now()) {}
  public checkPoint() {
    const now = performance.now()
    this.ms += (now - this.oldNow)
    this.oldNow = now
    ++this.counter
    if (this.counter >= 60) {
      this.averageMs = this.ms / this.counter
      this.counter = 0
      this.ms = 0
    }
  }
}

export default defineComponent({
  setup (props: any, context: any) {
    // refs - テンプレートで使用するもののみreactive
    const pixiArea = ref<HTMLElement | null>(null)
    const fpsCounter = reactive(new FpsCounter())
    
    // 通常の変数 - テンプレートで使用しないためリアクティブ不要
    let pixiApp: PIXI.Application | null = null
    let renderTexture: PIXI.RenderTexture | null = null
    let field: Field | null = null
    const inputManager = (window as any).inputManager as InputManager
    let characters: Array<Character> = []
    let isDebugMode = false

    const onClickToggleDebugMode = () => {
      isDebugMode = !isDebugMode
      if (field) {
        field.setDebugMode(isDebugMode)
      }
    }

    const isFocusedCharacter = (character: Character) => {
      return field?.targetCharacter === character
    }

    const onClickCharacterCell = (character: Character) => {
      field?.setTargetCharacter(character)
    }

    const onClickDeleteCharacter = (character: Character) => {
      characters = characters.filter(v => v !== character)
      field?.removeCharacter(character)
    }

    const generateCharacter = (type: number) => {
      let textureOffset: PIXI.Point | null = null
      let [width, height, directionNum] = [0, 0, 0]
      switch(type) {
        case 0:
        case 1:
          width = 32
          height = 64
          directionNum = 8
          break;
        case 2:
        case 3:
        case 4:
          width = 32
          height = 32
          directionNum = 1
          break;
      }
      switch(type) {
        case 0:
          textureOffset = new PIXI.Point(256, 0)
          break;
        case 1:
          textureOffset = new PIXI.Point(256 + 192, 0)
          break;
        case 2:
          textureOffset = new PIXI.Point(256 + 192 * 2, 0)
          break;
        case 3:
          textureOffset = new PIXI.Point(256 + 192 * 2, 32)
          break;
        case 4:
          textureOffset = new PIXI.Point(256 + 192 * 2, 64)
          break;
      }

      if (!renderTexture || !textureOffset || !field) return
      const character = new Character(new TextureInfo(renderTexture as PIXI.Texture, textureOffset, width, height, directionNum))
      character.routine = (type === 0) ? new PlayerRoutine(inputManager) : new UroUroRoutine()
      character.currentDirection = 4
      for(;;) {
        character.x = 32 + 16 * Math.floor(Math.random() * ((field as Field).horizontalGridNum - 4))
        character.y = 32 + 16 * Math.floor(Math.random() * ((field as Field).verticalGridNum - 4))
        ;(field as Field).addCharacter(character, false)
        const [hit] = (field as Field).hitWall(character, 0, 0)
        if (!hit) {
          break;
        } else {
          (field as Field).removeCharacter(character)
          console.log(hit)
        }
      }
      characters.push(character)
      ;(character as any).type = type
    }

    const toggleCharacter = () => {
      if (!field) return
      let index = 0
      characters.forEach((v, i) => {
        if (v === (field as Field).targetCharacter) {
          index = i
        }
      })
      const nextIndex = (index + 1) % characters.length
      const oldCharacter = characters[index]
      const newCharacter = characters[nextIndex]
      oldCharacter.routine = new UroUroRoutine()
      newCharacter.routine = new PlayerRoutine(inputManager)
      ;(field as Field).setTargetCharacter(newCharacter as any)
    }

    const update = () => {
      fpsCounter.checkPoint()
      // Spaceキーでキャラ切り替え
      if (inputManager.isReleased(32)) {
        toggleCharacter()
      }
      // 1キーでデバッグ表示切り替え
      if (inputManager.isReleased(49)) {
        onClickToggleDebugMode()
      }
      // DELキーでキャラ削除
      if (inputManager.isReleased(46)) {
        if (field?.targetCharacter) {
          characters = characters.filter(character => character !== (field as Field).targetCharacter)
          ;(field as Field).removeCharacter((field as Field).targetCharacter as any)
          if (characters.length > 0) {
            toggleCharacter()
          }
        }
      }
      if (field != null) {
        (field as Field).update()
      }
    }

    onMounted(() => {
      PIXI.settings.RESOLUTION = window.devicePixelRatio
      PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

      const opt = { 
        width: 640,
        height: 480,
        autoDensity: true
      }
      pixiApp = new PIXI.Application(opt)
      const container = pixiArea.value
      if (container) {
        container.appendChild(pixiApp.view)
      }

      // 背景色
      const bg = new PIXI.Sprite(PIXI.Texture.WHITE)
      bg.width = 320
      bg.height = 240
      bg.tint = 0xcccccc
      pixiApp.stage.addChild(bg)

      PIXI.utils.clearTextureCache()
      PIXI.Loader.shared
        .reset()
        .add("/arpg-sample/images/stages/014/chara01.png")
        .add("/arpg-sample/images/stages/014/chara02.png")
        .add("/arpg-sample/images/stages/014/slime-blue.png")
        .add("/arpg-sample/images/stages/014/slime-red.png")
        .add("/arpg-sample/images/stages/014/slime-yellow.png")
        .add("/arpg-sample/images/stages/013/mapchip.png")
        .add("/arpg-sample/images/stages/013/mapchip.json")
        .add("/arpg-sample/images/stages/013/map01.json")
        .load(() => {

          // RenderTextureに必要な画像すべてを描き込む
          renderTexture = PIXI.RenderTexture.create({ width: 1024, height: 1024 })

          // mapchipを描き込む
          const spriteMapChip = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/013/mapchip.png"].texture)
          if (pixiApp && renderTexture) {
            pixiApp.renderer.render(spriteMapChip, renderTexture as any, false)
            // chara01を書き込む
            const sprite01 = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/014/chara01.png"].texture)
            sprite01.position.set(256, 0)
            pixiApp.renderer.render(sprite01, renderTexture as any, false)
            // chara02を書き込む
            const sprite02 = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/014/chara02.png"].texture)
            sprite02.position.set(256 + 192, 0)
            pixiApp.renderer.render(sprite02, renderTexture as any, false)
            // slimeを書き込む
            const sprite03 = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/014/slime-blue.png"].texture)
            sprite03.position.set(256 + 192 * 2, 0)
            pixiApp.renderer.render(sprite03, renderTexture as any, false)

            const sprite04 = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/014/slime-red.png"].texture)
            sprite04.position.set(256 + 192 * 2, 32)
            pixiApp.renderer.render(sprite04, renderTexture as any, false)

            const sprite05 = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/014/slime-yellow.png"].texture)
            sprite05.position.set(256 + 192 * 2, 64)
            pixiApp.renderer.render(sprite05, renderTexture as any, false)

            // フィールド
            field = new Field(
              renderTexture as any,
              PIXI.Loader.shared.resources["/arpg-sample/images/stages/013/mapchip.json"].data,
              PIXI.Loader.shared.resources["/arpg-sample/images/stages/013/map01.json"].data)
            pixiApp.stage.addChild(field as any)

            // NPC
            generateCharacter(0)
            generateCharacter(1)
            generateCharacter(2)
            generateCharacter(3)
            generateCharacter(4)
            if (field && characters[0]) {
              (field as Field).setTargetCharacter(characters[0] as any)
            }
          }
        })

      // メインループ
      // PIXI.Ticker.shared.add(update)
      addEventListener('update', update)
      setTimeout(() => {
        context.emit('onEvent', {
          type: 'message',
          messages: [
            'これはメッセージウィンドウのサンプルです!\nクリックして次のメッセージに進みます。',
            'Vue.jsのComposition APIを使って実装しています。\nスタイルも少し変更しました。',
            'ゲーム画面の下部に表示されるようになっています。\nこれでメッセージウィンドウの完成です！'
          ]
        })
      }, 3000)
    })
    onUnmounted(() => {
      // PIXI.Ticker.shared.remove(update)
      removeEventListener('update', update)
    })

    onBeforeUnmount(() => {
      if (pixiApp) {
        pixiApp.destroy(true)
      }
    })

    return {
      pixiArea,
      fpsCounter,
      // methods
      onClickToggleDebugMode,
      isFocusedCharacter,
      onClickCharacterCell,
      onClickDeleteCharacter,
      generateCharacter,
      toggleCharacter
    }
  }
})
</script>
