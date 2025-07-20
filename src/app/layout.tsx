// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Red Menu Scanner App",
  description: "Menu Scanner Application",
};

// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
