import HeroCard from './heroCard';

export default class User {
  private mId: string;
  get userId(): string {
    return this.mId;
  }
  set userId(v: string) {
    this.mId = v;
  }
  private mSelectCard: HeroCard[];
  get selectCard(): HeroCard[] {
    return this.mSelectCard;
  }
  set selectCard(v: HeroCard[]) {
    this.mSelectCard = v;
  }

  constructor() {
    this.mId = '';
    this.mSelectCard = [];
  }
}
