import * as PIXI from 'pixijs';

export default class Text extends PIXI.Container {
  private mBg: PIXI.Graphics;
  private mText: PIXI.Text;
  get style() {
    return this.mText.style;
  }
  get pixiText() {
    return this.mText;
  }
  get text() {
    return this.mText.text;
  }
  set text(v: number | string) {
    this.mText.text = `${v}`;
    if (this.mBg) this.mBg.width = this.mText.width;
  }

  constructor(
    text: string | number,
    color: number,
    fontSize: number,
    bgColor?: number,
    pivot?: string,
    cursor?: string,
    interactive?: boolean,
    strokeThickness?: number
  ) {
    super();
    this.sortableChildren = true;
    this.mText = new PIXI.Text(text, { fill: 0xffffff, fontSize });
    this.mText.tint = color;
    this.mText.zIndex = 2;
    this.addChild(this.mText);

    if (bgColor) {
      this.mBg = new PIXI.Graphics();
      this.mBg.beginFill(bgColor, 1);
      this.mBg.drawRect(0, 0, this.width, this.height);
      this.mBg.endFill();
      this.mBg.zIndex = 1;
      this.addChild(this.mBg);
    }
    if (strokeThickness) this.mText.style.strokeThickness = strokeThickness;
    if (cursor) this.cursor = cursor;
    if (interactive) this.interactive = interactive;
    if (pivot === 'center') this.pivot.set(this.width / 2, this.height / 2);
  }
}
