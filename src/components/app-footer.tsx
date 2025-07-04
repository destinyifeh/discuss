'use client';

import Link from 'next/link';

export const AppFooter = () => {
  return (
    <footer className="py-8 px-4 text-center text-app-gray border-t border-app-border">
      <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto mb-4">
        <Link href="/about" className="hover:underline text-sm">
          About
        </Link>
        <Link href="/help-center" className="hover:underline text-sm">
          Help Center
        </Link>
        <Link href="/terms-of-service" className="hover:underline text-sm">
          Terms of Service
        </Link>
        <Link href="/privacy-policy" className="hover:underline text-sm">
          Privacy Policy
        </Link>

        <Link href="/ads-info" className="hover:underline text-sm">
          Ads info
        </Link>
      </div>
      <p className="text-sm">© 2025 Discussday. All rights reserved.</p>
    </footer>
  );
};
