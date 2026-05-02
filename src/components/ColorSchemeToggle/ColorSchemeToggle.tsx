import { useEffect, useState } from 'react';
import { ActionIcon, Group, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Group justify="center">
        <ActionIcon variant="outline" color="gray" aria-label="Toggle color scheme">
          <IconMoon />
        </ActionIcon>
      </Group>
    );
  }

  const isDark = colorScheme === 'dark';

  return (
    <Group justify="center">
      <ActionIcon
        variant="outline"
        color={isDark ? 'yellow' : 'blue'}
        onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
        aria-label="Toggle color scheme"
      >
        {isDark ? <IconSun /> : <IconMoon />}
      </ActionIcon>
    </Group>
  );
}