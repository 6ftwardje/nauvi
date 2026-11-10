import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nauvi — Je bedrijf klaar voor AI-agents",
  description:
    "Jij deelt hoe je bedrijf werkt. Wij brengen je kennis samen in je Company Brain en bouwen agents die taken overnemen.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl-BE">
      <body>{children}</body>
    </html>
  );
}
