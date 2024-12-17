import { TypeDefaultObject, TypeSrcInfo } from '@app/game/card/type';
import Application from './application';
import * as PIXI from 'pixijs';
import config from '@app/config';
const { devLink } = config;

export class rscManager {
  private static handle: rscManager;
  private mRscObject: TypeDefaultObject;

  static get getHandle(): rscManager {
    const handle = rscManager.handle ? rscManager.handle : new rscManager();
    return handle;
  }

  get getRscList() {
    return this.mRscObject;
  }

  constructor() {
    rscManager.handle = this;
    this.mRscObject = {};
  }

  /**
   * @param src 리소스
   * @param common 여러 씬에서 공동으로 쓰일 경우 true, 아니면 안넣어줘도 된다.
   */
  public async loadRsc(src: string, sceneName?: string) {
    if (this.mRscObject[`${src}`]) return;
    PIXI.Assets.add(`${src}`, src);
    const link = devLink;
    this.mRscObject[`${src}`] = await PIXI.Assets.load(`${link}/rsc/img/cardgame/${src}`);
  }

  /**
   * @description 배열로 리소스 리스트를 보내주면 모든 리소스 로드하는 함수
   */
  public async loadAllRsc(rscInfoAry: TypeSrcInfo) {
    const sceneName = Application.getHandle.getScene?.sceneInfo?.sceneName;
    const isProduct = process.env.NODE_ENV === 'production';
    for (const src of rscInfoAry.img) {
      await this.loadRsc(src, sceneName);
    }
  }

  /**
   * @param srcKey 리소스 이름 ex) bomb.png, bomb.gif
   * @param common 공동으로 쓰이고 있으면 true, 없으면 안넣어줘도 된다.
   * @returns
   */
  public getRsc(srcKey: string, common?: boolean) {
    const key = common ? `common/${srcKey}` : `${srcKey}`;
    return this.mRscObject[key];
  }
}
