import { Provider } from './context';
import { Space } from 'react-zoomable-ui';
import { useRef } from 'react';
import { Controls } from '@/components/OrgChart/Controls/Controls';

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2.5;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function SpaceProvider({ children }: { children?: React.ReactNode }) {
  const spaceRef = useRef<Space | null>(null);

  function setZoom(nextZoom: number) {
    if (spaceRef?.current?.viewPort?.camera) {
      const vp = spaceRef.current?.viewPort;
      const currentZoom = spaceRef.current?.viewPort?.zoomFactor || 1;
      const safeNextZoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
      const delta = safeNextZoom - currentZoom;

      const centerX = vp.containerWidth / 2;
      const centerY = vp.containerHeight / 2;

      vp.camera.moveBy(0, 0, delta, centerX, centerY, { durationMilliseconds: 200 });
    }
  }

  const zoomMinus = () => {
    if (spaceRef?.current?.viewPort?.camera) {
      const vp = spaceRef.current.viewPort;

      vp.camera.moveBy(0, 0, -0.2, vp.containerWidth / 2, vp.containerHeight / 2, {
        durationMilliseconds: 200,
      });
    }
  };

  const zoomPlus = () => {
    if (spaceRef?.current?.viewPort?.camera) {
      const vp = spaceRef.current.viewPort;

      vp.camera.moveBy(0, 0, 0.2, vp.containerWidth / 2, vp.containerHeight / 2, {
        durationMilliseconds: 200,
      });
    }
  };

  return (
    <Provider
      value={{
        setZoom,
        zoomMinus,
        zoomPlus,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        currentZoom: spaceRef.current?.viewPort?.zoomFactor || 1,
      }}
    >
      {/*<Controls spaceRef={spaceRef}/>*/}
      <Space ref={spaceRef}>{children}</Space>
    </Provider>
  );
}
