import { createSafeContext } from '@mantine/core';

type SpaceContextProps = {
  zoomPlus: () => void;
  zoomMinus: () => void;
  setZoom: (zoom: number) => void;
  maxZoom: number;
  minZoom: number;
  currentZoom: number;
};

export const [Provider, useSpaceController] = createSafeContext<SpaceContextProps | null>(
  'Missing SpaceContext'
);
