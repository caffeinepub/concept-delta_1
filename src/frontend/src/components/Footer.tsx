import { SiYoutube, SiTelegram } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'concept-delta'
  );

  return (
    <footer className="border-t border-border bg-white dark:bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Left side: Copyright and initiative */}
          <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
            <p className="text-sm font-semibold text-brand-navy">
              Concept Delta © {currentYear}
            </p>
            <p className="text-sm text-muted-foreground">COEPian Initiative</p>
          </div>

          {/* Center: Social links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-brand-navy transition-colors hover:text-brand-blue"
              aria-label="YouTube"
            >
              <SiYoutube className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-brand-navy transition-colors hover:text-brand-blue"
              aria-label="Telegram"
            >
              <SiTelegram className="h-6 w-6" />
            </a>
          </div>

          {/* Right side: Attribution */}
          <div className="text-center text-sm text-muted-foreground md:text-right">
            Built with <Heart className="inline h-4 w-4 fill-red-500 text-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-navy hover:text-brand-blue"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
