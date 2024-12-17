import * as PIXI from 'pixijs';
import { TypeActionCardParams } from '@card/type';
import { rscManager } from '@app/core/rscManager';
import CardGame from '@card/scene/cardGame';
import config, { ac_num, layout } from '@app/config';
import { gsap } from 'gsap';
import { map } from 'lodash-es';
import { util } from '../util';
const { actionCard, cardColor, canvas } = config;

export default class ActionCard extends PIXI.Container {
  private mProperty: TypeActionCardParams;
  private mIdx: number;
  private mCardBg: PIXI.Sprite;
  private mAcpBg: PIXI.Sprite;
  private mPropertyContainer: PIXI.Container;
  private mNumbers: { property: PIXI.Sprite[]; acp: PIXI.Sprite[] };
  private mSelected: boolean;
  private mRawPos: Readonly<{ x: number; y: number }>;
  private mLine: PIXI.Graphics;

  get property(): { name: string; value: number; acp: number; element: string } {
    const { property, propertyValue, actionPoint, element } = this.mProperty;
    return { name: property, value: propertyValue, acp: actionPoint, element };
  }

  get idx(): number {
    return this.mIdx;
  }

  get selected() {
    return this.mSelected;
  }
  set selected(v: boolean) {
    this.mSelected = v;
    if (v) {
      this.mLine.alpha = 1;
    } else {
      this.mLine.alpha = 0;
    }
  }

  constructor(idx: number, element: string, attack: number, defence: number, heal: number, actionPoint: number, x, y) {
    super();
    this.mIdx = idx;
    this.mProperty = { element, attack, defence, heal, actionPoint, property: '', propertyValue: 0 };
    if (attack) this.mProperty.property = 'attack';
    if (defence) this.mProperty.property = 'defence';
    if (heal) this.mProperty.property = 'heal';
    this.mProperty.propertyValue = this.mProperty[this.mProperty.property];
    this.mNumbers = { property: [], acp: [] };
    this.mRawPos = { x, y };

    this.mCardBg = new PIXI.Sprite(rscManager.getHandle.getRsc(`ac_${element}.png`));
    this.mCardBg.anchor.set(0.5);
    this.mCardBg.position.set(this.mCardBg.width / 2, this.mCardBg.height / 2);
    this.mCardBg.tint = 0xbcbcbc;
    this.addChild(this.mCardBg);

    this.mLine = new PIXI.Graphics();
    this.mLine.lineStyle({ width: 2, color: 0xff0000, alpha: 1 });
    this.mLine.drawRect(0, 0, this.width, this.height);
    this.mLine.alpha = 0;
    this.addChild(this.mLine);

    this.sortableChildren = true;
  }

  async init() {
    const parent = this.parent as CardGame;
    const { actionPoint } = this.mProperty;
    await this.createBase();

    this.hitArea = new PIXI.Rectangle(0, 0, actionCard.size.w, actionCard.size.h);
    this.cursor = 'pointer';
    this.interactive = true;
    this.pivot.set(this.width / 2, this.height / 2);

    if (parent.currentACP >= actionPoint) this.setAble();
    this.on('pointerdown', async () => await this.onPointerDown());
    this.on('pointerenter', async () => await this.onPointerEnter());
    this.on('pointerleave', async () => await this.onPointerLeave());
    this.on('pointerup', async () => await this.onPointerLeave());
  }

  async createBase() {
    const { actionPoint, propertyValue } = this.mProperty;

    this.mAcpBg = new PIXI.Sprite(rscManager.getHandle.getRsc('ac_acp_bg.png'));
    this.mAcpBg.anchor.set(0.5);
    this.mAcpBg.position.set(
      this.mCardBg.width / 2 - this.mAcpBg.width / 2,
      -this.mCardBg.height / 2 + this.mAcpBg.height / 2
    );

    this.mPropertyContainer = new PIXI.Container();
    this.mPropertyContainer.y = 20;

    this.mCardBg.addChild(this.mAcpBg, this.mPropertyContainer);

    await this.setActionPoint(actionPoint);
    await this.setPropertyPoint(propertyValue);
  }

  async setActionPoint(actionPoint: number) {
    this.mNumbers.acp = [];
    this.mAcpBg.removeChildren();

    const { layout, numAry } = util.setSpriteNumber(actionPoint, false);
    this.mNumbers.acp = numAry;
    this.mAcpBg.addChild(layout);
  }

  async setPropertyPoint(PropertyPoint: number) {
    this.mNumbers.property = [];
    this.mPropertyContainer.removeChildren();

    const { layout, numAry } = util.setSpriteNumber(PropertyPoint, true);
    this.mNumbers.property = numAry;
    this.mPropertyContainer.addChild(layout);
  }

  async setAble() {
    this.mCardBg.tint = 0xffffff;
    map(this.mNumbers.acp, (e) => (e.tint = 0xffffff));
    map(this.mNumbers.property, (e) => (e.tint = 0xffffff));
  }

  async resetAble() {
    this.mCardBg.tint = 0xbcbcbc;
    map(this.mNumbers.acp, (e) => (e.tint = 0xbcbcbc));
    map(this.mNumbers.property, (e) => (e.tint = 0xbcbcbc));
  }

  async onPointerDown() {
    const parent = this.parent as CardGame;
    if (!parent?.selectActionCard) return;

    const { actionPoint } = this.mProperty;

    if (parent.currentACP < actionPoint) {
      parent.log('ACP가 부족합니다.');
      this.selected = false;
    }
    await parent.selectActionCard(this.mIdx);
  }

  async onPointerEnter() {
    if (this.mSelected) return;
    const scale = 2;
    const duration = 0.05;
    const { x, y } = this.mRawPos;

    const isOverWidth = x + (this.width * scale) / 2 > canvas.width;
    const isOverHeight = y + (this.height * scale) / 2 > canvas.height;
    const isUnderWidth = x - (this.width * scale) / 2 < 0;
    const isUnderHeight = y - (this.height * scale) / 2 < 0;

    if (isOverWidth) this.mCardBg.x += (canvas.width - (x + this.width * scale)) / 2;
    if (isUnderWidth) this.mCardBg.x += (this.width * scale) / 2 - x;

    if (isOverHeight) this.mCardBg.y += (canvas.height - (y + this.height * scale)) / 2;
    if (isUnderHeight) this.mCardBg.y += (this.height * scale) / 2;

    this.mCardBg.scale.set(scale);
  }

  async onPointerLeave() {
    if (this.mSelected) return;
    this.mCardBg.scale.set(1);
    this.mCardBg.position.set(this.mCardBg.width / 2, this.mCardBg.height / 2);
  }
}
