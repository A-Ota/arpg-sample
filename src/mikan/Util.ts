import { StageOptions } from "./StageScene"
export const generateStageOptions: (stageNum: number) => StageOptions = (stageNum: number) => {
  // ステージ0から4は固定
  if (stageNum === 0) {
    return {
      mikanNum: 4,
      startH: 0,
      endH: 40
    }
  }
  else if (stageNum === 1) {
    return {
      mikanNum: 5,
      startH: 0,
      endH: 40
    }
  }
  else if (stageNum === 2) {
    return {
      mikanNum: 4,
      startS: 0,
      endS: -0.9
    }
  }
  else if (stageNum === 3) {
    return {
      mikanNum: 4,
      startH: 0,
      endH: 40,
      filterTypes: ['crt']
    }
  }
  return {
    mikanNum: 6,
    startH: 0,
    endH: 40
  }
}