-- Add indexes for Dataset (userId, userId+createdAt) and DatasetSchema (datasetId),
-- a unique constraint on (datasetId, columnName), a unique on Dataset.tableName,
-- and switch FKs to ON DELETE CASCADE so deleting a user/dataset removes children.

ALTER TABLE "Dataset" DROP CONSTRAINT IF EXISTS "Dataset_userId_fkey";
ALTER TABLE "DatasetSchema" DROP CONSTRAINT IF EXISTS "DatasetSchema_datasetId_fkey";

ALTER TABLE "Dataset"
    ADD CONSTRAINT "Dataset_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DatasetSchema"
    ADD CONSTRAINT "DatasetSchema_datasetId_fkey"
    FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS "Dataset_tableName_key" ON "Dataset"("tableName");
CREATE INDEX IF NOT EXISTS "Dataset_userId_idx" ON "Dataset"("userId");
CREATE INDEX IF NOT EXISTS "Dataset_userId_createdAt_idx" ON "Dataset"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "DatasetSchema_datasetId_idx" ON "DatasetSchema"("datasetId");
CREATE UNIQUE INDEX IF NOT EXISTS "DatasetSchema_datasetId_columnName_key" ON "DatasetSchema"("datasetId", "columnName");
