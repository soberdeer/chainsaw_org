import { AppShell, type AppShellProps, Burger, Container, Group, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import { Logo } from '@/components/Shell/Logo';
import classes from './Shell.module.css';

const navigationItems = [
  {
    href: '/tree',
    label: 'Дерево',
  },
  {
    href: '/list',
    label: 'Таблица',
  },
];

export function Shell({ children }: AppShellProps) {
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Group h="100%" px="md" justify="space-between" align="center" wrap="nowrap">
            <Group h="100%" align="center" gap="md" wrap="nowrap">
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

              <Link href="/tree">
                <Group style={{ height: '100%' }} align="center">
                  <Logo width={80} />
                </Group>
              </Link>

              <Group visibleFrom="sm" gap={4} wrap="nowrap" className={classes.nav}>
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.href}
                    component={Link}
                    href={item.href}
                    label={item.label}
                    active={router.pathname === item.href}
                    variant="subtle"
                    className={classes.navLink}
                  />
                ))}
              </Group>
            </Group>

            <div className={classes.actions}>
              <ColorSchemeToggle />
            </div>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main className={classes.main}>{children}</AppShell.Main>
    </AppShell>
  );
}
