import * as PIXI from 'pixijs';
import Loading from '@core/loading';

export default class ModalManager extends PIXI.Container {
  private mLoading: Loading;
  constructor() {
    super();
    this.mLoading = new Loading();
    this.addChild(this.mLoading);
  }

  async init() {
    await this.mLoading.init();
    this.addChild(this.mLoading);
    this.mLoading.visible = false;
  }

  async loadingStart() {
    this.mLoading.visible = true;
    await this.mLoading.start();
  }

  async loadingEnd() {
    await this.mLoading.end();
    this.mLoading.visible = false;
  }
}
