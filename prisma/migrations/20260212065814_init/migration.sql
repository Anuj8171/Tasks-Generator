-- CreateTable
CREATE TABLE "Spec" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goal" TEXT NOT NULL,
    "users" TEXT NOT NULL,
    "constraints" TEXT NOT NULL,
    "stories" TEXT NOT NULL,
    "tasks" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
