import { Heart, Instagram } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;
  return (
    <footer className="border-t border-border py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded ig-gradient flex items-center justify-center">
            <Instagram className="w-3 h-3 text-white" />
          </div>
          <span className="font-display font-semibold ig-gradient-text">
            InstaBoost
          </span>
          <span>— Grow your Instagram presence instantly</span>
        </div>
        <div className="flex items-center gap-1">
          <span>© {year}. Built with</span>
          <Heart className="w-3.5 h-3.5 text-accent fill-accent" />
          <span>using</span>
          <a
            href={utm}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors underline underline-offset-2"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
