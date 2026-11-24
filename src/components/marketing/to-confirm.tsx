import r from "./reading-page.module.css";

/**
 * A fact that is not locked yet (see OPEN-FACTS.md). Renders the literal "[TE BEVESTIGEN: …]" text.
 * Pages that still use this must not be published to production.
 */
export function ToConfirm({ children }: { children: string }) {
  return <span className={r.placeholder}>[TE BEVESTIGEN: {children}]</span>;
}
