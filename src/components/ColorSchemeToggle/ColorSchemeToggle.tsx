import { ActionIcon, Button, Group, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <Group justify="center">
      {colorScheme === 'light' ? (
        <ActionIcon onClick={() => setColorScheme('dark')} variant="transparent">
          <IconMoon color="blue" />
        </ActionIcon>
      ) : (
        <ActionIcon onClick={() => setColorScheme('light')} variant="transparent">
          <IconSun color="yellow" />
        </ActionIcon>
      )}
    </Group>
  );
}
