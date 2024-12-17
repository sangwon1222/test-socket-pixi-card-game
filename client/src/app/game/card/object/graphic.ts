import * as PIXI from 'pixijs';

export default class Graphics extends PIXI.Container {
  private mGraphic: PIXI.Graphics;
  get graphic(): PIXI.Graphics {
    return this.mGraphic;
  }

  set tint(v: number) {
    this.mGraphic.tint = v;
  }

  constructor(
    width: number,
    height: number,
    color: number,
    alpha: number,
    pivot?: string,
    cursor?: string,
    interactive?: boolean,
    line?: boolean,
    lineColor?: number,
    lineStroke?: number
  ) {
    super();
    this.mGraphic = new PIXI.Graphics();
    this.mGraphic.beginFill(color, alpha);
    this.mGraphic.drawRect(0, 0, width, height);
    this.mGraphic.endFill();
    this.addChild(this.mGraphic);
    if (line) {
      const bgLine = new PIXI.Graphics();
      bgLine.lineStyle(lineStroke, lineColor);
      bgLine.drawRect(0, 0, width, height);
      this.addChild(bgLine);
    }
    if (cursor) this.cursor = cursor;
    if (interactive) this.interactive = interactive;
    if (pivot === 'center') this.pivot.set(this.width / 2, this.height / 2);
  }
}
