import { prisma } from '@/lib/prisma';

export type PersonTreeGroup = {
  name: string;
  children: PersonTreeNode[];
};

export type PersonTreeNode = {
  id: string;
  name: string;
  job: string | null;
  description: string | null;
  avatar: string | null;
  type: string[];
  group: string[];
  contacts: Record<string, string>;
  children: PersonTreeNode[];
  groupedChildren: PersonTreeGroup[];
};

type LoadedNode = Awaited<ReturnType<typeof loadNodes>>[number];

async function loadNodes() {
  return prisma.personNode.findMany({
    include: {
      contacts: true,
      types: {
        include: {
          type: true,
        },
      },
      groups: {
        include: {
          group: true,
        },
      },
      groupedChildren: {
        orderBy: {
          sortOrder: 'asc',
        },
        include: {
          children: {
            include: {
              contacts: true,
              types: {
                include: {
                  type: true,
                },
              },
              groups: {
                include: {
                  group: true,
                },
              },
              groupedChildren: {
                orderBy: {
                  sortOrder: 'asc',
                },
                include: {
                  children: {
                    include: {
                      contacts: true,
                      types: {
                        include: {
                          type: true,
                        },
                      },
                      groups: {
                        include: {
                          group: true,
                        },
                      },
                    },
                    orderBy: {
                      sortOrder: 'asc',
                    },
                  },
                },
              },
            },
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      },
    },
    orderBy: {
      sortOrder: 'asc',
    },
  });
}

function toTreeNode(
  node: LoadedNode,
  childrenByParentNodeId: Map<string, LoadedNode[]>,
): PersonTreeNode {
  return {
    id: node.id,
    name: node.name,
    job: node.job,
    description: node.description,
    avatar: node.avatar,
    type: node.types.map((item) => item.type.name),
    group: node.groups.map((item) => item.group.name),
    contacts: Object.fromEntries(
      node.contacts.map((contact) => [contact.kind, contact.value]),
    ),
    children: (childrenByParentNodeId.get(node.id) ?? []).map((child) =>
      toTreeNode(child, childrenByParentNodeId),
    ),
    groupedChildren: (node.groupedChildren ?? []).map((group) => ({
      name: group.name,
      children: (group.children ?? []).map((child) =>
        toTreeNode(child as LoadedNode, childrenByParentNodeId),
      ),
    })),
  };
}

export async function getPeopleTree(): Promise<PersonTreeNode | null> {
  const nodes = await loadNodes();

  const childrenByParentNodeId = new Map<string, LoadedNode[]>();

  for (const node of nodes) {
    if (!node.parentNodeId) {
      continue;
    }

    const children = childrenByParentNodeId.get(node.parentNodeId) ?? [];
    children.push(node);
    childrenByParentNodeId.set(node.parentNodeId, children);
  }

  const root = nodes.find(
    (node) => node.parentNodeId === null && node.parentGroupId === null,
  );

  if (!root) {
    return null;
  }

  return toTreeNode(root, childrenByParentNodeId);
}