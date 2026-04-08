import { useDisclosure } from '@mantine/hooks';
import { AppShell, AppShellProps, Burger, Container, Group, Text } from '@mantine/core';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import classes from './Shell.module.css';

export function Shell({ children }: AppShellProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container size="xl" style={{ height: '100%' }}>
          <Group h="100%" px="md" justify="space-between" align="center">
            <Group h="100%" align="center">
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              ДНБ
            </Group>
            <ColorSchemeToggle />
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Main className={classes.main}>{children}</AppShell.Main>
    </AppShell>
  );
}
