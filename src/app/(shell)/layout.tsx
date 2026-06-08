import { ShellLayout } from "@/features/shell";
import { readDemoRole } from "@/features/session/fake-auth.server";

/** Wraps every world/module route in the persistent application shell, seeded
 *  with the visitor's chosen demo identity (if any). */
export default async function ShellGroupLayout({ children }: LayoutProps<"/">) {
  const initialRole = await readDemoRole();
  return <ShellLayout initialRole={initialRole}>{children}</ShellLayout>;
}
