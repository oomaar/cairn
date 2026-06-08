import { PublicHeader } from "./public-header";
import { Hero } from "./hero";
import { LiveOperation } from "./live-operation";
import { RoutePlanning } from "./route-planning";
import { FieldLog } from "./field-log";
import { Mission } from "./mission";
import { WorldsShowcase } from "./worlds-showcase";
import { LiveUniverse } from "./live-universe";
import { DemoEntry } from "./demo-entry";
import { PublicFooter } from "./public-footer";

/**
 * The public landing page. Runs on the light warm-paper theme (the public
 * surface) and composes the marketing sections — no app shell. Pure
 * orchestration; each section lives in its own file.
 */
export function LandingPage() {
  return (
    <div className="theme-paper flex min-h-full flex-col bg-app text-fg-1">
      <PublicHeader />
      <main className="flex-1">
        <Hero />
        <LiveOperation />
        <RoutePlanning />
        <FieldLog />
        <Mission />
        <WorldsShowcase />
        <LiveUniverse />
        <DemoEntry />
      </main>
      <PublicFooter />
    </div>
  );
}
