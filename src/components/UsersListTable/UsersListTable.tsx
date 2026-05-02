import {
  Anchor,
  Avatar,
  Badge,
  Group,
  Highlight,
  MultiSelect,
  Paper,
  ScrollArea,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { IconStar } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { getGroupColor } from '@/components/Node/group-colors';
import type { DepartmentMap, PersonListRow } from '@/server/peopleList';
import { HeaderCell } from './HeaderCell/HeaderCell';
import {
  filterSelectedSubdepartments,
  getAvailableSubdepartments,
  getDepartmentOptions,
  getDepartmentsBySubdepartment,
  getFilteredAndSortedUsers,
  getSubdepartmentOptions,
  type SortDirection,
  type SortKey,
  unique,
} from './helpers';
import classes from './UsersListTable.module.css';

type UsersListTableProps = {
  users: PersonListRow[];
  departmentMap: DepartmentMap;
};

export function UsersListTable({ users, departmentMap }: UsersListTableProps) {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string[]>([]);
  const [subdepartmentFilter, setSubdepartmentFilter] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const departmentOptions = useMemo(() => getDepartmentOptions(departmentMap), [departmentMap]);

  const subdepartmentOptions = useMemo(
    () => getSubdepartmentOptions(departmentMap, departmentFilter),
    [departmentMap, departmentFilter]
  );

  const departmentsBySubdepartment = useMemo(
    () => getDepartmentsBySubdepartment(departmentMap),
    [departmentMap]
  );

  const filteredUsers = useMemo(
    () =>
      getFilteredAndSortedUsers(
        users,
        search,
        departmentFilter,
        subdepartmentFilter,
        sortKey,
        sortDirection
      ),
    [users, search, departmentFilter, subdepartmentFilter, sortKey, sortDirection]
  );

  const handleDepartmentFilterChange = (value: string[]) => {
    setDepartmentFilter(value);

    if (value.length === 0) {
      return;
    }

    const nextAvailableSubdepartments = getAvailableSubdepartments(departmentMap, value);

    setSubdepartmentFilter((current) =>
      filterSelectedSubdepartments(current, nextAvailableSubdepartments)
    );
  };

  const handleDepartmentBadgeClick = (department: string) => {
    setDepartmentFilter([department]);

    const nextAvailableSubdepartments = departmentMap[department] ?? [];

    setSubdepartmentFilter((current) =>
      filterSelectedSubdepartments(current, nextAvailableSubdepartments)
    );
  };

  const handleSubdepartmentBadgeClick = (subdepartment: string) => {
    setSubdepartmentFilter([subdepartment]);

    const relatedDepartments = Array.from(departmentsBySubdepartment.get(subdepartment) ?? []);

    if (relatedDepartments.length > 0) {
      setDepartmentFilter(relatedDepartments);
    }
  };

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));

      return;
    }

    setSortKey(key);
    setSortDirection('asc');
  };

  return (
    <Paper withBorder p="md">
      <Group mb="md" align="end">
        <TextInput
          label="Поиск"
          placeholder="Имя, ник, отдел, контакт"
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          className={classes.search}
        />

        <MultiSelect
          label="Отдел"
          placeholder="Все отделы"
          data={departmentOptions}
          value={departmentFilter}
          onChange={handleDepartmentFilterChange}
          searchable
          clearable
          className={classes.filter}
        />

        <MultiSelect
          label="Подотдел"
          placeholder={
            departmentFilter.length > 0 ? 'Подотделы выбранных отделов' : 'Все подотделы'
          }
          data={subdepartmentOptions}
          value={subdepartmentFilter}
          onChange={setSubdepartmentFilter}
          searchable
          clearable
          className={classes.filter}
        />
      </Group>

      <ScrollArea>
        <Table striped highlightOnHover verticalSpacing="sm" miw={900}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Аватар</Table.Th>

              <HeaderCell
                label="Имя"
                sortKey="name"
                activeSortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
              />

              <HeaderCell
                label="Юзернейм"
                sortKey="username"
                activeSortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <HeaderCell
                label="Лид"
                sortKey="leaderOf"
                activeSortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <HeaderCell
                label="Отдел"
                sortKey="departments"
                activeSortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
              />

              <HeaderCell
                label="Подотдел"
                sortKey="subdepartments"
                activeSortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {filteredUsers.map((user) => {
              const departments = unique(user.departments);
              const subdepartments = unique(user.subdepartments);
              const leaderOf = unique(user.leaderOf);

              return (
                <Table.Tr key={user.id}>
                  <Table.Td>
                    <Avatar src={user.avatar} name={user.name} radius="xl" />
                  </Table.Td>

                  <Table.Td>
                    <Highlight highlight={search} fw={500} maw={250}>
                      {user.name}
                    </Highlight>
                  </Table.Td>

                  <Table.Td>
                    {user.contact && (
                      <Anchor
                        href={
                          user.contact.includes('t.me/')
                            ? user.contact
                            : user.username
                              ? `https://t.me/${user.username.replace('@', '')}`
                              : undefined
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Highlight highlight={search}>{user.username || ''}</Highlight>
                      </Anchor>
                    )}
                  </Table.Td>

                  <Table.Td>
                    {leaderOf.length > 0 && (
                      <Group gap={4}>
                        {leaderOf.map((department) =>
                          department.toLowerCase() !== 'администрация' ? (
                            <Badge
                              key={department}
                              variant="filled"
                              color={getGroupColor(department)}
                              className={classes.clickableBadge}
                              onClick={() => handleDepartmentBadgeClick(department)}
                            >
                              <Group gap={5} align="center" wrap="nowrap">
                                <IconStar size={16} />
                                {department}
                              </Group>
                            </Badge>
                          ) : null
                        )}
                      </Group>
                    )}
                  </Table.Td>

                  <Table.Td>
                    <Group gap="xs">
                      {departments.length > 0 &&
                        departments.map((department) => (
                          <Badge
                            key={department}
                            variant="filled"
                            color={getGroupColor(department)}
                            className={classes.clickableBadge}
                            onClick={() => handleDepartmentBadgeClick(department)}
                          >
                            {department}
                          </Badge>
                        ))}
                    </Group>
                  </Table.Td>

                  <Table.Td>
                    <Group gap="xs">
                      {subdepartments.length > 0
                        ? subdepartments.map((subdepartment) => (
                            <Badge
                              key={subdepartment}
                              variant="outline"
                              color={getGroupColor(subdepartment)}
                              className={classes.clickableBadge}
                              onClick={() => handleSubdepartmentBadgeClick(subdepartment)}
                            >
                              {subdepartment}
                            </Badge>
                          ))
                        : null}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}

            {filteredUsers.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text ta="center" c="dimmed">
                    Ничего не найдено
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}
