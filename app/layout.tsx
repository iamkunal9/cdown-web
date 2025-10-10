import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "cdown - Smart Contract Downloader",
    template: "%s | cdown"
  },
  description: "Download smart contract source code from multiple blockchain networks. Extract contract metadata, ABI, and source code with ease.",
  keywords: [
    "smart contracts",
    "blockchain",
    "ethereum",
    "contract downloader",
    "solidity",
    "web3",
    "defi",
    "contract source code",
    "ABI",
    "metadata"
  ],
  authors: [{ name: "iamkunal9", url: "https://iamkunal9.in" }],
  creator: "iamkunal9",
  publisher: "iamkunal9",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://cdown.iamkunal9.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cdown.iamkunal9.in",
    title: "cdown - Smart Contract Downloader",
    description: "Download smart contract source code from multiple blockchain networks. Extract contract metadata, ABI, and source code with ease.",
    siteName: "cdown",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "cdown - Smart Contract Downloader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "cdown - Smart Contract Downloader",
    description: "Download smart contract source code from multiple blockchain networks. Extract contract metadata, ABI, and source code with ease.",
    images: ["/og-image.svg"],
    creator: "@iamkunal9",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "cdown",
    "description": "Download smart contract source code from multiple blockchain networks. Extract contract metadata, ABI, and source code with ease.",
    "url": "https://cdown.iamkunal9.in",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "iamkunal9",
      "url": "https://iamkunal9.in"
    },
    "keywords": "smart contracts, blockchain, ethereum, contract downloader, solidity, web3, defi",
    "inLanguage": "en-US"
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
