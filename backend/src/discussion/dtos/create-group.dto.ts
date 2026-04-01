export interface CreateGroupDiscussionDto {
  name: string;
  userIds: string[];
  historyMode: "all" | "from_join";
}