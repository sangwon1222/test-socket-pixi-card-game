import config from '@app/config';
import * as PIXI from 'pixijs';
import { gsap } from 'gsap';

const { width, height } = config.canvas;
const half = { x: width / 2, y: height / 2 };
const gap = 100;

export default class Loading extends PIXI.Container {
  private mLoadingDots: Array<PIXI.Graphics>;
  private mLoadingBg: PIXI.Graphics;
  private mTimeline: gsap.core.Timeline[];
  constructor() {
    super();
    this.mLoadingDots = [];
    this.mLoadingBg = new PIXI.Graphics();
    this.mLoadingBg.beginFill(0x0000, 1);
    this.mLoadingBg.drawRect(0, 0, width, height);
    this.mLoadingBg.endFill();
    this.addChild(this.mLoadingBg);
    this.mLoadingBg.alpha = 0;

    this.mTimeline = [];
  }

  async start() {
    let delay = 0;
    let index = 0;

    for (const dot of this.mLoadingDots) {
      this.mTimeline[index] = gsap.timeline();
      this.mTimeline[index].to(dot, { y: dot.y - gap, duration: 0.5 });
      this.mTimeline[index].to(dot, { x: dot.x - gap, duration: 0.5 });
      this.mTimeline[index].to(dot, { y: dot.y, duration: 0.5 });
      this.mTimeline[index].to(dot, { x: dot.x, duration: 0.5 });
      this.mTimeline[index].repeat(-1).delay(delay);
      delay += 0.5;
      index += 1;
    }
    gsap.to(this.mLoadingBg, { alpha: 0.8, duration: 0.5 });
    setTimeout(() => (this.mLoadingBg.alpha = 0.8), 500);
  }

  async end() {
    const { length } = this.mTimeline;
    for (let i = 0; i < length; i++) {
      if (this.mTimeline[i]) this.mTimeline[i].kill();
    }

    gsap.to(this.mLoadingBg, { alpha: 0, duration: 0.5, onComplete: () => (this.mLoadingBg.alpha = 0) });
  }

  async init() {
    const { length } = this.mTimeline;
    for (let i = 0; i < length; i++) {
      if (this.mTimeline[i]) this.mTimeline[i].kill();
    }
    const color = ['0x0BA8E0', '0x63FAB3', '0xB98EF0'];

    for (let i = 0; i < color.length; i++) {
      const dot = new PIXI.Graphics();
      dot.beginFill(+color[i], 1);
      dot.drawCircle(0, 0, 10);
      dot.endFill();

      dot.position.set(half.x - gap + i * gap, half.y);
      this.mLoadingDots.push(dot);
      this.addChild(dot);
    }
  }
}
