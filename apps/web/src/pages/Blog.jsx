import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, BookOpen, Clock, Calendar, Tag, Search, X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage.js';
import { blogContent } from '@/i18n/blogContent.js';

export function BlogArticle() {
  const { slug } = useParams();
  const { currentLanguage } = useLanguage();

  const articles = blogContent[currentLanguage] || blogContent['en'] || [];
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-dvh bg-background text-foreground flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-3xl font-bold mb-4">Article not found</h1>
          <Link to={`/${currentLanguage}/blog`} className="text-primary underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background text-foreground py-16 md:py-24">
      <Helmet>
        <title>{`${article.title} | UnscramblWords Blog`}</title>
        <meta name="description" content={article.excerpt} />
        <link rel="canonical" href={`https://unscramblwords.com/${currentLanguage}/blog/${slug}`} />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link
          to={`/${currentLanguage}/blog`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-secondary/80 text-secondary-foreground text-xs font-semibold tracking-wide uppercase">
              <Tag className="w-3.5 h-3.5 mr-1.5" />
              Word Games
            </span>
            <span className="flex items-center text-sm text-muted-foreground font-medium">
              <Calendar className="w-4 h-4 mr-1.5" />
              2026
            </span>
            <span className="flex items-center text-sm text-muted-foreground font-medium">
              <Clock className="w-4 h-4 mr-1.5" />
              {Math.ceil(article.body.join(' ').split(' ').length / 200)} min read
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-foreground">
            {article.title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {article.excerpt}
          </p>
        </header>

        <hr className="border-border mb-10" />

        <article>
          {article.body.map((paragraph, i) => (
            <p key={i} className="mb-6 text-foreground leading-relaxed text-base md:text-lg">
              {paragraph}
            </p>
          ))}
        </article>

        <hr className="border-border mt-12 mb-8" />

        <div className="flex items-center justify-between">
          <Link
            to={`/${currentLanguage}/blog`}
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <Link
            to={`/${currentLanguage}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Go to Word Unscrambler →
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function Blog() {
  const { currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const rawArticles = blogContent[currentLanguage] || blogContent['en'] || [];

  const enhancedArticles = useMemo(() => {
    return rawArticles.map((article, index) => {
      let category = 'Guides';
      if (article.slug.includes('strategies') || article.title.toLowerCase().includes('strategy')) {
        category = 'Strategy';
      } else if (article.slug.includes('vocabulary') || article.title.toLowerCase().includes('vocabulary')) {
        category = 'Vocabulary';
      }
      const date = new Date(2025, 9 - index, 15 + (index * 2));
      return {
        ...article,
        category,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: `${4 + (index % 3)} min read`
      };
    });
  }, [rawArticles]);

  const categories = ['All', ...new Set(enhancedArticles.map(a => a.category))];

  const filteredArticles = useMemo(() => {
    return enhancedArticles.filter(article => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [enhancedArticles, searchQuery, activeCategory]);

  return (
    <div className="min-h-dvh bg-background text-foreground py-16 md:py-24">
      <Helmet>
        <title>Blog - Word Games & Scrabble Strategies</title>
        <meta name="description" content="Discover expert strategies, tips, and vocabulary guides to master Scrabble and dominate word games." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16 md:mb-20 flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3.5 bg-primary/10 text-primary rounded-2xl mb-8 ring-1 ring-primary/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-foreground text-balance" style={{ letterSpacing: '-0.02em' }}>
            Word game strategies & guides
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-10">
            Elevate your gameplay with our comprehensive guides on Scrabble strategies, vocabulary expansion, and competitive tactics.
          </p>

          <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3.5 bg-card border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-[0.98] ${activeCategory === category
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary/80'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => {
              const isFeatured = index === 0 && searchQuery === '' && activeCategory === 'All';
              return (
                <article
                  key={article.slug}
                  className={`group relative bg-card text-card-foreground rounded-[2rem] p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300 border border-border/40 hover:border-primary/30 flex flex-col hover:-translate-y-1 ${isFeatured ? 'lg:col-span-2 md:p-12' : 'col-span-1'
                    }`}
                >
                  {isFeatured && (
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-[4rem] rounded-tr-[2rem] -z-10 transition-colors duration-500 group-hover:bg-primary/10" />
                  )}

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex flex-wrap items-center gap-4 mb-6 md:mb-8">
                      <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-secondary/80 text-secondary-foreground text-xs font-semibold tracking-wide uppercase">
                        <Tag className="w-3.5 h-3.5 mr-1.5" />
                        {article.category}
                      </span>
                      <span className="flex items-center text-sm text-muted-foreground font-medium">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        {article.date}
                      </span>
                      <span className="hidden sm:flex items-center text-sm text-muted-foreground font-medium">
                        <Clock className="w-4 h-4 mr-1.5" />
                        {article.readTime}
                      </span>
                    </div>

                    <h2 className={`font-bold leading-tight text-balance mb-5 text-card-foreground ${isFeatured ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl'
                      }`}>
                      <Link
                        to={`/${currentLanguage}/blog/${article.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {article.title}
                      </Link>
                    </h2>

                    <p className={`text-muted-foreground leading-relaxed mb-10 max-w-[65ch] ${isFeatured ? 'text-lg md:text-xl' : 'text-base line-clamp-3'
                      }`}>
                      {article.excerpt}
                    </p>

                    <div className="mt-auto pt-6 border-t border-border/30">
                      <Link
                        to={`/${currentLanguage}/blog/${article.slug}`}
                        className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors"
                      >
                        <span className="border-b border-transparent hover:border-primary/50 transition-colors">
                          Read full article
                        </span>
                        <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="lg:col-span-2 text-center py-24 px-6 bg-muted/30 rounded-[2rem] border-2 border-dashed border-border/50 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm border border-border/50">
                <Search className="w-10 h-10 text-muted-foreground opacity-60" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">No articles found</h2>
              <p className="text-lg text-muted-foreground max-w-md mb-8">
                We could not find any articles matching your search.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors active:scale-[0.98]"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}