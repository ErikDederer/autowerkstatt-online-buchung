import { Star } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export type GoogleReviewsBadgeProps = {
  rating?: number;
  reviewCount?: number;
  profileUrl?: string;
  className?: string;
};

/**
 * Static mock widget. Not connected to the real Google Places API — swap in
 * a live integration later if the fork needs real review data.
 */
export function GoogleReviewsBadge({
  rating = siteConfig.googleReviews.rating,
  reviewCount = siteConfig.googleReviews.reviewCount,
  profileUrl = siteConfig.googleReviews.profileUrl,
  className,
}: GoogleReviewsBadgeProps) {
  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm shadow-sm transition-colors hover:bg-secondary/60 ${className ?? ""}`}
    >
      <svg viewBox="0 0 24 24" className="size-6 shrink-0" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.89c2.28-2.1 3.56-5.2 3.56-8.8z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.89-3c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.94H1.27v3.1C3.25 21.3 7.31 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.61l4.01 3.1C6.23 6.86 8.88 4.75 12 4.75z"
        />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className="flex items-center gap-1 font-semibold">
          {rating.toFixed(1)}
          <span className="flex" role="img" aria-label={`${rating} von 5 Sternen`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                aria-hidden="true"
                className={
                  i < Math.round(rating)
                    ? "size-3.5 fill-accent text-accent"
                    : "size-3.5 text-muted-foreground/30"
                }
              />
            ))}
          </span>
        </span>
        <span className="text-muted-foreground">
          {reviewCount} Google-Rezensionen
        </span>
      </span>
    </a>
  );
}
