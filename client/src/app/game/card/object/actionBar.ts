import * as PIXI from 'pixijs';
import Graphics from '@game/card/object/graphic';
import CardGame from '@card/scene/cardGame';
import config from '@app/config';
import { gsap } from 'gsap';

const { acp } = config;
const { ableColor, disableColor, barColor, lineColor, waitBar, pointWidth, pointCount, pointgap, duration } = acp;

export default class ActionBar extends PIXI.Container {
  private mBg: PIXI.Container;
  private mActionPtAry: ActionPoint[];
  private mActionPtCount: number;
  private mActionPtTimer: gsap.core.Timeline;
  private mWaitMotion: any;

  get acpCount() {
    return this.mActionPtCount;
  }

  private set setActionPoint(v: number) {
    const parent = this.parent as CardGame;
    if (v > 0) {
      this.mActionPtCount = v;
      this.mActionPtAry[this.mActionPtCount - 1].able = true;
    } else {
      this.mActionPtCount = 0;
    }
    parent.updateAcp(this.mActionPtCount);
  }

  constructor() {
    super();
    this.sortableChildren = true;

    this.mActionPtAry = [];
    this.mActionPtCount = 0;
    this.mActionPtTimer = null;
  }

  async init() {
    this.mBg = new Graphics(pointWidth * pointCount + pointgap * (pointCount + 1), pointWidth * 1.4, barColor, 1);
    this.mBg.zIndex = 1;
    this.mBg.y = waitBar.size.h;
    this.addChild(this.mBg);

    await this.createPoint();
    await this.createWaitBar();
    this.chargePoint();
  }

  createWaitBar() {
    return new Promise((resolve, _reject) => {
      const stroke = 2;
      const waitMotionBg = new PIXI.Graphics();
      waitMotionBg.beginFill(barColor, 1);
      waitMotionBg.lineStyle(stroke, lineColor, 1);
      waitMotionBg.drawRect(0, 0, waitBar.size.w + stroke * 2, waitBar.size.h);
      waitMotionBg.endFill();
      waitMotionBg.position.set(0, 0);

      this.mWaitMotion = new PIXI.Graphics();
      this.mWaitMotion.beginFill(ableColor, 1);
      this.mWaitMotion.drawRect(0, 0, 1, waitBar.size.h - stroke * 2);
      this.mWaitMotion.endFill();
      this.mWaitMotion.position.set(0 + stroke, 2);

      this.addChild(waitMotionBg, this.mWaitMotion);
      resolve(1);
    });
  }

  createPoint() {
    return new Promise((resolve, _reject) => {
      let x = pointgap + pointWidth / 2;
      for (let i = 0; i < pointCount; i++) {
        const actionPoint = new ActionPoint();
        actionPoint.position.set(x, this.mBg.height / 2);
        x += pointWidth + pointgap;

        this.mActionPtAry.push(actionPoint);
        this.mBg.addChild(actionPoint);

        resolve(1);
      }
    });
  }

  chargePoint() {
    if (this.mActionPtCount >= 10) {
      this.mActionPtTimer?.pause();
      return;
    }

    if (this.mActionPtTimer && this.mActionPtCount < 10) {
      this.mActionPtTimer.restart();
    } else {
      this.mActionPtTimer = gsap.timeline();
    }

    this.mActionPtTimer.to(this.mWaitMotion, {
      width: waitBar.size.w,
      duration,
      ease: 'none',
      onComplete: () => {
        this.mWaitMotion.width = 0;
        this.increasePoint();
      },
    });
  }

  increasePoint() {
    if (this.mActionPtCount >= pointCount) {
      this.setActionPoint = pointCount;
    } else {
      this.setActionPoint = this.mActionPtCount + 1;
    }
    this.chargePoint();
  }

  decreasePoint(count: number) {
    this.mActionPtTimer.pause();
    const cnt = this.mActionPtCount - count;

    if (this.mActionPtCount <= 0) {
      this.setActionPoint = 0;
    } else {
      for (let i = 0; i < pointCount; i++) {
        this.mActionPtAry[i].able = i < cnt;
      }
      this.setActionPoint = cnt;
    }
    this.chargePoint();
  }
}

class ActionPoint extends PIXI.Container {
  private mIsAble: boolean;
  private mPoint: PIXI.Graphics;

  get isAble() {
    return this.mIsAble;
  }

  set able(v: boolean) {
    const scale = v ? 1 : 0;
    gsap.to(this.mPoint.scale, { x: scale, y: scale, duration: 0.25 });
    this.mIsAble = v;
  }

  constructor() {
    super();

    this.mIsAble = false;
    const bg = new PIXI.Graphics();
    bg.lineStyle(2, disableColor, 1);
    bg.drawCircle(0, 0, pointWidth / 2);

    this.mPoint = new PIXI.Graphics();
    this.mPoint.beginFill(ableColor, 1);
    this.mPoint.drawCircle(0, 0, pointWidth / 2 - 4);
    this.mPoint.endFill();
    this.mPoint.scale.set(0, 0);

    this.addChild(bg, this.mPoint);
  }
}
