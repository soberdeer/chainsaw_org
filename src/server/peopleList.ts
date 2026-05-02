import { getPeopleTree, type PersonTreeGroup, type PersonTreeNode } from '@/server/people';

export type PersonListRow = {
  id: string;
  avatar: string | null;
  name: string;
  username: string | null;
  departments: string[];
  subdepartments: string[];
  isLead: boolean;
  leaderOf: string[];
  contact: string | null;
};

export type DepartmentMap = Record<string, string[]>;

type PeopleListData = {
  users: PersonListRow[];
  departmentMap: DepartmentMap;
};

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function normalizeTelegram(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.includes('t.me/')) {
    const username = trimmed
      .split('t.me/')[1]
      ?.split(/[/?#]/)[0]
      ?.replace(/^@+/, '')
      .trim()
      .toLowerCase();

    return username ? `@${username}` : null;
  }

  const username = trimmed.replace(/^@+/, '').trim().toLowerCase();

  if (!username) {
    return null;
  }

  return `@${username}`;
}

function formatTelegram(value: string | null): string | null {
  if (!value) {
    return null;
  }

  if (value.startsWith('@')) {
    return value;
  }

  return value;
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, 'ru')
  );
}

function getNodeContact(node: PersonTreeNode): string | null {
  return node.contacts.tg ?? null;
}

function getNodeUsername(node: PersonTreeNode): string | null {
  return formatTelegram(normalizeTelegram(node.contacts.tg));
}

function getRowKey(node: PersonTreeNode): string {
  const username = normalizeTelegram(node.contacts.tg);

  if (username) {
    return `tg:${username}`;
  }

  return `name:${normalizeText(node.name)}`;
}

function addToDepartmentMap(
  departmentMap: Map<string, Set<string>>,
  departments: string[],
  subdepartments: string[]
) {
  for (const department of unique(departments)) {
    const current = departmentMap.get(department) ?? new Set<string>();

    for (const subdepartment of unique(subdepartments)) {
      current.add(subdepartment);
    }

    departmentMap.set(department, current);
  }
}

function mergePersonRow(
  existing: PersonListRow,
  node: PersonTreeNode,
  departments: string[],
  subdepartments: string[],
  leaderOf: string[] = []
) {
  const username = getNodeUsername(node);
  const contact = getNodeContact(node);

  existing.avatar = existing.avatar ?? node.avatar;
  existing.username = existing.username ?? username;
  existing.contact = existing.contact ?? contact;
  existing.isLead = existing.isLead || leaderOf.length > 0;

  existing.departments = unique([...existing.departments, ...departments, ...node.type]);

  existing.subdepartments = unique([...existing.subdepartments, ...subdepartments, ...node.group]);

  existing.leaderOf = unique([...existing.leaderOf, ...leaderOf]);
}

function addUserOccurrence(
  rowsByUser: Map<string, PersonListRow>,
  departmentMap: Map<string, Set<string>>,
  node: PersonTreeNode,
  departments: string[],
  subdepartments: string[],
  leaderOf: string[] = []
) {
  const normalizedDepartments = unique([...departments, ...node.type]);
  const normalizedSubdepartments = unique([...subdepartments, ...node.group]);
  const normalizedLeaderOf = unique(leaderOf);

  addToDepartmentMap(departmentMap, normalizedDepartments, normalizedSubdepartments);

  const key = getRowKey(node);
  const existing = rowsByUser.get(key);

  if (existing) {
    mergePersonRow(
      existing,
      node,
      normalizedDepartments,
      normalizedSubdepartments,
      normalizedLeaderOf
    );

    return;
  }

  rowsByUser.set(key, {
    id: key,
    avatar: node.avatar,
    name: node.name,
    username: getNodeUsername(node),
    departments: normalizedDepartments,
    subdepartments: normalizedSubdepartments,
    isLead: normalizedLeaderOf.length > 0,
    leaderOf: normalizedLeaderOf,
    contact: getNodeContact(node),
  });
}

function getLeaderDepartments(leader: PersonTreeNode): string[] {
  if (leader.type.length > 0) {
    return unique(leader.type);
  }

  if (leader.groupedChildren.length > 0) {
    return unique(leader.groupedChildren.map((group) => group.name));
  }

  return [leader.name];
}

