import * as PIXI from 'pixijs';
import { ActionCardTimer } from '@card/object/actionCardTimer';
import { rscManager } from '@app/core/rscManager';
import ActionCard from '@card/object/actionCard';
import { TypeActionCardInfo } from '@card/type';
import { filter, findIndex } from 'lodash-es';
import ActionBar from '@card/object/actionBar';
import { SocketIo } from '@game/card/socket';
import config, { layout } from '@app/config';
import HeroCard from '@card/object/heroCard';
import Text from '@card/object/text';
import CardScene from '@card/scene';
import Scene from '@app/core/scene';
import { gsap } from 'gsap';
import { userStore } from '@store/user';
const { canvas } = config;

export default class CardGame extends Scene {
  private mActionBar: ActionBar;
  private mCardDeck: HeroCard[];
  private mEnemyDeck: HeroCard[];
  private mActionCard: ActionCard[];
  private mActionCardTimer: ActionCardTimer;
  private mSocket: SocketIo;
  private mSelectActionCard: ActionCard;
  private mSelectHeroCard: HeroCard;
  private mIsActiveAttack: boolean;
  private mLogText: Text[];

  get socket(): SocketIo {
    return this.mSocket;
  }
  get actionBar(): ActionBar {
    return this.mActionBar;
  }
  get isSelectActionCard(): boolean {
    return Boolean(this.mSelectActionCard);
  }
  get isSelectHeroCard(): boolean {
    return Boolean(this.mSelectHeroCard);
  }

  get currentACP(): number {
    return this.mActionBar.acpCount;
  }

  get isChargeActionCard(): boolean {
    return this.actionCardLength > 0;
  }
  get actionCardLength(): number {
    const needActionCard = filter(this.mActionCard, (e) => e === null);
    return needActionCard.length;
  }

  constructor(idx: number, sceneName: string) {
    super(idx, sceneName);
    this.sortableChildren = true;
    this.mIsActiveAttack = false;

    this.mActionCard = [];
    this.mSelectActionCard = null;
    this.mSelectHeroCard = null;
    this.mLogText = [];

    const bgSprite = new PIXI.Sprite(rscManager.getHandle.getRsc('bg-1.png'));
    this.addChild(bgSprite);
  }

  async init() {
    this.mSocket = (this.parent as CardScene).socket;

    await this.createActionPointBar();
    this.mCardDeck = [];
    this.mEnemyDeck = [];
    await this.createDeck('my');
    await this.createDeck('other');

    this.mSocket.emit('get-action-card');

    const test = new Text('카드 버리기', 0x000000, 24, 0xffffff, 'center', 'pointer', true);
    test.position.set(canvas.width - 100, canvas.height - 24);
    test.on('pointerdown', async () => {
      if (this.mSelectActionCard) {
        this.removeChild(this.mSelectActionCard);
        this.mActionCard[this.mSelectActionCard.idx] = null;
        this.mSelectActionCard = null;
      } else {
        this.log('액션 카드를 선택해 주세요.');
      }
    });

    this.mActionCardTimer = new ActionCardTimer();
    await this.mActionCardTimer.init();
    this.mActionCardTimer.position.set(canvas.width - 260, canvas.height - 24);
    this.addChild(test, this.mActionCardTimer);

    await this.startGame();

    this.sortChildren();
  }

  async getActionCard(card: TypeActionCardInfo[]) {
    for (let i = 0; i < 5; i++) {
      const { element, attack, defence, heal, actionPoint } = card[i];
      await this.createActionCard({ idx: i, element, attack, defence, heal, actionPoint });
    }
  }

