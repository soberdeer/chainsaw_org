import { useState } from 'react';
import {
  Group,
  Paper,
  Image,
  Stack,
  Text,
  Box,
  Badge,
  PaperProps,
  Anchor,
  useComputedColorScheme,
} from '@mantine/core';
import { IconBrandTelegram, IconUser } from '@tabler/icons-react';
import classes from './Node.module.css';
import { NoPanArea, Pressable, Space } from 'react-zoomable-ui';
import { getGroupColor } from '@/components/Node/group-colors';

export interface NodeProps extends PaperProps {
  name: string;
  type?: string[] | null;
  group?: string[] | null;
  job?: string;
  description?: string | null;
  avatar?: string | null;
  contacts?: {
    tg?: string | null;
  };

  children?: NodeProps[];
  groupedChildren?: {
    name: string;
    children: NodeProps[];
  }[];
}

const icons = {
  tg: IconBrandTelegram,
};

export function Node({
  name,
  type,
  group,
  description,
  avatar,
  contacts,
  children,
  groupedChildren,
  ...others
}: NodeProps) {
  const [rendered, setRendered] = useState(true);
  const colorScheme = useComputedColorScheme();
  let startTime = 0;
  const maxDuration = 300;

  const handleAvatarError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.preventDefault();
    event.stopPropagation();
    setRendered(false);
  };

  const handleNodeClick = () => {
    console.log('click');
  };

  const handleMouseDown = () => {
    startTime = Date.now();
  };
  const handleMouseUp = () => {
    const duration = Date.now() - startTime;
    if (duration < maxDuration) {
      handleNodeClick();
    } else {
    }
  };

  return (
    <Pressable onTap={handleNodeClick}>
      <Paper
        shadow="xs"
        p="xl"
        m="xl"
        className={classes.root}
        miw={500}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        {...others}
      >
        <Group gap="lg" wrap="nowrap">
          <Box className={classes.avatar}>
            {avatar ? (
              rendered ? (
                <Image
                  src={avatar}
                  alt="avatar"
                  width={150}
                  style={{ width: 100 }}
                  onError={handleAvatarError}
                />
              ) : (
                <IconUser size={70} />
              )
            ) : (
              <IconUser size={70} />
            )}
          </Box>
          <Stack style={{ textAlign: 'left' }}>
            <NoPanArea>
              <Group>
                {group?.map((j) => (
                  <Badge
                    variant={colorScheme === 'light' ? 'light' : 'outline'}
                    key={j}
                    color={getGroupColor(j)}
                    size="xl"
                  >
                    {j}
                  </Badge>
                ))}
              </Group>
            </NoPanArea>
            <NoPanArea>
              <Text fw="bold" size="xl">
                {name}
              </Text>
            </NoPanArea>
            {description && (
              <NoPanArea>
                <Text>{description}</Text>
              </NoPanArea>
            )}
            {contacts &&
              Object.keys(contacts).map((k) => {
                const href = contacts[k as keyof typeof icons];
                const Icon = icons[k as keyof typeof icons] || <div />;
                const name = href?.replace('https://t.me/', '');
                return (
                  <NoPanArea key={k}>
                    <Anchor href={href || '#'} style={{ width: 'fit-content', display: 'block' }}>
                      <Group wrap="nowrap" gap={4}>
                        <Icon />
                        <Text>{name}</Text>
                      </Group>
                    </Anchor>
                  </NoPanArea>
                );
              })}
          </Stack>
        </Group>
      </Paper>
    </Pressable>
  );
}
