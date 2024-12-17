import * as PIXI from 'pixijs';
import { TypeHeroCardParams } from '@card/type';
import Graphics from '@card/object/graphic';
import CardGame from '@card/scene/cardGame';
import Text from '@card/object/text';
import config, { ac_num } from '@app/config';
import { gsap } from 'gsap';
import { rscManager } from '@app/core/rscManager';
import { util } from '../util';

const { heroCard, acp, cardColor, canvas } = config;

export default class HeroCard extends PIXI.Container {
  private mIdx: number;
  private mProperty: TypeHeroCardParams;
  private mAttackContaicer: PIXI.Sprite;
  private mDefenceContaicer: PIXI.Sprite;
  private mCardBg: PIXI.Sprite;
  private mLine: PIXI.Graphics;
  private mSelected: boolean;
  private mCardValues: { hp: number; attack: number; defence: number };
  private mCardValuesInput: { hp: PIXI.Text; attack: Text; defence: Text };
  private mFullHp: number;
  private mFullDf: number;
  private mHpGraphicWrap: PIXI.Container;
  private mHpGraphic: Graphics;
  private mRawPos: { x: number; y: number };
  private mIsDeath: boolean;

  get idx(): number {
    return this.mIdx;
  }

  get hp(): number {
    return this.mCardValues.hp;
  }
  set hp(v: number) {
    if (this.mIsDeath) return;
    const clacValue = `${v}`.includes('.') ? +v.toFixed(2) : v;
    const value = clacValue >= this.mFullHp ? this.mFullHp : clacValue;

    if (value >= this.mFullHp) {
      this.mCardValues.hp = this.mFullHp;
      this.mCardValuesInput.hp.text = this.mFullHp;
    }

    if (value <= 0) {
      this.death();
    } else {
      const hpRate = Math.floor((this.mHpGraphicWrap.width - 16) * (value / this.mFullHp));
      const hpWidth = hpRate <= 0 ? 0 : hpRate;

      gsap.to(this.mHpGraphic, {
        width: hpWidth,
        duration: 0.25,
        onComplete: () => {
          this.mCardValues.hp = value;
          this.mCardValuesInput.hp.text = value;
        },
      });
      setTimeout(() => {
        this.mCardValues.hp = value;
        this.mCardValuesInput.hp.text = value;
      }, 250);
    }

    const { hp } = this.mCardValuesInput;
    this.mCardValuesInput.hp.pivot.set(hp.width / 2, hp.height / 2);
  }

  get df(): number {
    return this.mCardValues.defence;
  }
  set df(v: number) {
    if (this.mIsDeath) return;

    this.mDefenceContaicer.removeChildren();
    if (v < 0) this.mDefenceContaicer.alpha = 0;
    else {
      this.mCardValues.defence = v;
      const { layout } = util.setSpriteNumber(v, false);
      layout.position.set(layout.width / 2, this.mDefenceContaicer.height - layout.height / 2);
      this.mDefenceContaicer.addChild(layout);
      gsap.to(this.mDefenceContaicer.scale, {
        x: 1.2,
        y: 1.2,
        duration: 0.25,
        repeat: 3,
        ease: 'bounce',
        onComplete: () => gsap.to(this.mDefenceContaicer.scale, { x: 1, y: 1, duration: 0.25 }),
      });
    }
  }

  get itsMine() {
    return this.mProperty.itsMine;
  }

  get property() {
    return this.mProperty;
  }

  get selected() {
    return this.mSelected;
  }
  set selected(v: boolean) {
    const parent = this.parent as CardGame;
    const isNotSelectActionCard = this.itsMine && !parent.isSelectActionCard;
    const isNotSelectMyHero = !this.itsMine && !parent.isSelectHeroCard;

    if (isNotSelectActionCard || isNotSelectMyHero) {
      this.mSelected = false;
    } else {
      this.mSelected = v;
    }

    this.mLine.alpha = Number(v);
  }

  constructor(idx: number, element: string, hp: number, attack: number, defence: number, itsMine: boolean, x, y) {
    super();
    this.mRawPos = { x, y };
    this.mIdx = idx;
    this.mCardValues = { hp, attack, defence };
    this.mCardValuesInput = { hp: null, attack: null, defence: null };
    this.mProperty = { element, hp, attack, defence, itsMine };
    this.sortableChildren = true;

    this.mIsDeath = false;
    this.mSelected = false;
    this.mFullHp = hp;
    this.mFullDf = defence;

    this.mCardBg = new PIXI.Sprite(rscManager.getHandle.getRsc('proto-character.png'));
    this.mCardBg.anchor.set(0.5);
    this.mCardBg.position.set(this.mCardBg.width / 2, this.mCardBg.height / 2);
    this.mCardBg.zIndex = 1;
    this.addChild(this.mCardBg);

    this.mLine = new PIXI.Graphics();
    this.mLine.lineStyle({ width: 2, color: 0xff0000, alpha: 1 });
    this.mLine.drawRect(0, 0, this.width, this.height);
    this.mLine.alpha = 0;
    this.addChild(this.mLine);

    this.mAttackContaicer = new PIXI.Sprite(rscManager.getHandle.getRsc(`small_ac_${element}.png`));
    this.mAttackContaicer.position.set(0, 0);
    this.mAttackContaicer.zIndex = 2;

    this.mDefenceContaicer = new PIXI.Sprite(rscManager.getHandle.getRsc(`small_ac_defence.png`));
    this.mDefenceContaicer.position.set(this.mCardBg.width - this.mDefenceContaicer.width, 0);
    this.mDefenceContaicer.zIndex = 2;

    this.mHpGraphicWrap = new PIXI.Container();
    this.mHpGraphicWrap.sortableChildren = true;
    this.mHpGraphicWrap.zIndex = 2;

    this.addChild(this.mAttackContaicer, this.mDefenceContaicer, this.mHpGraphicWrap);
  }

