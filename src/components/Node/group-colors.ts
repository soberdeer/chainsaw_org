type GroupKey = 'Сеттинг' | 'Структура' | 'Арки' | 'Геймдизайн' | 'Код' | 'Арт' | string;

type GroupKeyEn = 'setting' | 'structure' | 'arch' | 'gd' | 'code' | 'art' | string;

const colors = {
  сеттинг: 'yellow',
  структура: 'grape',
  арки: 'red',
  сценарий: 'indigo',
  'гейм-дизайн': 'orange',
  геймдизайн: 'orange',
  код: 'green',
  арт: 'teal',
} as Record<GroupKey, string>;

export const getGroupColor = (group: GroupKey) => {
  const color = colors[group.toLocaleLowerCase()];
  if (!color) {
    return 'blue';
  }
  return color;
};
