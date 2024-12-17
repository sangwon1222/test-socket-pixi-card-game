import * as PIXI from 'pixijs';
import { rscManager } from '@app/core/rscManager';
import CardGame from '@game/card/scene/cardGame';
import Application from '@app/core/application';
import { SocketIo } from '@game/card/socket';
import Intro from '@game/card/scene/intro';
import Scene from '@app/core/scene';
import { gsap } from 'gsap';
import config from '@app/config';
import { userStore } from '@store/user';

export default class CardScene extends Scene {
  private static handle: CardScene;
  private mSocket: SocketIo;
  private mScene: Scene[];
  private mSceneIdx = 0;
  private mCardDeck: { my: any[]; other: any[] } = { my: [], other: [] };

  static get getHandle(): CardScene {
    return CardScene.handle;
  }
  get sceneIdx(): number {
    return this.mSceneIdx;
  }
  get socket(): SocketIo {
    return this.mSocket;
  }

  get cardGameScene() {
    return this.mScene[this.mSceneIdx];
  }

  get cardDeck(): { my: any[]; other: any[] } {
    return this.mCardDeck;
  }
  set cardDeck(v: { my?: any[]; other?: any[] }) {
    if (v.my) this.mCardDeck.my = v.my;
    if (v.other) this.mCardDeck.other = v.other;
  }

  constructor(idx: number, sceneName: string) {
    super(idx, sceneName);
    CardScene.handle = this;
    this.useKeyboard = false;
    this.sortableChildren = true;
  }

  async init() {
    document.addEventListener('visibilitychange', () => {
      gsap.globalTimeline.resume();
    });

    this.mSceneIdx = 0;
    this.mScene = [new Intro(0, 'card-intro'), new CardGame(1, 'card-game')];
    this.mSocket = new SocketIo(this);
    await this.mSocket.init();
    this.mSocket.emit('welcome');
    await this.startGame();
  }

  async startGame() {
    this.removeChildren();
    this.addChild(this.mScene[this.sceneIdx]);
    await this.mScene[this.sceneIdx].init();
  }

  async nextGame() {
    userStore.isRoomNameShare = false;
    await Application.getHandle.getModalManager.loadingStart();
    this.mSceneIdx += 1;
    const nextScene = this.mScene[this.mSceneIdx] ?? this.mScene[0];
    this.removeChildren();
    this.addChild(nextScene);
    await nextScene.init();
    await Application.getHandle.getModalManager.loadingEnd();
  }
}
