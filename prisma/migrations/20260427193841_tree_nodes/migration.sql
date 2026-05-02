/*
  Warnings:

  - You are about to drop the column `personId` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nodeId` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_personId_fkey";

-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_parentId_fkey";

-- DropForeignKey
ALTER TABLE "PersonGroup" DROP CONSTRAINT "PersonGroup_groupId_fkey";

-- DropForeignKey
ALTER TABLE "PersonGroup" DROP CONSTRAINT "PersonGroup_personId_fkey";

-- DropForeignKey
ALTER TABLE "PersonType" DROP CONSTRAINT "PersonType_personId_fkey";

-- DropForeignKey
ALTER TABLE "PersonType" DROP CONSTRAINT "PersonType_typeId_fkey";

-- DropIndex
DROP INDEX "Contact_personId_idx";

-- DropIndex
DROP INDEX "Contact_personId_kind_key";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "personId",
ADD COLUMN     "nodeId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Person";

-- DropTable
DROP TABLE "PersonGroup";

-- DropTable
DROP TABLE "PersonType";

-- CreateTable
CREATE TABLE "PersonNode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "job" TEXT,
    "description" TEXT,
    "avatar" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "parentNodeId" TEXT,
    "parentGroupId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupBlock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "ownerNodeId" TEXT NOT NULL,

    CONSTRAINT "GroupBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonNodeType" (
    "nodeId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,

    CONSTRAINT "PersonNodeType_pkey" PRIMARY KEY ("nodeId","typeId")
);

-- CreateTable
CREATE TABLE "PersonNodeGroup" (
    "nodeId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "PersonNodeGroup_pkey" PRIMARY KEY ("nodeId","groupId")
);

-- CreateIndex
CREATE INDEX "PersonNode_parentNodeId_idx" ON "PersonNode"("parentNodeId");

-- CreateIndex
CREATE INDEX "PersonNode_parentGroupId_idx" ON "PersonNode"("parentGroupId");

-- CreateIndex
CREATE INDEX "PersonNode_sortOrder_idx" ON "PersonNode"("sortOrder");

-- CreateIndex
CREATE INDEX "GroupBlock_ownerNodeId_idx" ON "GroupBlock"("ownerNodeId");

-- CreateIndex
CREATE INDEX "GroupBlock_sortOrder_idx" ON "GroupBlock"("sortOrder");

-- CreateIndex
CREATE INDEX "Contact_nodeId_idx" ON "Contact"("nodeId");

-- AddForeignKey
ALTER TABLE "PersonNode" ADD CONSTRAINT "PersonNode_parentNodeId_fkey" FOREIGN KEY ("parentNodeId") REFERENCES "PersonNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonNode" ADD CONSTRAINT "PersonNode_parentGroupId_fkey" FOREIGN KEY ("parentGroupId") REFERENCES "GroupBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupBlock" ADD CONSTRAINT "GroupBlock_ownerNodeId_fkey" FOREIGN KEY ("ownerNodeId") REFERENCES "PersonNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonNodeType" ADD CONSTRAINT "PersonNodeType_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "PersonNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonNodeType" ADD CONSTRAINT "PersonNodeType_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonNodeGroup" ADD CONSTRAINT "PersonNodeGroup_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "PersonNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonNodeGroup" ADD CONSTRAINT "PersonNodeGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "PersonNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
