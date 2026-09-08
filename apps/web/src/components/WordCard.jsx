import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils.js';
import { useLanguage } from '@/hooks/useLanguage.js';

const WordCard = ({ word, wildcardIndices = [], index, points, isSuccess, onClick }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const wildcardSet = new Set(wildcardIndices);

  const handleClick = async () => {
    if (onClick) {
      onClick(word, wildcardIndices);
    }
    
    try {
      await navigator.clipboard.writeText(word);
      setCopied(true);
      toast.success(t('ui.wordCopied'));
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error(t('ui.copyFailed'));
    }
  };

  const colorVariants = [
    {
      card: "bg-primary text-primary-foreground border-primary-foreground/10 hover:shadow-primary/25",
      badge: "bg-white/20 text-white",
      icon: "text-white/70 group-hover:text-white",
      subtext: "text-primary-foreground/80"
    },
    {
      card: "bg-secondary text-secondary-foreground border-secondary-foreground/10 hover:shadow-secondary/25",
      badge: "bg-black/10 text-black",
      icon: "text-black/50 group-hover:text-black",
      subtext: "text-secondary-foreground/70"
    },
    {
      card: "bg-accent text-accent-foreground border-accent-foreground/10 hover:shadow-accent/25",
      badge: "bg-white/20 text-white",
      icon: "text-white/70 group-hover:text-white",
      subtext: "text-accent-foreground/80"
    }
  ];

  const variant = colorVariants[index % colorVariants.length];
  
  const delayMs = Math.min((index + 1) * 100, 1000);
  const delayClass = `animation-delay-${delayMs}`;
  
  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative rounded-2xl p-6 shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-[1.02] border h-full flex flex-col",
        variant.card,
        "animate-fadeInSlideUp",
        delayClass,
        isSuccess && "animate-successPulse pointer-events-none"
      )}
    >
      <h3 className="text-2xl font-bold break-words tracking-tight">
        {word.split('').map((letter, i) => (
          <span
            key={i}
            className={wildcardSet.has(i) ? "opacity-40" : undefined}
            title={wildcardSet.has(i) ? "Wildcard letter — scores 0 points" : undefined}
          >
            {letter}
          </span>
        ))}
      </h3>

      <div className="flex items-center justify-between gap-3 mt-auto pt-3 flex-wrap">
        <p className={cn("text-sm font-medium", variant.subtext)}>
          {t('ui.clickToClaim')}
        </p>

        <div className="flex items-center gap-2 flex-shrink-0">
          {points !== undefined && (
            <span className="scrabble-points px-2 py-1 rounded-lg text-xs" title="Scrabble Points">
              {points} pts
            </span>
          )}
          <span className={cn("inline-flex items-center justify-center px-3 py-1 rounded-xl text-sm font-bold", variant.badge)} title="Word Length">
            {word.length}
          </span>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {copied ? (
              <Check className={cn("w-5 h-5", variant.icon)} />
            ) : (
              <Copy className={cn("w-5 h-5", variant.icon)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCard;