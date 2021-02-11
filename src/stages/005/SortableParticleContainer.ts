import * as PIXI from "pixi.js"

const INF = 1e+100;

const tmpChanged: Array<any> = []
const tmpOld: Array<any> = []
let tmpArrivalCounter = 0;

function awesomeCompare(a: any, b: any) {
  if (a.zOrder > b.zOrder) return 1;
  if (a.zOrder < b.zOrder) return -1;
  if (a.arrivalOrder > b.arrivalOrder) return 1;
  if (a.arrivalOrder < b.arrivalOrder) return -1;
  return 0;
}

export interface ISortable {
  zOrder: number
}

export class SortableParticleContainer extends PIXI.ParticleContainer {
  public addChildZ(child: any, zOrder: number) {
    child.zOrder = zOrder || 0;
    
    // assign those vars whenever new element joins
    
    child.oldZOrder = INF;
    child.arrivalOrder = ++tmpArrivalCounter;
    
    super.addChild(child);
  }
  
  // you can call it every tick - its not heavy
  
  public sortChildren() {
    const children = this.children;
    
    let len = children.length;
    for (let i = 0; i < len; i++) {
      const elem = children[i] as any
     
      if (elem.zOrder !== elem.oldZOrder) {
        tmpChanged.push(elem);
      } else {
        tmpOld.push(elem);
      }
      elem.oldZOrder = elem.zOrder;
    }
    
    if (tmpChanged.length === 0) {
      tmpOld.length = 0;
      return;
    }
    if (tmpChanged.length > 1) {
      tmpChanged.sort(awesomeCompare);
    }
    
    let j = 0, a = 0, b = 0;
    while (a < tmpChanged.length && b < tmpOld.length) {
      if (awesomeCompare(tmpChanged[a], tmpOld[b]) < 0) {
        children[j++] = tmpChanged[a++];
      } else {
        children[j++] = tmpOld[b++];
      }
    }
    while (a < tmpChanged.length) {
      children[j++] = tmpChanged[a++];
    }
    while (b < tmpOld.length) {
      children[j++] = tmpOld[b++];
    }
    
    tmpChanged.length = 0;
    tmpOld.length = 0;
  }
}