import * as PIXI from "pixi.js"

export class ChipSelectedInfo {
  constructor(
    public gridRect: PIXI.Rectangle,
    public chipIndexList: Array<number>
  ) {}
}

export class MapData {
  gridSizeX = 16
  gridSizeY = 16
  horizontalGridNum = 20
  verticalGridNum = 20
  layerChipsList: Array<Array<number | null>> = []
}

export class MapChipData {
  gridSizeX = 16
  gridSizeY = 16
  horizontalGridNum = 20
  verticalGridNum = 20
}
