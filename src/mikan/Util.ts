import { FilterType, StageOptions } from "./StageScene"

const stageNumToDifficurityRange = (stageNum: number): [number, number] => {
  if (stageNum <= 5) {
    return [4, 5]
  } else if (stageNum <= 7) {
    return [6, 7]
  } else if (stageNum <= 9) {
    return [8, 9]
  } else if (stageNum <= 11) {
    return [10, 11]
  } else if (stageNum <= 13) {
    return [6, 8]
  } else if (stageNum <= 15) {
    return [9, 12]
  } else if (stageNum <= 17) {
    return [13, 15]
  } else if (stageNum <= 19) {
    return [16, 17]
  } else {
    return [18, 100]
  }
}

const calcDifficarity = (stageOptions: StageOptions): number => {
  let difficarity = 0
  // みかんの数による判定
  difficarity += (stageOptions.mikanNum - 3) * 2
  // 色の幅よる判定
  if (stageOptions.startH != null && stageOptions.endH != null) {
    const diff = stageOptions.endH - stageOptions.startH
    if (diff <= 40) {
      difficarity += 1
    } else if (diff <= 30) {
      difficarity += 2
    } else if (diff <= 20) {
      difficarity += 3
    }
  }
  if (stageOptions.startS != null && stageOptions.endS != null) {
    const diff = Math.abs(stageOptions.endS - stageOptions.startS)
    if (diff <= 0.7) {
      difficarity += 3
    } else if (diff <= 0.5) {
      difficarity += 5
    } else if (diff <= 0.3) {
      difficarity += 7
    }
  }
  if (stageOptions.startB != null && stageOptions.endB != null) {
    const diff = Math.abs(stageOptions.endB - stageOptions.startB)
    if (diff <= 0.6) {
      difficarity += 2
    } else if (diff <= 0.4) {
      difficarity += 4
    } else if (diff <= 0.2) {
      difficarity += 6
    }
  }
  if (stageOptions.filterTypes != null) {
    const filterTypeSet = new Set(stageOptions.filterTypes)
    if (filterTypeSet.has('crt')) {
      difficarity += 2
    }
    if (filterTypeSet.has('noise')) {
      difficarity += 4
    }
    if (filterTypeSet.has('blur')) {
      difficarity += 4
    }
    if (filterTypeSet.has('refrection')) {
      difficarity += 5
    }
    if (filterTypeSet.has('spotlight')) {
      difficarity += 6
    }
  }

  return difficarity
}

const generateHRange = () => {
  let distance = 0
  switch (Math.floor(Math.random() * 4)) {
    case 0:
      distance = 50
      break;
    case 1:
      distance = 40
      break;
    case 2:
      distance = 30
      break;
    case 3:
      distance = 20
      break;
  }
  // 始点をランダムでずらす
  let additional = 0
  if (Math.random() < 0.5) {
    // 範囲が80～110, 270～300に被る場合は再計算
    for (;;) {
      additional = Math.floor(Math.random() * 300)
      let ng50_110 = false
      let ng270_300 = false
      if ((additional >= 50 && additional <= 110) || ((additional + distance) >= 50 && (additional + distance) <= 110)) {
        ng50_110 = true
      }
      if ((additional >= 270 && additional <= 300) || ((additional + distance) >= 270 && (additional + distance) <= 300)) {
        ng270_300 = true
      }
      // 見づらい範囲には入っていない
      if (!ng50_110 && !ng270_300) {
        break
      }
    }
  }
  return [0 + additional, distance + additional]
}

const generateSRange = (): [number, number] => {
  switch (Math.floor(Math.random() * 4)) {
    case 0:
      return [0, -0.9]
    case 1:
      return [0, -0.7]
    case 2:
      return [-0.1, -0.6]
    case 3:
      return [-0.2, -0.5]
  }
  throw new Error()
}

const generateBRange = (): [number, number] => {
  switch (Math.floor(Math.random() * 4)) {
    case 0:
      return [0.5, 1.5]
    case 1:
      return [0.7, 1.3]
    case 2:
      return [0.8, 1.2]
    case 3:
      return [0.9, 1.1]
  }
  throw new Error()
}

const generateRandomStageOptions = (): StageOptions => {
  const mikanNum = 4 + Math.floor(Math.random() * 4)
  let startH = undefined
  let endH = undefined
  let startS = undefined
  let endS = undefined
  let startB = undefined
  let endB = undefined
  if (Math.random() < 0.7) {
    [startH, endH] = generateHRange()
  }
  if (Math.random() < 0.4) {
    [startS, endS] = generateSRange()
  }
  if (Math.random() < 0.3) {
    [startB, endB] = generateBRange()
  }
  // なにも設定されない場合はHを設定
  if (startH == null && startS == null && startB == null) {
    [startH, endH] = generateHRange()
  }
  const filterTypes: Array<FilterType> = []
  if (Math.random() < 0.2) {
    filterTypes.push('crt')
  }
  if (Math.random() < 0.2) {
    filterTypes.push('noise')
  }
  if (Math.random() < 0.2) {
    filterTypes.push('blur')
  }
  if (Math.random() < 0.2) {
    filterTypes.push('refrection')
  }
  if (Math.random() < 0.2) {
    filterTypes.push('spotlight')
  }
  return {
    mikanNum,
    startH,
    endH,
    startS,
    endS,
    startB,
    endB,
    filterTypes
  }
}

const autoGenerate = (stageNum: number): StageOptions => {
  const diffcurityRange = stageNumToDifficurityRange(stageNum)
  for (let i = 0; i < 1000; ++i) {
    const stageOptions = generateRandomStageOptions()
    const difficarity = calcDifficarity(stageOptions)
    console.log(`difficality = ${difficarity}`)
    if (diffcurityRange[0] <= difficarity && difficarity <= diffcurityRange[1]) {
      return stageOptions
    }
  }
  throw new Error()
}

export const generateStageOptions: (stageNum: number) => StageOptions = (stageNum: number) => {
  // ステージ0から4は固定
  if (stageNum === 0) {
    return {
      mikanNum: 4,
      startH: 0,
      endH: 40
      // filterTypes: ['spotlight', 'crt']
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
  return autoGenerate(stageNum)
}