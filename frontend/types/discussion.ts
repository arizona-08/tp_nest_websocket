export type Discussion = {
  id: string;
  type: "PRIVATE" | "GROUP";
  name: string;
  lastMessage: string;
}