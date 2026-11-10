/** Join optional class names for CSS Modules and reusable UI components. */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
