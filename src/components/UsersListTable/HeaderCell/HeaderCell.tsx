import { Group, Table, Text, UnstyledButton, TableThProps } from '@mantine/core';
import type { SortDirection, SortKey } from '../helpers';
import classes from './HeaderCell.module.css';

type HeaderCellProps = {
  label: string;
  sortKey: SortKey;
  activeSortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
} & TableThProps;

export function HeaderCell({
  label,
  sortKey,
  activeSortKey,
  sortDirection,
  onSort,
  ...rest
}: HeaderCellProps) {
  const isActive = activeSortKey === sortKey;

  return (
    <Table.Th {...rest}>
      <UnstyledButton
        className={classes.headerButton}
        onClick={() => onSort(sortKey)}
      >
        <Group gap={6} wrap="nowrap">
          <Text fw={600} size="sm">
            {label}
          </Text>

          <Text size="xs" c="dimmed">
            {isActive ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
          </Text>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}