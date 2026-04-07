import { ActionIcon, Slider, Stack } from '@mantine/core';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { useSpaceController } from '@/hooks/use-space-controller';
import classes from './Controls.module.css';

export const Controls = ({ currentZoom }: { currentZoom: number }) => {
  const { zoomPlus, setZoom, zoomMinus, maxZoom, minZoom } = useSpaceController();
  console.log(currentZoom);
  return (
    <Stack gap="md" className={classes.container} align="center">
      <ActionIcon size="lg" variant="default" onClick={zoomPlus}>
        <IconPlus />
      </ActionIcon>
      <Slider
        min={maxZoom}
        max={minZoom}
        step={0.1}
        onChange={setZoom}
        orientation="vertical"
        value={currentZoom}
      />

      <ActionIcon size="lg" variant="default" onClick={zoomMinus}>
        <IconMinus />
      </ActionIcon>
    </Stack>
  );
};
