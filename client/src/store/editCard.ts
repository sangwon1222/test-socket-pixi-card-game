import { reactive } from 'vue';
const { cardElement } = config;
import config from '@app/config';

interface TypeParam {
  cards: { [key: string]: any }[];
}

const initCard = Array(5)
  .fill(null)
  .map((_v, _i) => {
    return {
      element: cardElement[Math.floor(Math.random() * 5)],
      attack: Math.ceil(Math.random() * 10),
      defence: Math.ceil(Math.random() * 10),
      hp: 10 + Math.ceil(Math.random() * 10),
    };
  });

export const cardStore: TypeParam = reactive({
  cards: initCard,
});
