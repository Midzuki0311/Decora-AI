import { Image } from 'react-native';

export const STYLE_NAMES = ['Modern', 'Luxury', 'Japanese', 'Industrial', 'Minimal', 'Scandinavian', 'Classic'] as const;
export type StyleName = typeof STYLE_NAMES[number];

export interface RoomData {
  id: number;
  title: string;
  before: any; // require() source
  after: any;
  styles: Record<StyleName, any>; // style-specific after images
}

// Default demo images: each room has a before + after for each style
// In demo mode all styles share the same "after" image
export const demoRooms: RoomData[] = [
  {
    id: 1,
    title: 'Living Room',
    before: require('../../../assets/images/demo/1/before.webp'),
    after: require('../../../assets/images/demo/1/after.png'),
    styles: {
      Modern: require('../../../assets/images/demo/1/after.png'),
      Luxury: require('../../../assets/images/demo/1/after.png'),
      Japanese: require('../../../assets/images/demo/1/after.png'),
      Industrial: require('../../../assets/images/demo/1/after.png'),
      Minimal: require('../../../assets/images/demo/1/after.png'),
      Scandinavian: require('../../../assets/images/demo/1/after.png'),
      Classic: require('../../../assets/images/demo/1/after.png'),
    },
  },
  {
    id: 2,
    title: 'Bedroom',
    before: require('../../../assets/images/demo/2/before.webp'),
    after: require('../../../assets/images/demo/2/after.png'),
    styles: {
      Modern: require('../../../assets/images/demo/2/after.png'),
      Luxury: require('../../../assets/images/demo/2/after.png'),
      Japanese: require('../../../assets/images/demo/2/after.png'),
      Industrial: require('../../../assets/images/demo/2/after.png'),
      Minimal: require('../../../assets/images/demo/2/after.png'),
      Scandinavian: require('../../../assets/images/demo/2/after.png'),
      Classic: require('../../../assets/images/demo/2/after.png'),
    },
  },
  {
    id: 3,
    title: 'Kitchen',
    before: require('../../../assets/images/demo/3/before.webp'),
    after: require('../../../assets/images/demo/3/after.png'),
    styles: {
      Modern: require('../../../assets/images/demo/3/after.png'),
      Luxury: require('../../../assets/images/demo/3/after.png'),
      Japanese: require('../../../assets/images/demo/3/after.png'),
      Industrial: require('../../../assets/images/demo/3/after.png'),
      Minimal: require('../../../assets/images/demo/3/after.png'),
      Scandinavian: require('../../../assets/images/demo/3/after.png'),
      Classic: require('../../../assets/images/demo/3/after.png'),
    },
  },
] as const;

export function getRoomById(id: number): RoomData {
  return (demoRooms.find((r) => r.id === id) ?? demoRooms[0]) as RoomData;
}

export function sourceUri(source: any): string {
  if (typeof source === 'string') return source;
  return Image.resolveAssetSource(source).uri;
}

export function getStyleImage(room: RoomData, style: StyleName): any {
  return room.styles[style] || room.after;
}
