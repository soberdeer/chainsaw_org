import type { DepartmentMap, PersonListRow } from '@/server/peopleList';

export type SortKey =
  | 'name'
  | 'username'
  | 'departments'
  | 'subdepartments'
  | 'leaderOf'
  | 'contact';

export type SortDirection = 'asc' | 'desc';

export type SelectOption = {
  value: string;
  label: string;
};

export function stringify(value: string[] | string | boolean | null): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'boolean') {
    return value ? 'да' : '';
  }

  return value ?? '';
}

export function unique(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, 'ru'));
}

export function hasAnyIntersection(first: string[], second: string[]): boolean {
  return first.some((item) => second.includes(item));
}

export function getSortValue(user: PersonListRow, key: SortKey): string {
  return stringify(user[key]).toLowerCase();
}

export function sortUsers(
  users: PersonListRow[],
  sortKey: SortKey,
  sortDirection: SortDirection,
): PersonListRow[] {
  return [...users].sort((a, b) => {
    const first = getSortValue(a, sortKey);
    const second = getSortValue(b, sortKey);
    const result = first.localeCompare(second, 'ru');

    return sortDirection === 'asc' ? result : -result;
  });
}

export function includesSearch(user: PersonListRow, search: string): boolean {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  const haystack = [
    user.name,
    user.username,
    user.contact,
    ...user.departments,
    ...user.subdepartments,
    ...user.leaderOf,
    user.isLead ? 'лид' : '',
  ]
  .filter(Boolean)
  .join(' ')
  .toLowerCase();

  return haystack.includes(normalizedSearch);
}

export function toSelectOptions(values: string[]): SelectOption[] {
  return unique(values).map((value) => ({
    value,
    label: value,
  }));
}

export function getDepartmentOptions(departmentMap: DepartmentMap): SelectOption[] {
  return toSelectOptions(Object.keys(departmentMap));
}

export function getAllSubdepartments(departmentMap: DepartmentMap): string[] {
  return unique(Object.values(departmentMap).flat());
}

export function getDepartmentsBySubdepartment(
  departmentMap: DepartmentMap,
): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();

  for (const [department, subdepartments] of Object.entries(departmentMap)) {
    for (const subdepartment of subdepartments) {
      const current = map.get(subdepartment) ?? new Set<string>();

      current.add(department);
      map.set(subdepartment, current);
    }
  }

  return map;
}

export function getAvailableSubdepartments(
  departmentMap: DepartmentMap,
  departmentFilter: string[],
): string[] {
  if (departmentFilter.length === 0) {
    return getAllSubdepartments(departmentMap);
  }

  return unique(
    departmentFilter.flatMap((department) => departmentMap[department] ?? []),
  );
}

export function getSubdepartmentOptions(
  departmentMap: DepartmentMap,
  departmentFilter: string[],
): SelectOption[] {
  return toSelectOptions(
    getAvailableSubdepartments(departmentMap, departmentFilter),
  );
}

export function filterSelectedSubdepartments(
  selectedSubdepartments: string[],
  availableSubdepartments: string[],
): string[] {
  return selectedSubdepartments.filter((subdepartment) =>
    availableSubdepartments.includes(subdepartment),
  );
}

export function filterUsers(
  users: PersonListRow[],
  search: string,
  departmentFilter: string[],
  subdepartmentFilter: string[],
): PersonListRow[] {
  return users.filter((user) => {
    const matchesSearch = includesSearch(user, search);

    const matchesDepartment =
      departmentFilter.length === 0 ||
      hasAnyIntersection(user.departments, departmentFilter);

    const matchesSubdepartment =
      subdepartmentFilter.length === 0 ||
      hasAnyIntersection(user.subdepartments, subdepartmentFilter);

    return matchesSearch && matchesDepartment && matchesSubdepartment;
  });
}

export function getFilteredAndSortedUsers(
  users: PersonListRow[],
  search: string,
  departmentFilter: string[],
  subdepartmentFilter: string[],
  sortKey: SortKey,
  sortDirection: SortDirection,
): PersonListRow[] {
  return sortUsers(
    filterUsers(users, search, departmentFilter, subdepartmentFilter),
    sortKey,
    sortDirection,
  );
}