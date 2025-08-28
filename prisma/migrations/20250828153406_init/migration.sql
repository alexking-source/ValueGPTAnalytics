-- CreateTable
CREATE TABLE "UsageEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "accountName" TEXT,
    "functionUsed" TEXT NOT NULL,
    "salesforceOpportunityId" TEXT,
    "contentEdits" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
