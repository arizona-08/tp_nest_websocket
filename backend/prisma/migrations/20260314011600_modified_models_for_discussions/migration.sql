/*
  Warnings:

  - You are about to drop the `_DiscussionUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DiscussionUsers" DROP CONSTRAINT "_DiscussionUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_DiscussionUsers" DROP CONSTRAINT "_DiscussionUsers_B_fkey";

-- DropTable
DROP TABLE "_DiscussionUsers";

-- CreateTable
CREATE TABLE "DiscussionUsers" (
    "discussionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DiscussionUsers_pkey" PRIMARY KEY ("discussionId","userId")
);

-- AddForeignKey
ALTER TABLE "DiscussionUsers" ADD CONSTRAINT "DiscussionUsers_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionUsers" ADD CONSTRAINT "DiscussionUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
