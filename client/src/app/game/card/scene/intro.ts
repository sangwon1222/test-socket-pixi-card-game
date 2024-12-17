import * as PIXI from 'pixijs';
import HeroCard from '@app/game/card/object/heroCard';
import Graphics from '@game/card/object/graphic';
import Application from '@app/core/application';
import config, { layout } from '@app/config';
import Text from '@game/card/object/text';
import Scene from '@app/core/scene';
import CardScene from '../scene';
import { map } from 'lodash-es';
import { gsap } from 'gsap';
import { cardStore } from '@store/editCard';
import { userStore } from '@store/user';
import { rscManager } from '@app/core/rscManager';

const { canvas } = config;

export default class Intro extends Scene {
  private mBg: PIXI.Container;
  private mListCard: HeroCard[];
  private mRoomBtns: PIXI.Container[];

  constructor(idx: number, sceneName: string) {
    super(idx, sceneName);
    this.sortableChildren = true;

    this.mListCard = [];
    this.mRoomBtns = [];

    this.removeChildren();
    this.mBg = new PIXI.Container();
    this.mBg.zIndex = 1;
    this.mBg.interactive = true;
    this.mBg.sortableChildren = true;
    this.addChild(this.mBg);
  }

  async init() {
    this.mBg.removeChildren();
    await this.createBg();
    await this.createBtn();
    await this.createCardDeck();
  }

  async createBg() {
    const bgSprite = new PIXI.Sprite(rscManager.getHandle.getRsc('bg-1.png'));
    this.addChild(bgSprite);
  }

  async createBtn() {
    const parent = this.parent as CardScene;
    const app = document.getElementById('app') as HTMLDivElement;
    const { cards } = cardStore;
    const btnList = [
      {
        mode: 'make-room',
        label: '방 만들기',
        fc: () => {
          if (app.requestFullscreen()) app.requestFullscreen();
          parent.socket.emit('make-room', { cardDeck: cards });
        },
      },
      {
        mode: 'search-room',
        label: '방 찾기',
        fc: () => {
          if (app.requestFullscreen()) app.requestFullscreen();
          userStore.isRoomNameInput = true;
        },
      },
    ];
    const { length } = btnList;
    for (let i = 0; i < length; i++) {
      const btn = new Graphics(180, 80, 0x000000, 1, 'center', 'pointer', true);
      btn.zIndex = 2;
      const layout = Math.floor(canvas.width / (length + 1));
      btn.position.set(layout * (i + 1), canvas.height - 80);

      const label = new Text(btnList[i].label, 0xffffff, 24, 0x000000, 'center');
      label.position.set(btn.width / 2, btn.height / 2);
      this.mRoomBtns.push(btn);

      btn.addChild(label);
      this.mBg.addChild(btn);

      btn.on('pointerdown', async () => btnList[i].fc());
    }
  }

  async createCardDeck() {
    this.mListCard = [];
    const parent = this.parent as CardScene;
    const { cards } = cardStore;
    parent.cardDeck.my = cards;

    for (let i = 0; i < 5; i++) {
      const { element, hp, attack, defence } = cards[i];

      const x = layout.heroCard.x[i];
      const y = canvas.height / 2;
      const card = new HeroCard(i, element, hp, attack, defence, false, x, y);
      await card.init();
      card.position.set(x, y);

      this.mListCard.push(card);
      this.mBg.addChild(card);
    }
  }

  async makeRoom(): Promise<void> {
    map(this.mRoomBtns, (e) => (e.visible = false));
    userStore.isRoomNameShare = true;
  }

  startLoading() {
    Application.getHandle.getModalManager.loadingStart();
  }
}