  async createActionCard({ idx, element, attack, defence, heal, actionPoint }: TypeActionCardInfo) {
    if (idx > 4) return;
    const { x, y } = { x: layout.actionCard.x[idx], y: layout.actionCard.y[idx] };
    const actionCard = new ActionCard(idx, element, attack, defence, heal, actionPoint, x, y);
    this.addChild(actionCard);
    await actionCard.init();
    actionCard.zIndex = 3;
    actionCard.interactive = true;
    actionCard.on('pointerenter', () => (actionCard.zIndex = 6));
    actionCard.on('pointerleave', () => (actionCard.zIndex = 3));
    actionCard.position.set(x, y);
    this.mActionCard[idx] = actionCard;
  }

  async createActionPointBar() {
    this.mActionBar = new ActionBar();
    await this.mActionBar.init();
    this.mActionBar.position.set(0, canvas.height - this.mActionBar.height);
    this.mActionBar.zIndex = 2;

    this.addChild(this.mActionBar);
  }

  async createDeck(who: 'my' | 'other') {
    const itsMine = who === 'my';
    const deck = (this.parent as CardScene).cardDeck;
    const cardInfo = itsMine ? deck.my : deck.other;
    const cardY = itsMine ? layout.heroCard.mineY : layout.heroCard.anemyY;

    for (let i = 0; i < 5; i++) {
      const { element, hp, attack, defence } = cardInfo[i];

      const card = new HeroCard(i, element, hp, attack, defence, itsMine, layout.heroCard.x[i], cardY[i]);
      await card.init();
      card.zIndex = 2;
      card.interactive = true;
      card.on('pointerenter', () => (card.zIndex = 6));
      card.on('pointerleave', () => (card.zIndex = 2));

      card.position.set(canvas.width / 2, canvas.height / 2);

      gsap.to(card, { x: layout.heroCard.x[i], y: cardY[i], duration: 0.25 });

      const targetAry = itsMine ? 'mCardDeck' : 'mEnemyDeck';
      this[targetAry].push(card);
      this.addChild(card);
    }
  }

  // ACP
  async updateAcp(userAcp: number) {
    const { length } = this.mActionCard;
    for (let i = 0; i < length; i++) {
      if (!this.mActionCard[i]) continue;
      if (userAcp >= this.mActionCard[i].property.acp) {
        await this.mActionCard[i].setAble();
      } else {
        await this.mActionCard[i].resetAble();
      }
    }
  }

  // ACTION CARD //
  async selectActionCard(idx: number) {
    const card = this.mActionCard[idx];
    this.mSelectActionCard = card.selected ? null : card;
    this.mSelectHeroCard = null;

    for (const card of this.mActionCard) if (card) card.selected = false;
    for (const card of this.mCardDeck) card.selected = false;
    for (const card of this.mEnemyDeck) card.selected = false;

    if (this.mSelectActionCard) card.selected = true;
  }

  async addActionCard(cardInfo: TypeActionCardInfo) {
    const { element, attack, defence, heal, actionPoint } = cardInfo;
    const idx = findIndex(this.mActionCard, (e) => e === null);

    if (idx >= 0 && idx <= 4) await this.createActionCard({ idx, element, attack, defence, heal, actionPoint });
  }

  // HERO CARD
  async selectHeroCard(idx: number) {
    for (const card of this.mCardDeck) card.selected = false;
    if (!this.mSelectActionCard) {
      this.log('액션 카드를 선택해 주세요.');
      return;
    }

    const { name } = this.mSelectActionCard.property;
    if (['heal', 'defence'].includes(name)) await this.useDefenceCard(name as 'defence' | 'heal', idx);

    const card = this.mCardDeck[idx];
    this.mSelectHeroCard = card.selected ? null : card;
    if (this.mSelectHeroCard) card.selected = true;
  }

