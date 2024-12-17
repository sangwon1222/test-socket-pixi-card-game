import * as PIXI from 'pixijs';
import Scene from '@core/scene';
import Application from '@core/application';
import CardScene from '@game/card/scene';
import { rscManager } from './rscManager';
import rsc from '@game/card/resource.json';

export default class SceneManager extends PIXI.Container {
  private sceneAry: Array<Scene>;
  private sceneIdx: number;

  get currentScene() {
    return this.sceneAry[this.sceneIdx];
  }

  get currentSceneInfo() {
    return this.sceneAry[this.sceneIdx].sceneInfo;
  }

  constructor() {
    super();

    this.sceneAry = [];
    this.sceneIdx = 0;
  }

  async init() {
    this.sceneIdx = 0;
    this.sceneAry = [];
    this.sceneAry.push(new CardScene(0, 'card'));
  }

  async start() {
    try {
      await rscManager.getHandle.loadAllRsc(rsc.common);
      await rscManager.getHandle.loadAllRsc(rsc.card);
    } catch (e) {
      console.log(e);
      location.replace(location.origin);
    }
    await this.changeScene('card');
  }

  async changeScene(goSceneName: string) {
    this.removeChildren();
    await this.sceneAry[this.sceneIdx]?.endGame();
    await Application.getHandle.getModalManager.loadingStart();
    for (let i = 0; i < this.sceneAry.length; i++) {
      const { sceneName } = this.sceneAry[i].sceneInfo;
      if (goSceneName === sceneName) {
        this.addChild(this.sceneAry[i]);
        await this.sceneAry[i].init();
        await Application.getHandle.getModalManager.loadingEnd();
        break;
      }
    }
  }
}
