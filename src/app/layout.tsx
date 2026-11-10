import "./globals.css";
import { QueryProvider } from "@/components/components/query-provider";

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Usa Borrow',
  description: 'Welcome to Usa Borrow',
  icons: {
    icon: '/logo.png', 
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
