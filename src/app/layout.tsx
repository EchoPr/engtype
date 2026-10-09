import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Newsreader } from "next/font/google";
import { THEME_INIT_SCRIPT } from "@/lib/theme-script";
import { SITE_URL } from "@/lib/site";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/header";
import "./globals.css";

const serif = Newsreader({ variable: "--font-serif-app", subsets: ["latin"], axes: ["opsz"] });
const display = Instrument_Serif({ variable: "--font-display-app", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const mono = JetBrains_Mono({ variable: "--font-mono-app", subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "engtype", template: "%s · engtype" },
  description: "Minimal English writing trainer: IELTS / TOEFL style tasks A1-C2 with detailed feedback.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${serif.variable} ${display.variable} ${mono.variable} h-full antialiased`}>
      <head>
        {/* sets the dark/light class before first paint */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col transition-colors duration-500">
        <TooltipProvider>
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 sm:px-10">
            <Header />
            <main className="flex flex-1 flex-col pb-16">{children}</main>
            <footer className="border-t border-sub/20 py-6 font-mono text-[11px] leading-relaxed text-sub">
              Scores are estimates, not official results. engtype is an independent practice tool and is not affiliated with,
              endorsed or approved by the IELTS Partners (British Council, IDP: IELTS Australia, Cambridge University Press &amp;
              Assessment) or ETS. IELTS is a registered trademark of the IELTS Partners. TOEFL® is a registered trademark of ETS.
              This product is not endorsed or approved by ETS.
            </footer>
          </div>
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
