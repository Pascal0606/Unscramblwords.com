import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RotateCcw, Zap, Trophy, X } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import { Toaster } from '@/components/ui/sonner.jsx';

// Custom Components
import WordCard from '@/components/WordCard.jsx';
import HelpSection from '@/components/HelpSection.jsx';
import ScrabbleBackground from '@/components/ScrabbleBackground.jsx';
import LanguageSelector from '@/components/LanguageSelector.jsx';

// Hooks & Utils
import { useWordUnscrambler } from '@/hooks/useWordUnscrambler.js';
import { calculateScrabblePoints } from '@/lib/calculateScrabblePoints.js';
import { useLanguage } from '@/hooks/useLanguage.js';

const FilterPanelLocal = ({ filters, clearFilters, t }) => {
  const activeKeys = ['startsWith', 'endsWith', 'contains', 'requiredLetter', 'wordLength'];
  const hasActiveFilters = activeKeys.some(key => filters[key] !== '' && filters[key] !== undefined);

  if (!hasActiveFilters) return null;

  return (
    <div className="bg-card border-2 border-border rounded-2xl py-3 px-4 shadow-sm mb-6 flex flex-wrap gap-2 items-center justify-start min-h-[56px]">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex flex-wrap gap-2 flex-1 items-center"
        >
          {filters.startsWith && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs">
              {t('filters.startsWith')}: {filters.startsWith.toUpperCase()}
            </span>
          )}
          {filters.endsWith && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-secondary/20 text-secondary-foreground font-bold text-xs">
              {t('filters.endsWith')}: {filters.endsWith.toUpperCase()}
            </span>
          )}
          {filters.contains && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-accent/10 text-accent font-bold text-xs">
              {t('filters.contains')}: {filters.contains.toUpperCase()}
            </span>
          )}
          {filters.requiredLetter && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs">
              {t('filters.required')}: {filters.requiredLetter.toUpperCase()}
            </span>
          )}
          {filters.wordLength && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-accent/10 text-accent font-bold text-xs">
              {t('filters.length')}: {filters.wordLength}
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 px-2 text-xs font-bold text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg ml-1"
          >
            <X className="w-3 h-3 mr-1" />
            {t('filters.clearFilters')}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ScrabbleTileTitleLocal = ({ title1, title2 }) => (
  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-2 select-none">
    <div className="flex gap-1">
      {title1.split('').map((letter, i) => (
        <div key={`word1-${i}`} className="bg-[#fdfbf7] text-foreground w-8 h-10 sm:w-10 sm:h-12 md:w-12 md:h-14 rounded-md shadow-md border-2 border-[#e6d5c3] flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold relative">
          {letter}
          <span className="absolute bottom-1 right-1 text-[8px] sm:text-[10px] text-muted-foreground font-semibold">1</span>
        </div>
      ))}
    </div>
    <div className="flex gap-1">
      {title2.split('').map((letter, i) => (
        <div key={`word2-${i}`} className="bg-[#fdfbf7] text-foreground w-8 h-10 sm:w-10 sm:h-12 md:w-12 md:h-14 rounded-md shadow-md border-2 border-[#e6d5c3] flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold relative">
          {letter}
          <span className="absolute bottom-1 right-1 text-[8px] sm:text-[10px] text-muted-foreground font-semibold">1</span>
        </div>
      ))}
    </div>
  </div>
);

const UnscrambleApp = () => {
  const { t, currentLanguage } = useLanguage();
  const [inputValue, setInputValue] = useState('');

  const [score, setScore] = useState(0);
  const [scoreKey, setScoreKey] = useState(0);
  const [animatingWords, setAnimatingWords] = useState([]);
  const [claimedWords, setClaimedWords] = useState([]);

  const {
    words,
    isLoading,
    unscramble,
    reset,
    filters,
    updateFilters,
    clearFilters
  } = useWordUnscrambler(currentLanguage);

  useEffect(() => {
    if (inputValue.trim()) {
      setClaimedWords([]);
      setAnimatingWords([]);
      unscramble(inputValue);
    } else {
      reset();
    }
  }, [currentLanguage, unscramble, reset]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (inputValue.trim()) {
      setClaimedWords([]);
      setAnimatingWords([]);
      unscramble(inputValue);
    }
  };

  const handleReset = () => {
    setInputValue('');
    setClaimedWords([]);
    setAnimatingWords([]);
    reset();
  };

  const handleWordClaim = (word) => {
    if (animatingWords.includes(word) || claimedWords.includes(word)) return;

    setAnimatingWords(prev => [...prev, word]);

    setTimeout(() => {
      setAnimatingWords(prev => prev.filter(w => w !== word));
      setClaimedWords(prev => [...prev, word]);
      const pointsEarned = calculateScrabblePoints(word, currentLanguage);
      setScore(prev => prev + pointsEarned);
      setScoreKey(prev => prev + 1);
    }, 800);
  };

  const handleFilterChange = (field, value) => {
    const cleanValue = field === 'wordLength'
      ? value.replace(/[^0-9]/g, '')
      : value.replace(/[^\p{L}]/gu, '');
    updateFilters({ [field]: cleanValue });
  };

  const hasSearched = words.length > 0 || isLoading || Object.values(filters).some(f => f !== '');
  const hasActiveFilters = Object.values(filters).some(f => f !== '');

  const displayWords = words
    .filter(word => !claimedWords.includes(word))
    .sort((a, b) => calculateScrabblePoints(b, currentLanguage) - calculateScrabblePoints(a, currentLanguage));

  return (
    <>
      <Helmet>
        <title>{t('ui.seoTitle')}</title>
        <meta name="description" content={t('ui.seoDescription')} />
        <meta property="og:title" content={t('ui.seoTitle')} />
        <meta property="og:description" content={t('ui.seoDescription')} />
        <meta name="twitter:title" content={t('ui.seoTitle')} />
        <meta name="twitter:description" content={t('ui.seoDescription')} />
        <link rel="canonical" href={`https://unscramblwords.com/${currentLanguage}`} />
        <html lang={currentLanguage} />
      </Helmet>

      <Toaster position="top-center" />

      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, #f5e6d3 0%, #e8f4f8 100%)',
          filter: 'blur(25px)',
          zIndex: -1
        }}
        aria-hidden="true"
      />

      <div className="min-h-screen overflow-x-hidden relative z-10">
        <ScrabbleBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 lg:pb-16">

          <div className="flex justify-between items-center mb-6 sticky top-4 z-50">
            <LanguageSelector />
            <div className="bg-card/95 backdrop-blur-md border border-border shadow-lg rounded-2xl px-6 py-3 flex items-center gap-4 transition-all">
              <div className="bg-primary/10 p-2 rounded-xl">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t('ui.totalScore')}</span>
                <span
                  key={scoreKey}
                  className="text-2xl font-extrabold text-foreground leading-none animate-scorePopup inline-block origin-left"
                >
                  {score.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-4"
          >
            <ScrabbleTileTitleLocal title1={t('ui.title1')} title2={t('ui.title2')} />

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mx-auto leading-relaxed font-medium bg-background/50 backdrop-blur-sm rounded-lg p-2 inline-block mt-2 whitespace-nowrap px-4">
              {t('ui.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="max-w-4xl mx-auto mb-8 relative"
          >
            <form onSubmit={handleSubmit} className="space-y-4 bg-card/95 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-border shadow-2xl">

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                <div className="w-full sm:w-2/3 space-y-1.5">
                  <Label htmlFor="scrambled-input" className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                    {t('ui.yourLetters')}
                  </Label>
                  <div className="relative group">
                    <Input
                      id="scrambled-input"
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={t('ui.placeholder')}
                      className="h-11 text-base px-4 pr-10 rounded-xl border-2 border-border focus-visible:ring-0 focus-visible:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground bg-background shadow-inner font-medium"
                      autoFocus
                      autoComplete="off"
                      spellCheck="false"
                    />
                    {inputValue && (
                      <button
                        type="button"
                        onClick={handleReset}
                        aria-label="Clear input"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive transition-colors duration-200 p-1 rounded-full hover:bg-destructive/10"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>


              <Button
                type="submit"
                size="lg"
                className="w-full h-11 text-base font-bold rounded-xl bg-primary text-primary-foreground hover:bg-accent hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
                disabled={!inputValue.trim() || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 animate-spin" /> {t('ui.unscrambling')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" /> {t('ui.unscrambleBtn')}
                  </span>
                )}
              </Button>

              <div className="pt-4 mt-4 border-t-2 border-border/50">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 items-start">
                  <div className="space-y-1.5 flex flex-col">
                    <Label htmlFor="startsWith" className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                      {t('filters.startsWith')}
                    </Label>
                    <Input
                      id="startsWith"
                      placeholder="e.g. A"
                      value={filters.startsWith || ''}
                      onChange={(e) => handleFilterChange('startsWith', e.target.value)}
                      className="h-9 px-3 py-1 rounded-xl border-2 border-border focus-visible:ring-0 focus-visible:border-primary shadow-inner text-sm font-medium text-foreground placeholder:text-muted-foreground bg-background transition-all"
                    />
                    {hasSearched && !isLoading && (
                      <span className="text-[11px] font-bold text-muted-foreground mt-1 px-1">
                        {t('messages.showingMatches', { count: displayWords.length })}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="endsWith" className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block"></span>
                      {t('filters.endsWith')}
                    </Label>
                    <Input
                      id="endsWith"
                      placeholder="e.g. ING"
                      value={filters.endsWith || ''}
                      onChange={(e) => handleFilterChange('endsWith', e.target.value)}
                      className="h-9 px-3 py-1 rounded-xl border-2 border-border focus-visible:ring-0 focus-visible:border-secondary shadow-inner text-sm font-medium text-foreground placeholder:text-muted-foreground bg-background transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contains" className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block"></span>
                      {t('filters.contains')}
                    </Label>
                    <Input
                      id="contains"
                      placeholder="e.g. TH"
                      value={filters.contains || ''}
                      onChange={(e) => handleFilterChange('contains', e.target.value)}
                      className="h-9 px-3 py-1 rounded-xl border-2 border-border focus-visible:ring-0 focus-visible:border-accent shadow-inner text-sm font-medium text-foreground placeholder:text-muted-foreground bg-background transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="requiredLetter" className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                      {t('filters.required')}
                    </Label>
                    <Input
                      id="requiredLetter"
                      placeholder="e.g. Z"
                      maxLength={1}
                      value={filters.requiredLetter || ''}
                      onChange={(e) => handleFilterChange('requiredLetter', e.target.value)}
                      className="h-9 px-3 py-1 rounded-xl border-2 border-border focus-visible:ring-0 focus-visible:border-primary shadow-inner text-center text-sm font-medium text-foreground placeholder:text-muted-foreground bg-background transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="wordLength" className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block"></span>
                      {t('filters.length')}
                    </Label>
                    <Input
                      id="wordLength"
                      placeholder="e.g. 5"
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={filters.wordLength || ''}
                      onChange={(e) => handleFilterChange('wordLength', e.target.value)}
                      className="h-9 px-3 py-1 rounded-xl border-2 border-border focus-visible:ring-0 focus-visible:border-accent shadow-inner text-center text-sm font-medium text-foreground placeholder:text-muted-foreground bg-background transition-all"
                    />
                  </div>
                </div>
              </div>

            </form>
          </motion.div>

          {hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="scroll-mt-8 relative"
            >
              <FilterPanelLocal
                filters={filters}
                clearFilters={clearFilters}
                t={t}
              />

              {isLoading ? (
                <div>
                  {currentLanguage !== 'en' && (
                    <p className="text-center text-muted-foreground font-medium mb-4">
                      {t('ui.loadingDict')}
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-2">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-sm">
                        <Skeleton className="h-8 w-3/4 mb-4 rounded-lg bg-muted/60" />
                        <Skeleton className="h-4 w-1/3 rounded-md bg-muted/60" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : displayWords.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-2">
                  {displayWords.map((word, index) => (
                    <WordCard
                      key={`${word}-${index}`}
                      word={word}
                      index={index}
                      points={calculateScrabblePoints(word, currentLanguage)}
                      isSuccess={animatingWords.includes(word)}
                      onClick={handleWordClaim}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-card/95 backdrop-blur-sm rounded-3xl border border-border shadow-xl max-w-3xl mx-auto mt-2">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/50 mb-6 shadow-inner border border-border">
                    <Search className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-foreground mb-3">
                    {hasActiveFilters ? t('messages.noMatches') : t('messages.noWords')}
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8 font-medium leading-relaxed">
                    {hasActiveFilters
                      ? t('messages.noMatchesDesc')
                      : t('messages.noWordsDesc')}
                  </p>
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} variant="outline" size="lg" className="rounded-xl border-2 border-border bg-background hover:bg-muted font-bold transition-colors">
                      {t('ui.clearAllFilters')}
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 max-w-4xl mx-auto relative"
          >
            <div className="bg-card/95 backdrop-blur-xl rounded-3xl shadow-xl border border-border p-2">
              <HelpSection />
            </div>
          </motion.div>

          <footer className="mt-12 text-center text-sm text-muted-foreground pb-8">
            <a href={`/${currentLanguage}/blog`} className="underline hover:text-foreground transition-colors">
              Blog
            </a>
            <span className="mx-2">·</span>
            <a href="/privacy" className="underline hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <span className="mx-2">·</span>
            <span>© 2026 UnscramblWords</span>
          </footer>

        </div>
      </div>
    </>
  );
};

export default UnscrambleApp;
