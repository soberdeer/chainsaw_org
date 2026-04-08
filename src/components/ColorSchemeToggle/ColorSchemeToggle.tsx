import { ActionIcon, Group, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <Group justify="center" align="center">
      {colorScheme === 'light' ? (
        <ActionIcon onClick={() => setColorScheme('dark')} variant="default">
          <IconMoon color="blue" />
        </ActionIcon>
      ) : (
        <ActionIcon onClick={() => setColorScheme('light')} variant="default">
          <IconSun color="yellow" />
        </ActionIcon>
      )}
    </Group>
  );
}
