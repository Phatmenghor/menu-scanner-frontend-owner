// app/layout.tsx (optional - some setups don't need this)
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// Since we have a `[locale]` layout, the root layout must
// not render the HTML element, as that's handled by the locale layout
export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">{children}</body>
    </html>
  );
}