  async selectEnemyCard(enemyCardIdx: number) {
    if (this.mIsActiveAttack) return;

    if (!this.mSelectActionCard) {
      this.log('액션 카드를 선택해 주세요.');
      return;
    }
    if (!this.mSelectHeroCard) {
      this.log('나의 영웅 카드를 선택해 주세요.');
      return;
    }
    if (this.mSelectActionCard.property.acp > this.mActionBar.acpCount) {
      this.log('ACP가 부족합니다.');
      return;
    }
    const { name } = this.mSelectActionCard.property;
    if (name !== 'attack') return;

    this.mIsActiveAttack = true;
    // await this.attack(enemyCardIdx);
    const enemy = this.mEnemyDeck[enemyCardIdx];
    const heroCardIdx = this.mSelectHeroCard.idx;
    const { attack } = this.mCardDeck[heroCardIdx].property;
    this.mSocket.emit('attack-card', {
      socketId: userStore.socketId,
      idx: enemy.idx,
      attack: +Math.ceil(attack),
      enemyIdx: heroCardIdx,
    });
    this.mIsActiveAttack = false;
    const actionCardIdx = this.mSelectActionCard.idx;
    this.removeChild(this.mActionCard[actionCardIdx]);
    this.mActionCard[actionCardIdx] = null;
    await this.resetSelected();
  }

  async resetSelected() {
    this.mSelectActionCard = null;
    this.mSelectHeroCard = null;
    for (const card of this.mActionCard) if (card) card.selected = false;
    for (const card of this.mCardDeck) card.selected = false;
    for (const card of this.mEnemyDeck) card.selected = false;

    if (this.actionCardLength === 1) this.mActionCardTimer.timer.restart();
  }

  async useDefenceCard(type: 'heal' | 'defence', heroCardIdx: number) {
    const { acp, value } = this.mSelectActionCard.property;
    if (acp > this.mActionBar.acpCount) return;

    this.mActionBar.decreasePoint(acp);
    this.removeChild(this.mActionCard[this.mSelectActionCard.idx]);
    this.mActionCard[this.mSelectActionCard.idx] = null;
    if (type === 'heal') this.mCardDeck[heroCardIdx].hp += value;
    if (type === 'defence') this.mCardDeck[heroCardIdx].df += value;
    this.mSocket.emit(`use-${type}-card`, { idx: heroCardIdx, value: value });
    await this.resetSelected();
  }

  broadCastHeal({ idx, value }: { idx: number; value: number }) {
    this.mEnemyDeck[idx].hp += value;
  }
  broadCastDefence({ idx, value }: { idx: number; value: number }) {
    this.mEnemyDeck[idx].df += value;
  }

  setDamage({ socketId, idx, attack, enemyIdx }: { socketId: string; idx: number; attack: number; enemyIdx: number }) {
    const targetDeck = socketId == userStore.socketId ? this.mEnemyDeck : this.mCardDeck;
    const attackDeck = socketId == userStore.socketId ? this.mCardDeck : this.mEnemyDeck;

    attackDeck[enemyIdx].zIndex = 3;
    const backUpX = attackDeck[enemyIdx].x;
    const backUpY = attackDeck[enemyIdx].y;
    gsap
      .to(attackDeck[enemyIdx], {
        x: targetDeck[idx].x,
        y: targetDeck[idx].y,
        duration: 0.15,
        onComplete: () => {
          attackDeck[enemyIdx].position.set(backUpX, backUpY);
        },
      })
      .yoyo(true)
      .repeat(1);
    targetDeck[idx].setDamage(attack);
  }

  log(logContent: string) {
    const { length } = this.mLogText;
    if (length > 5) {
      const rest = this.mLogText.splice(0, length - 4);
      for (const r of rest) {
        gsap.killTweensOf(r);
        this.removeChild(r);
      }
    }
    const text = new Text(logContent, 0xffffff, 48, 0x000000, 'center', '', false, 2);
    this.mLogText.push(text);
    text.position.set(canvas.width / 2, 200);
    text.zIndex = 6 + this.mLogText.indexOf(text);
    this.addChild(text);
    gsap.to(text, { y: -48, duration: 3, onComplete: () => this.removeChild(text) });
    gsap.to(text, { alpha: 0, duration: 1 }).delay(2);
  }
}
