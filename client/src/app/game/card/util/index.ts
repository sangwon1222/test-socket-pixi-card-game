import * as PIXI from 'pixijs';
import { ac_num } from '@app/config';
import { rscManager } from '@app/core/rscManager';

export const util = {
  setSpriteNumber(number: number, bigFont: boolean, bgName?: string, bgWidth?: number, bgheight?: number) {
    const layout = new PIXI.Container();
    const formatPoint = `0${Math.floor(number)}`.slice(-2).split('');

    if (bgName) {
      const bg = new PIXI.Sprite(rscManager.getHandle.getRsc(bgName));
      bg.width = bgWidth;
      bg.height = bgheight;
      layout.addChild(bg);
    }

    const numAry = [];
    for (let i = 0; i < 2; i++) {
      const number = bigFont ? `num${formatPoint[i]}` : `small_num${formatPoint[i]}`;
      const acp = new PIXI.TilingSprite(rscManager.getHandle.getRsc('ac_num.png'));
      acp.width = ac_num.frames[number].w;
      acp.height = ac_num.frames[number].h;

      acp.tilePosition.set(ac_num.frames[number].x, -ac_num.frames[number].y);
      if (bgheight) acp.y = bgheight - acp.height;
      layout.addChild(acp);
      acp.x += numAry[i - 1] ? numAry[i - 1].x + numAry[i - 1].width : 0;
      numAry.push(acp);
    }
    layout.pivot.set(layout.width / 2, layout.height / 2);

    return { layout, numAry };
  },
};

export const getTime = () => {
  const date = new Date();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  const hour = `0${date.getHours()}`.slice(-2);
  const minute = `0${date.getMinutes()}`.slice(-2);
  const seconds = `0${date.getSeconds()}`.slice(-2);

  return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${seconds}`;
};

export const getToday = () => {
  const date = new Date();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  return `${date.getFullYear()}-${month}-${day}`;
};
