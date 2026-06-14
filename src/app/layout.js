import "./globals.css";
import { AppProvider } from "../context/AppContext";
import ClientLayout from "../components/ClientLayout";

export const metadata = {
  title: "PasaBUYan | Grocery, Food & Shops Delivery App",
  description: "Order groceries, meals, pantry essentials, and boutique items with PasaBUYan on-demand delivery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <AppProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AppProvider>
      </body>
    </html>
  );
}
