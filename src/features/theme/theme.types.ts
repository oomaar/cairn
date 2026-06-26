/**
 * Theme system types.
 *
 * Cairn is organized into three operational "worlds", framed by a constant
 * neutral spine. Each world re-skins the shared design tokens (see the
 * `.world-*` scopes in globals.css) so the same utilities restyle per world.
 */

/** The three operational worlds the product is organized around. */
export type WorldKey = "plan" | "operate" | "record";

/** A module is a workspace within a world (the canvas top-bar tabs). */
export interface WorldModule {
  /** Stable identifier, also used as a route segment. */
  readonly key: string;
  /** Human label shown in the module tab. */
  readonly label: string;
  /** When set, the tab is hidden (and the route blocked) for roles that lack
   *  this capability. Matches the Capability union from the session layer. */
  readonly requiredCapability?: string;
}

/** A world definition: identity, the body class that activates its palette,
 *  and the spine accent used by the constant shell. */
export interface World {
  /** Stable identifier, also used as a route segment. */
  readonly key: WorldKey;
  /** Human label shown in the spine. */
  readonly label: string;
  /** One-line description of the world's purpose. */
  readonly description: string;
  /** Icon name (from the shared icon set) used in the spine. */
  readonly icon: string;
  /** Class that activates this world's palette on a wrapping element. */
  readonly scopeClass: `world-${WorldKey}`;
  /** Accent color the constant spine uses to mark this world. */
  readonly spineAccent: string;
  /** Workspaces within the world, in tab order. */
  readonly modules: readonly WorldModule[];
  /** Module the world opens on. */
  readonly defaultModule: string;
}

/** Opt-in surface themes that are independent of the active world. */
export type SurfaceTheme = "app" | "paper";