function shouldSplitLeaderGroupsAsDepartments(
  leader: PersonTreeNode,
  leaderDepartments: string[]
): boolean {
  const directGroupNames = leader.groupedChildren.map((group) => group.name);

  return (
    directGroupNames.length > 0 &&
    directGroupNames.every((groupName) => leaderDepartments.includes(groupName))
  );
}

function getNodeFallbackSubdepartments(node: PersonTreeNode, departments: string[]): string[] {
  if (node.group.length > 0) {
    return unique(node.group);
  }

  return unique(departments);
}

function walkNode(
  rowsByUser: Map<string, PersonListRow>,
  departmentMap: Map<string, Set<string>>,
  node: PersonTreeNode,
  departments: string[],
  inheritedSubdepartments: string[] = []
) {
  const subdepartments =
    inheritedSubdepartments.length > 0
      ? inheritedSubdepartments
      : getNodeFallbackSubdepartments(node, departments);

  addUserOccurrence(rowsByUser, departmentMap, node, departments, subdepartments);

  for (const child of node.children) {
    walkNode(rowsByUser, departmentMap, child, departments);
  }

  for (const group of node.groupedChildren) {
    walkGroup(rowsByUser, departmentMap, group, departments, [group.name]);
  }
}

function walkGroup(
  rowsByUser: Map<string, PersonListRow>,
  departmentMap: Map<string, Set<string>>,
  group: PersonTreeGroup,
  departments: string[],
  subdepartments: string[]
) {
  addToDepartmentMap(departmentMap, departments, subdepartments);

  for (const child of group.children) {
    walkNode(rowsByUser, departmentMap, child, departments, subdepartments);
  }
}

function walkLeader(
  rowsByUser: Map<string, PersonListRow>,
  departmentMap: Map<string, Set<string>>,
  leader: PersonTreeNode
) {
  const leaderDepartments = getLeaderDepartments(leader);
  const splitDirectGroupsAsDepartments = shouldSplitLeaderGroupsAsDepartments(
    leader,
    leaderDepartments
  );

  if (splitDirectGroupsAsDepartments) {
    addUserOccurrence(
      rowsByUser,
      departmentMap,
      leader,
      leaderDepartments,
      leaderDepartments,
      leaderDepartments
    );

    for (const group of leader.groupedChildren) {
      walkGroup(rowsByUser, departmentMap, group, [group.name], [group.name]);
    }

    for (const child of leader.children) {
      walkNode(rowsByUser, departmentMap, child, leaderDepartments);
    }

    return;
  }

  const leaderSubdepartments = getNodeFallbackSubdepartments(leader, leaderDepartments);

  addUserOccurrence(
    rowsByUser,
    departmentMap,
    leader,
    leaderDepartments,
    leaderSubdepartments,
    leaderDepartments
  );

  for (const child of leader.children) {
    walkNode(rowsByUser, departmentMap, child, leaderDepartments);
  }

  for (const group of leader.groupedChildren) {
    walkGroup(rowsByUser, departmentMap, group, leaderDepartments, [group.name]);
  }
}

function toDepartmentMap(map: Map<string, Set<string>>): DepartmentMap {
  return Object.fromEntries(
    Array.from(map.entries())
      .sort(([first], [second]) => first.localeCompare(second, 'ru'))
      .map(([department, subdepartments]) => [
        department,
        Array.from(subdepartments).sort((a, b) => a.localeCompare(b, 'ru')),
      ])
  );
}

export async function getPeopleListData(): Promise<PeopleListData> {
  const root = await getPeopleTree();

  if (!root) {
    return {
      users: [],
      departmentMap: {},
    };
  }

  const rowsByUser = new Map<string, PersonListRow>();
  const departmentMap = new Map<string, Set<string>>();

  for (const leader of root.children) {
    walkLeader(rowsByUser, departmentMap, leader);
  }

  return {
    users: Array.from(rowsByUser.values()).sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    departmentMap: toDepartmentMap(departmentMap),
  };
}

export async function getPeopleList(): Promise<PersonListRow[]> {
  const data = await getPeopleListData();

  return data.users;
}

export async function getDepartmentMap(): Promise<DepartmentMap> {
  const data = await getPeopleListData();

  return data.departmentMap;
}
