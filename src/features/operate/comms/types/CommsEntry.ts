export interface CommsEntry {
  id: string;
  expeditionId: string | null;
  expeditionCode: string;
  time: string;
  kind: "message" | "alert";
  text: string;
  senderInitials: string;
  senderName: string;
  senderTone: string;
}
