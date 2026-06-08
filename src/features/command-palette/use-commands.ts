import { useMemo } from "react";
import type { IconName } from "@/components/ui";
import { useNavigation } from "@/features/navigation";
import { ROLES, useSession, type Capability } from "@/features/session";
import { WORLDS } from "@/features/theme";
import { listExpeditions } from "@/universe";
import type { Command } from "./command.types";

/**
 * Build the command set from the live app state: every world and workspace,
 * every expedition in the universe, role switching, and capability-gated
 * actions. Actions appear only when the active role is allowed to run them.
 */
export function useCommands(): Command[] {
  const nav = useNavigation();
  const { can, setRole } = useSession();

  return useMemo(() => {
    const commands: Command[] = [];

    // Worlds
    for (const world of WORLDS) {
      commands.push({
        id: `world:${world.key}`,
        label: `Go to ${world.label}`,
        group: "Worlds",
        icon: world.icon as IconName,
        hint: world.description,
        keywords: `${world.key} ${world.description}`,
        perform: () => nav.goTo(world.key),
      });
    }

    // Workspaces (every module across every world)
    for (const world of WORLDS) {
      for (const mod of world.modules) {
        commands.push({
          id: `module:${world.key}:${mod.key}`,
          label: `${world.label}: ${mod.label}`,
          group: "Workspaces",
          icon: world.icon as IconName,
          keywords: `${world.label} ${mod.label}`,
          perform: () => nav.goTo(world.key, mod.key),
        });
      }
    }

    // Expeditions (from the universe) — focus + open in Operate
    for (const expedition of listExpeditions()) {
      commands.push({
        id: `expedition:${expedition.id}`,
        label: expedition.name,
        group: "Expeditions",
        icon: "pin",
        hint: `${expedition.region} · ${expedition.statusLabel}`,
        keywords: `${expedition.region} ${expedition.country} ${expedition.statusLabel}`,
        perform: () => {
          nav.focusExpedition(expedition.id);
          nav.goTo("operate", "command");
        },
      });
    }

    // Switch role
    for (const role of ROLES) {
      commands.push({
        id: `role:${role.key}`,
        label: `View as ${role.label}`,
        group: "Switch role",
        icon: "users",
        keywords: `role ${role.key}`,
        perform: () => setRole(role.key),
      });
    }

    // Capability-gated actions
    const action = (capability: Capability, command: Command) => {
      if (can(capability)) commands.push(command);
    };
    action("expeditions:create", {
      id: "action:new-expedition",
      label: "New expedition",
      group: "Actions",
      icon: "plus",
      keywords: "create add plan",
      perform: () => nav.goTo("plan", "builder"),
    });
    action("risk:manage", {
      id: "action:risk-center",
      label: "Open risk center",
      group: "Actions",
      icon: "shield",
      keywords: "hazard mitigation",
      perform: () => nav.goTo("operate", "risk"),
    });
    action("incident:log", {
      id: "action:log-incident",
      label: "Log incident",
      group: "Actions",
      icon: "alert",
      keywords: "report field",
      perform: () => nav.goTo("record", "incidents"),
    });
    action("comms:broadcast", {
      id: "action:broadcast",
      label: "Broadcast announcement",
      group: "Actions",
      icon: "radio",
      keywords: "announce message all",
      perform: () => nav.goTo("operate", "command"),
    });

    return commands;
  }, [nav, can, setRole]);
}
