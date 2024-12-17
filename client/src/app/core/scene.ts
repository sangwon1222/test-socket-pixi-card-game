import * as PIXI from 'pixijs';
import gsap from 'gsap';

export default class Scene extends PIXI.Container {
  private info: { idx: number; sceneName: string };
  private isUseKeyboard: boolean;

  get sceneInfo() {
    return this.info;
  }
  get useKeyboard() {
    return this.isUseKeyboard;
  }

  set useKeyboard(value: boolean) {
    this.isUseKeyboard = value;
  }

  constructor(idx: number, sceneName: string) {
    super();
    this.isUseKeyboard = false;
    this.info = { idx, sceneName };
  }

  /**@description scene을 상속받는 각 scene에서 호출*/
  async init() {
    //
  }

  /**@description scene을 상속받는 각 scene에서 호출*/
  async nextGame() {
    //
  }

  /**@description scene을 상속받는 각 scene에서 호출*/
  async startGame() {
    //
  }

  async endGame() {
    gsap.globalTimeline.clear();
    this.removeChildren();
  }

  async keyupEvent(e: KeyboardEvent) {
    //
  }

  async keydownEvent(e: KeyboardEvent) {
    //
  }
}
