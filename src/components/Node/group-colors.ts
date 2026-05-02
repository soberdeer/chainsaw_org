// @ts-nocheck

import { Record } from 'effect/Schema';

type GroupKey = 'Сеттинг' | 'Структура' | 'Арки' | 'Геймдизайн' | 'Код' | 'Арт' | string;

const ruMap = {
  setting: 'сеттинг',
  structure: 'структура',
  arch: 'арки',
  gd: 'геймдизайн',
  'g-d': 'гейм-дизайн',
  code: 'код',
  art: 'арт',
  script: 'сценарий',
};

const colors = {
  [ruMap.setting]: 'yellow',
  [ruMap.structure]: 'grape',
  [ruMap.arch]: 'red',
  [ruMap.script]: 'indigo',
  [ruMap['g-d']]: 'orange',
  [ruMap.gd]: 'orange',
  [ruMap.code]: 'green',
  [ruMap.art]: 'teal',
} as Record<GroupKey, string>;

export const getGroupColor = (group: GroupKey) => {
  const color = colors[group.toLocaleLowerCase()];
  if (!color) {
    return 'blue';
  }
  return color;
};
