export interface TypeActionCardInfo {
  element: string;
  attack: number;
  defence: number;
  heal: number;
  actionPoint: number;
}

export interface TypeConfig {
  cardElement: Readonly<string[]>;
  cardColor: Readonly<{
    fire: number;
    water: number;
    wind: number;
    electric: number;
    plant: number;
  }>;
  canvas: Readonly<{
    bg: Readonly<number>;
    width: Readonly<number>;
    height: Readonly<number>;
  }>;
  heroCard: Readonly<{
    size: { w: number; h: number };
    iconSize: { w: number; h: number };
    gap: number;
  }>;
  actionCard: Readonly<{
    size: { w: number; h: number };
    gap: number;
  }>;
  acp: Readonly<{
    pointWidth: number;
    pointCount: number;
    pointgap: number;
    duration: number;
    lineColor: number;
    barColor: number;
    ableColor: number;
    disableColor: number;
    waitBar: Readonly<{
      size: { w: number; h: number };
    }>;
  }>;
  elementType: Readonly<{ [key: string]: any }>;
  devLink: Readonly<string>;
}

export interface TypeAppParms {
  width: number;
  height: number;
  backgroundColor: number;
  view: HTMLCanvasElement;
}

export type TypeSrcInfo = {
  [key: string]: string[];
};

export interface TypeDefaultObject {
  [key: string]: any;
}

export interface TypeActionCardParams {
  element: string;
  attack: number;
  defence: number;
  heal: number;
  actionPoint: number;
  property: string;
  propertyValue: number;
}

export interface TypeHeroCardParams {
  element: string;
  hp: number;
  attack: number;
  defence: number;
  itsMine: boolean;
}

export interface TypeActionCardInfo {
  element: string;
  attack: number;
  defence: number;
  heal: number;
  actionPoint: number;
  idx?: number;
}
