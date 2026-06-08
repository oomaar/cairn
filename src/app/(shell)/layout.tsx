import { ShellLayout } from "@/features/shell";

/** Wraps every world/module route in the persistent application shell. */
export default function ShellGroupLayout({ children }: LayoutProps<"/">) {
  return <ShellLayout>{children}</ShellLayout>;
}