  setDamage(damage: number) {
    if (this.df <= 0) {
      this.df = 0;
      this.hp -= damage;
    } else {
      this.df = this.df - damage <= 0 ? 0 : this.df - damage;
    }

    console.groupCollapsed('HP , Defence', `${this.mIdx}번째 카드`);
    console.log(`HP: [ ${this.hp} / ${this.mFullHp} ]`);
    console.log(`DF: [ ${this.df} / ${this.mFullDf} ]`);
    console.log(`데미지: [ ${damage} ]`);
    console.groupEnd();
  }

  async init() {
    this.mAttackContaicer.removeChildren();
    this.mDefenceContaicer.removeChildren();
    await this.createAttack();
    await this.createDefence();
    await this.createHp();

    const area = new PIXI.Rectangle(0, -30, this.width, this.height);
    this.hitArea = area;
    this.cursor = 'pointer';
    this.interactive = true;
    this.on('pointerdown', async (e: PIXI.FederatedPointerEvent) => await this.onPointerDown(e));
    this.on('pointerenter', async (e: PIXI.FederatedPointerEvent) => await this.onPointerEnter(e));
    this.on('pointerleave', async (e: PIXI.FederatedPointerEvent) => await this.onPointerLeave(e));
    this.on('pointerup', async (e: PIXI.FederatedPointerEvent) => await this.onPointerLeave(e));

    this.pivot.set(this.width / 2, this.height / 2);
  }

  async createAttack() {
    const point = this.mCardValues['attack'];

    const { layout } = util.setSpriteNumber(point, false);
    layout.position.set(layout.width / 2, this.mAttackContaicer.height - layout.height / 2);
    this.mAttackContaicer.addChild(layout);
  }

  async createDefence() {
    const point = this.mCardValues['defence'];

    const { layout } = util.setSpriteNumber(point, false);
    layout.position.set(layout.width / 2, this.mDefenceContaicer.height - layout.height / 2);
    this.mDefenceContaicer.addChild(layout);
  }

  async createHp() {
    const { element, hp } = this.mProperty;

    this.mHpGraphic = new Graphics(this.width - 20, 10, cardColor[element], 1, 'none');
    this.mHpGraphic.position.set(-this.mHpGraphic.width / 2, -this.mHpGraphic.height / 2);
    this.mHpGraphic.zIndex = 1;

    this.mCardValuesInput.hp = new PIXI.Text(hp, {
      fill: 0xffffff,
      stroke: 0x000000,
      strokeThickness: 8,
    });
    this.mCardValuesInput.hp.anchor.set(0.5);
    this.mCardValuesInput.hp.zIndex = 2;

    const outLine = new PIXI.Graphics();
    outLine.lineStyle(4, 0xffffff, 1);
    outLine.drawRect(
      -this.mHpGraphic.width / 2,
      -this.mHpGraphic.height / 2,
      this.mHpGraphic.width,
      this.mHpGraphic.height
    );
    outLine.zIndex = 1;
    outLine.addChild(this.mCardValuesInput.hp);

    this.mHpGraphicWrap.position.set(0, this.mCardBg.height / 2);
    this.mHpGraphicWrap.addChild(this.mHpGraphic, outLine);
    this.mCardBg.addChild(this.mHpGraphicWrap);
  }

  async onPointerDown(e: PIXI.FederatedPointerEvent) {
    e.defaultPrevented = true;

    if (this.mIsDeath) return;

    const parent = this.parent as CardGame;
    const fcName = this.itsMine ? 'selectHeroCard' : 'selectEnemyCard';
    if (parent[fcName]) parent[fcName](this.mIdx);
  }

  async onPointerEnter(e: PIXI.FederatedPointerEvent) {
    e.defaultPrevented = true;
    e.bubbles = false;
    this.zIndex = 4;
    if (this.mIsDeath) return;

    const scale = 2;
    const duration = 0.05;
    const { x, y } = this.mRawPos;

    const isOverWidth = x + (this.width * scale) / 2 > canvas.width;
    const isOverHeight = y + (this.height * scale) / 2 > canvas.height;
    const isUnderWidth = x - (this.width * scale) / 2 < 0;
    const isUnderHeight = y - (this.height * scale) / 2 < 0;

    if (isOverWidth) this.x += (canvas.width - (x + this.width * scale)) / 2;
    if (isUnderWidth) this.x += this.mCardBg.width - x;

    if (isOverHeight) this.y += (canvas.height - (y + this.mCardBg.height)) / 2;
    if (isUnderHeight) this.y += this.mCardBg.height / 2;

    gsap.to(this.scale, { x: scale, y: scale, duration });
  }

  async onPointerLeave(e: PIXI.FederatedPointerEvent) {
    e.defaultPrevented = true;
    e.bubbles = false;

    this.zIndex = 2;
    if (this.mIsDeath) return;

    const { x, y } = this.mRawPos;
    const duration = 0.05;
    gsap.to(this.scale, {
      x: 1,
      y: 1,
      duration,
      onComplete: () => {
        this.scale.set(1);
        this.position.set(x, y);
      },
    });
  }

  async death() {
    gsap.killTweensOf(this.mCardBg);
    this.interactive = false;
    this.visible = false;
    this.mIsDeath = true;
  }
}
