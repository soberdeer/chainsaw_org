DROP TABLE IF EXISTS "Contact" CASCADE;
DROP TABLE IF EXISTS "PersonNodeType" CASCADE;
DROP TABLE IF EXISTS "PersonNodeGroup" CASCADE;
DROP TABLE IF EXISTS "GroupBlock" CASCADE;
DROP TABLE IF EXISTS "PersonNode" CASCADE;
DROP TABLE IF EXISTS "Type" CASCADE;
DROP TABLE IF EXISTS "Group" CASCADE;

CREATE TABLE "PersonNode" (
                              "id" TEXT PRIMARY KEY,
                              "name" TEXT NOT NULL,
                              "job" TEXT,
                              "description" TEXT,
                              "avatar" TEXT,
                              "sortOrder" INTEGER NOT NULL DEFAULT 0,
                              "parentNodeId" TEXT,
                              "parentGroupId" TEXT,
                              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "GroupBlock" (
                              "id" TEXT PRIMARY KEY,
                              "name" TEXT NOT NULL,
                              "sortOrder" INTEGER NOT NULL DEFAULT 0,
                              "ownerNodeId" TEXT NOT NULL
);

CREATE TABLE "Type" (
                        "id" TEXT PRIMARY KEY,
                        "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE "Group" (
                         "id" TEXT PRIMARY KEY,
                         "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE "PersonNodeType" (
                                  "nodeId" TEXT NOT NULL,
                                  "typeId" TEXT NOT NULL,
                                  PRIMARY KEY ("nodeId", "typeId")
);

CREATE TABLE "PersonNodeGroup" (
                                   "nodeId" TEXT NOT NULL,
                                   "groupId" TEXT NOT NULL,
                                   PRIMARY KEY ("nodeId", "groupId")
);

CREATE TABLE "Contact" (
                           "id" TEXT PRIMARY KEY,
                           "nodeId" TEXT NOT NULL,
                           "kind" TEXT NOT NULL,
                           "value" TEXT NOT NULL
);

ALTER TABLE "PersonNode"
    ADD CONSTRAINT "PersonNode_parentNodeId_fkey"
        FOREIGN KEY ("parentNodeId") REFERENCES "PersonNode"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PersonNode"
    ADD CONSTRAINT "PersonNode_parentGroupId_fkey"
        FOREIGN KEY ("parentGroupId") REFERENCES "GroupBlock"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GroupBlock"
    ADD CONSTRAINT "GroupBlock_ownerNodeId_fkey"
        FOREIGN KEY ("ownerNodeId") REFERENCES "PersonNode"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PersonNodeType"
    ADD CONSTRAINT "PersonNodeType_nodeId_fkey"
        FOREIGN KEY ("nodeId") REFERENCES "PersonNode"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PersonNodeType"
    ADD CONSTRAINT "PersonNodeType_typeId_fkey"
        FOREIGN KEY ("typeId") REFERENCES "Type"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PersonNodeGroup"
    ADD CONSTRAINT "PersonNodeGroup_nodeId_fkey"
        FOREIGN KEY ("nodeId") REFERENCES "PersonNode"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PersonNodeGroup"
    ADD CONSTRAINT "PersonNodeGroup_groupId_fkey"
        FOREIGN KEY ("groupId") REFERENCES "Group"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Contact"
    ADD CONSTRAINT "Contact_nodeId_fkey"
        FOREIGN KEY ("nodeId") REFERENCES "PersonNode"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "PersonNode_parentNodeId_idx" ON "PersonNode"("parentNodeId");
CREATE INDEX "PersonNode_parentGroupId_idx" ON "PersonNode"("parentGroupId");
CREATE INDEX "PersonNode_sortOrder_idx" ON "PersonNode"("sortOrder");
CREATE INDEX "GroupBlock_ownerNodeId_idx" ON "GroupBlock"("ownerNodeId");
CREATE INDEX "GroupBlock_sortOrder_idx" ON "GroupBlock"("sortOrder");
CREATE INDEX "Contact_nodeId_idx" ON "Contact"("nodeId");