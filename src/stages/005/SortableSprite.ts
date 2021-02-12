import * as PIXI from "pixi.js"
import { ISortable } from '@/stages/005/SortableParticleContainer'

export class SortableSprite extends PIXI.Sprite implements ISortable {
  zOrder: number = 0
}