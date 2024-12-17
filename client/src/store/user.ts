import { SocketIo } from '@app/game/card/socket';
import { reactive } from 'vue';

export const userStore: TypeParam = reactive({
  socket: null,
  socketId: '',
  userId: '',
  notice: [],
  income: '',
  cards: [],
  clientsCount: 0,
  roomName: '',
  isRoomNameInput: false,
  isRoomNameShare: false,
});

interface TypeParam {
  socket?: SocketIo | null;
  socketId: string;
  userId: string;
  notice: string[];
  income: string;
  cards: any[];
  clientsCount: number;
  roomName: string;
  isRoomNameInput: boolean;
  isRoomNameShare: boolean;
}
