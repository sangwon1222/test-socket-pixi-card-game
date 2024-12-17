import { gsap } from 'gsap';
import * as PIXI from 'pixijs';
import CardGame from '@card/scene/cardGame';

export class ActionCardTimer extends PIXI.Container {
  private mTimer: any;
  private mBar: PIXI.Graphics;

  get timer(): gsap.core.Timeline {
    return this.mTimer;
  }
  constructor() {
    super();
    this.mTimer = null;
  }
  async init() {
    const wrap = new PIXI.Graphics();
    wrap.beginFill(0xffffff, 1);
    wrap.lineStyle(2, 0x000000, 1);
    wrap.drawRect(0, 0, 120, 40);
    wrap.endFill();
    this.addChild(wrap);
    this.pivot.set(this.width / 2, this.height / 2);

    this.mBar = new PIXI.Graphics();
    this.mBar.beginFill(0xbcbcbc, 1);
    this.mBar.drawRect(0, 0, 1, 30);
    this.mBar.endFill();
    this.mBar.position.set(5, 5);
    this.addChild(this.mBar);

    this.mTimer = gsap.to(this.mBar, {
      width: 110,
      duration: 3,
      ease: 'none',
      onStart: () => {
        const parent = this.parent as CardGame;
        const alphaValue = parent.actionCardLength === 0 ? 0 : 1;
        this.alpha = alphaValue;
      },
      onComplete: () => {
        const parent = this.parent as CardGame;
        if (parent.isChargeActionCard) parent.socket.emit('get-one-action-card');
        this.mTimer.restart();
      },
    });
  }
}
