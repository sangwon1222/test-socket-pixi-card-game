import { TypeConfig } from '@card/type';

export const config: Readonly<TypeConfig> = {
  cardElement: ['fire', 'water', 'wind', 'electric', 'plant'],
  cardColor: { fire: 0xfa0700, water: 0x0400fa, wind: 0x4af7ff, electric: 0xf4f110, plant: 0x00f470 },
  canvas: {
    bg: 0x000000,
    width: 1280,
    height: 800,
  },
  acp: {
    pointWidth: 30,
    pointCount: 10,
    pointgap: 4,
    duration: 1,
    lineColor: 0x122533,
    barColor: 0xbcbcbc,
    ableColor: 0x0a3e76,
    disableColor: 0x122533,
    waitBar: {
      size: { w: 60, h: 10 },
    },
  },
  devLink: location.origin,
  elementType: {
    fire: {
      week: ['water'],
      strong: ['plant', 'wind'],
      normal: ['fire', 'electric'],
    },
    water: {
      week: ['plant'],
      strong: ['fire', 'electric'],
      normal: ['water', 'wind'],
    },
    wind: {
      week: ['fire'],
      strong: ['plant', 'electric'],
      normal: ['water', 'wind'],
    },
    electric: {
      week: ['water'],
      strong: ['wind', 'plant'],
      normal: ['electric', 'fire'],
    },
    plant: {
      week: ['water'],
      strong: ['fire', 'wind'],
      normal: ['electric', 'plant'],
    },
  },
  heroCard: {
    size: { w: 160, h: 200 },
    gap: 40,
    iconSize: { w: 80, h: 80 },
  },
  actionCard: {
    size: { w: 200, h: 200 },
    gap: 0,
  },
};

export const layout = {
  heroCard: {
    x: Array(5)
      .fill(config.canvas.width / 2 - (config.heroCard.size.w * 2 + config.heroCard.gap * 2))
      .map((v, i) => v + (config.heroCard.size.w + config.heroCard.gap) * i),
    mineY: Array(5).fill(Math.floor(config.canvas.height / 2)),
    anemyY: Array(5).fill(Math.floor(config.heroCard.size.h / 2 + 10)),
  },
  actionCard: {
    x: Array(5)
      .fill(config.canvas.width / 2 - (config.actionCard.size.w * 2 + config.actionCard.gap * 2))
      .map((v, i) => v + (config.actionCard.size.w + config.actionCard.gap) * i),
    y: Array(5).fill(config.canvas.height - config.actionCard.size.h / 2),
  },
};

export const ac_num = {
  frames: {
    num0: { x: 0, y: 0, w: 69, h: 94 },
    num1: { x: -69, y: 0, w: 45, h: 94 },
    num2: { x: -114, y: 0, w: 67, h: 94 },
    num3: { x: -181, y: 0, w: 67, h: 94 },
    num4: { x: -248, y: 0, w: 69, h: 94 },
    num5: { x: 0, y: 95, w: 66, h: 94 },
    num6: { x: -66, y: 95, w: 63, h: 94 },
    num7: { x: -129, y: 95, w: 65, h: 94 },
    num8: { x: -194, y: 95, w: 68, h: 94 },
    num9: { x: -262, y: 95, w: 63, h: 94 },

    small_num0: { x: 0, y: 190, w: 27, h: 37 },
    small_num1: { x: -27, y: 190, w: 17, h: 37 },
    small_num2: { x: -44, y: 190, w: 26, h: 37 },
    small_num3: { x: -70, y: 190, w: 26, h: 37 },
    small_num4: { x: -96, y: 190, w: 27, h: 37 },
    small_num5: { x: -123, y: 190, w: 26, h: 37 },
    small_num6: { x: -149, y: 190, w: 24, h: 37 },
    small_num7: { x: -173, y: 190, w: 25, h: 37 },
    small_num8: { x: -198, y: 190, w: 26, h: 37 },
    small_num9: { x: -224, y: 190, w: 24, h: 37 },
  },
};

export default config as Readonly<TypeConfig>;
