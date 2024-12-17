import { Socket, io } from 'socket.io-client';
import CardGame from '@card/scene/cardGame';
import Intro from './scene/intro';
import { userStore } from '@store/user';
import { getTime } from './util';
import { filter } from 'lodash-es';
import CardScene from './scene';
import { loadingStore } from '@store/loading';

export class SocketIo {
  private socket: Socket;
  private mScene: CardScene;
  private mChat: { id: string; chat: string; time: string }[];
  get chatList(): { id: string; chat: string; time: string }[] {
    return this.mChat;
  }

  constructor(scene?: CardScene) {
    this.mScene = scene;
    const isProduct = process.env.NODE_ENV === 'production';
    this.mChat = [{ id: 'admin', chat: 'Welcome', time: getTime() }];

    // this.socket = io('http://localhost:3000', {
    this.socket = io('http://43.200.109.38:3000', {
      withCredentials: false,
      extraHeaders: {
        'my-custom-header': 'test-cutom-header',
      },
    });
  }

  async init() {
    this.socket.on('connect', () => console.log('connect-socket'));

    this.socket.on('welcome', (arg) => {
      userStore.socketId = arg.socketId;
      userStore.clientsCount = arg.clientsCount;
      userStore.cards = arg.cards;
      this.socket.emit('send-id', { id: userStore.userId });
    });
    // chat

    this.socket.on('send-message', ({ id, chat, time }: { id: string; chat: string; time: string }) => {
      this.mChat.unshift({ id, chat, time });
    });

    this.socket.on('receive-message', ({ id, chat, time }: { id: string; chat: string; time: string }) => {
      this.mChat.unshift({ id, chat, time });
    });

    this.socket.on('leave-user', (arg) => {
      userStore.clientsCount = arg.clientsCount;
      if (userStore.notice.length) userStore.notice.pop();
      userStore.notice.unshift(`2[ ${arg.userId} ] 퇴장!!!!`);

      console.log(`${arg.socketId.substring(0, 4)} 나갔다.`);
    });

    // chat

    //card-game
    this.socket.on('incomming-user', (arg) => {
      userStore.clientsCount = arg.clientsCount;
      if (arg.clientsCount === 2) {
        userStore.income = arg.other;
        this.mScene.cardDeck.other = arg.otherDeck;
        this.mScene.nextGame();
      }
    });

    this.socket.on('make-room', async (arg) => {
      userStore.roomName = arg.roomName;
      const intro = this.mScene.cardGameScene as Intro;
      loadingStore.isLoading = true;
      await intro.makeRoom();
      loadingStore.isLoading = false;
    });

    this.socket.on('search-room', async (arg) => {
      if (!arg.result) alert(arg.msg);
    });

    this.socket.on('get-action-card', (arg) => {
      const cardGame = this.mScene.cardGameScene as CardGame;
      cardGame.getActionCard(arg.card);
    });

    this.socket.on('get-one-action-card', (arg) => {
      const cardGame = this.mScene.cardGameScene as CardGame;
      cardGame.addActionCard(arg.card);
    });

    this.socket.on('attack-card', (arg) => {
      const { socketId, idx, attack, enemyIdx } = arg;
      const cardGame = this.mScene.cardGameScene as CardGame;
      cardGame.setDamage({ socketId, idx, attack: Math.ceil(attack), enemyIdx });
    });

    this.socket.on('use-heal-card', (arg) => {
      const { idx, value } = arg;
      const cardGame = this.mScene.cardGameScene as CardGame;
      cardGame.broadCastHeal({ idx, value });
    });

    this.socket.on('use-defence-card', (arg) => {
      const { idx, value } = arg;
      const cardGame = this.mScene.cardGameScene as CardGame;
      cardGame.broadCastDefence({ idx, value });
    });
    //card-game
  }

  async close() {
    this.socket.close();
    this.socket.disconnect();
  }

  emit(eventName: string, args?: any) {
    this.socket.emit(eventName, { ...args });
  }
}
