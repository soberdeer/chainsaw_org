import { useDisclosure } from '@mantine/hooks';
import { AppShell, AppShellProps, Burger, Group, Text } from '@mantine/core';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import classes from './Shell.module.css';

export function Shell({ children }: AppShellProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group h="100%">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            ДНБ
          </Group>
          <ColorSchemeToggle />
        </Group>
      </AppShell.Header>
      <AppShell.Main className={classes.main}>{children}</AppShell.Main>
    </AppShell>
  );
}
