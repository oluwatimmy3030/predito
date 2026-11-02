import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Outcome {
  price: string;
  name: string;
}

interface Market {
  id?: string;
  question: string;
  outcomes: Outcome[] | string;
  volume: string;
  end_date_iso?: string;
  endDateIso?: string;
  tags?: string[];
}

interface MarketCardProps {
  market: Market;
}

const MarketCard = ({ market }: MarketCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (market.id) {
      navigate(`/market/${market.id}`);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (market.id && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      handleClick();
    }
  };

  const formatVolume = (volume: string) => {
    const num = parseFloat(volume);
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  const formatPrice = (price: string) => {
    return `${(parseFloat(price) * 100).toFixed(1)}%`;
  };

  const getTimeRemaining = (endDate: string) => {
    try {
      return formatDistanceToNow(new Date(endDate), { addSuffix: true });
    } catch {
      return "Date unavailable";
    }
  };

  // Normalize outcomes - handle both string and array formats
  let outcomesArray: Outcome[] = [];
  if (typeof market.outcomes === 'string') {
    try {
      const parsed = JSON.parse(market.outcomes);
      outcomesArray = parsed.map((name: string) => ({ name, price: "0.5" }));
    } catch {
      outcomesArray = [];
    }
  } else if (Array.isArray(market.outcomes)) {
    outcomesArray = market.outcomes;
  }

  // Use endDateIso or end_date_iso
  const endDate = market.endDateIso || market.end_date_iso || "";

  return (
    <Card
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={market.id ? "link" : undefined}
      tabIndex={market.id ? 0 : undefined}
      aria-label={market.id ? `View market: ${market.question}` : undefined}
      className="p-5 sm:p-6 hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 cursor-pointer group bg-card border-border"
    >
      <div className="space-y-4">
        {/* Tags */}
        {market.tags && market.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {market.tags.slice(0, 2).map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Question */}
        <h3 className="text-base font-semibold text-card-foreground line-clamp-3 group-hover:text-primary transition-colors">
          {market.question}
        </h3>

        {/* Outcomes */}
        <div className="space-y-2">
          {outcomesArray.slice(0, 2).map((outcome, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{outcome.name}</span>
              <span className="text-sm font-semibold text-foreground">
                {formatPrice(outcome.price)}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{getTimeRemaining(endDate)}</span>
          </div>
          <div className="text-xs font-medium text-muted-foreground">
            Vol: {formatVolume(market.volume)}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MarketCard;