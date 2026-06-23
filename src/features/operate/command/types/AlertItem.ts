import type { IconName } from "@/components/ui";

export interface AlertItem {
  id: string;
  icon: IconName;
  tone: string;
  title: string;
  context: string;
  time: string;
  body?: string;
}
