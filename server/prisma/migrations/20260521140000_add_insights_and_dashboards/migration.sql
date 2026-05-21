CREATE TABLE "SavedInsight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sql" TEXT NOT NULL,
    "chartType" TEXT NOT NULL,
    "overview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedInsight_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Dashboard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DashboardItem" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "savedInsightId" TEXT NOT NULL,
    "x" INTEGER NOT NULL DEFAULT 0,
    "y" INTEGER NOT NULL DEFAULT 0,
    "w" INTEGER NOT NULL DEFAULT 6,
    "h" INTEGER NOT NULL DEFAULT 4,
    CONSTRAINT "DashboardItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SavedInsight_userId_createdAt_idx" ON "SavedInsight"("userId", "createdAt");
CREATE INDEX "SavedInsight_datasetId_idx" ON "SavedInsight"("datasetId");
CREATE INDEX "Dashboard_userId_updatedAt_idx" ON "Dashboard"("userId", "updatedAt");
CREATE INDEX "DashboardItem_dashboardId_idx" ON "DashboardItem"("dashboardId");

ALTER TABLE "SavedInsight" ADD CONSTRAINT "SavedInsight_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SavedInsight" ADD CONSTRAINT "SavedInsight_datasetId_fkey"
    FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DashboardItem" ADD CONSTRAINT "DashboardItem_dashboardId_fkey"
    FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DashboardItem" ADD CONSTRAINT "DashboardItem_savedInsightId_fkey"
    FOREIGN KEY ("savedInsightId") REFERENCES "SavedInsight"("id") ON DELETE CASCADE ON UPDATE CASCADE;
