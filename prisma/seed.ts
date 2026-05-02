import 'dotenv/config';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@/generated/prisma/client';
import { mock } from './mock';

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL_UNPOOLED!,
});

const prisma = new PrismaClient({
  adapter,
});

type MockNode = {
  name: string;
  type?: string[];
  group?: string[];
  job?: string | null;
  description?: string | null;
  avatar?: string | null;
  contacts?: Record<string, string | undefined>;
  children?: MockNode[];
  groupedChildren?: MockGroup[];
};

type MockGroup = {
  name: string;
  children?: MockNode[];
};

async function upsertType(name: string) {
  return prisma.type.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function upsertGroup(name: string) {
  return prisma.group.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function createNode(
  node: MockNode,
  sortOrder: number,
  parentNodeId: string | null,
  parentGroupId: string | null
) {
  const createdNode = await prisma.personNode.create({
    data: {
      name: node.name,
      job: node.job ?? null,
      description: node.description ?? null,
      avatar: node.avatar ?? null,
      sortOrder,
      parentNodeId,
      parentGroupId,
    },
  });

  for (const typeName of node.type ?? []) {
    const type = await upsertType(typeName);

    await prisma.personNodeType.create({
      data: {
        nodeId: createdNode.id,
        typeId: type.id,
      },
    });
  }

  for (const groupName of node.group ?? []) {
    const group = await upsertGroup(groupName);

    await prisma.personNodeGroup.create({
      data: {
        nodeId: createdNode.id,
        groupId: group.id,
      },
    });
  }

  for (const [kind, value] of Object.entries(node.contacts ?? {})) {
    if (!value) {
      continue;
    }

    await prisma.contact.create({
      data: {
        nodeId: createdNode.id,
        kind,
        value,
      },
    });
  }

  for (const [childIndex, child] of (node.children ?? []).entries()) {
    await createNode(child, childIndex, createdNode.id, null);
  }

  for (const [groupIndex, group] of (node.groupedChildren ?? []).entries()) {
    const createdGroup = await prisma.groupBlock.create({
      data: {
        name: group.name,
        sortOrder: groupIndex,
        ownerNodeId: createdNode.id,
      },
    });

    for (const [childIndex, child] of (group.children ?? []).entries()) {
      await createNode(child, childIndex, null, createdGroup.id);
    }
  }

  return createdNode;
}

async function main() {
  await prisma.contact.deleteMany();
  await prisma.personNodeType.deleteMany();
  await prisma.personNodeGroup.deleteMany();
  await prisma.groupBlock.deleteMany();
  await prisma.personNode.deleteMany();
  await prisma.type.deleteMany();
  await prisma.group.deleteMany();

  await createNode(mock as MockNode, 0, null, null);

  // eslint-disable-next-line
  console.log({
    nodes: await prisma.personNode.count(),
    groupBlocks: await prisma.groupBlock.count(),
    types: await prisma.type.count(),
    groups: await prisma.group.count(),
    contacts: await prisma.contact.count(),
  });
}

main()
  .catch((error) => {
    // eslint-disable-next-line
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
