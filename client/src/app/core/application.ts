import * as PIXI from 'pixijs';
import SceneManager from '@core/sceneManager';
import ModalManager from '@core/modalManager';
import Scene from './scene';
import { TypeAppParms } from '@card/type';

export default class Application extends PIXI.Application {
  private static handle: Application;
  private mSceneManager: SceneManager;
  private mModalManager: ModalManager;

  static get getHandle(): Application {
    return Application.handle;
  }
  get getScene(): Scene {
    return this.mSceneManager.currentScene;
  }
  get getModalManager(): ModalManager {
    return this.mModalManager;
  }

  constructor({ width, height, backgroundColor, view }: TypeAppParms) {
    super({ width, height, backgroundColor, view });
    Application.handle = this;
    this.mSceneManager = new SceneManager();
    this.mModalManager = new ModalManager();
  }

  async init() {
    console.log(
      '%c LSW!!',
      'font-weight: bold; font-size: 50px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)'
    );
    this.stage.removeChildren();
    this.mSceneManager = new SceneManager();
    this.mModalManager = new ModalManager();
    this.stage.sortableChildren = true;
    this.mSceneManager.zIndex = 1;
    this.mModalManager.zIndex = 2;

    this.stage.addChild(this.mSceneManager, this.mModalManager);

    await this.mSceneManager.init();
    await this.mModalManager.init();
    await this.mSceneManager.start();

    document.addEventListener('visibilitychange', () => {
      const isHidden = document.hidden;
      // 다른 탭으로 전환했을 때,
      if (isHidden) this.onHiddenTab();
      // 다른 탭 보다가 돌아왔을 때,
      if (!isHidden) this.onViewTab();
    });
  }

  onHiddenTab() {
    //
  }
  onViewTab() {
    //
  }
}
