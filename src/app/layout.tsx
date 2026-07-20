import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { BRAND, OFFERS } from "@/config/brand";

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0d0d0b",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND.name,
  url: BRAND.siteUrl,
  slogan: BRAND.headline,
  description: BRAND.description,
  email: BRAND.email,
  makesOffer: OFFERS.map((offer) => ({
    "@type": "Offer",
    name: offer.name,
    price: offer.price.match(/[\d,]+/)?.[0].replaceAll(",", ""),
    priceCurrency: "USD",
    description: offer.promise,
  })),
};

export const metadata: Metadata = {
  applicationName: BRAND.name,
  title: {
    default: `${BRAND.name} — ${BRAND.headline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.socialDescription,
  metadataBase: new URL(BRAND.siteUrl),
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.headline}`,
    description: BRAND.socialDescription,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.headline}`,
    description: BRAND.socialDescription,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://is1-ssl.mzstatic.com" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </head>
      <body className="font-sans antialiased">
        <a href="#main" className="skip-link">Skip to content</a>
       {children}
        <Footer />
      </body>
    </html>
  );
}
