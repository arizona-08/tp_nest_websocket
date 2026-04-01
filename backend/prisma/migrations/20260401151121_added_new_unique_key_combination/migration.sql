/*
  Warnings:

  - A unique constraint covering the columns `[userId,messageId,reaction]` on the table `MessageReaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MessageReaction_userId_messageId_reaction_key" ON "MessageReaction"("userId", "messageId", "reaction");
