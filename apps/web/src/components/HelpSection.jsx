import React from 'react';
import { useLanguage } from '@/hooks/useLanguage.js';
import { Wrench, Gamepad2, Shuffle, CheckCircle, Lightbulb, Search, Book, Layers, Filter } from 'lucide-react';

const HelpSection = () => {
  const { t } = useLanguage();

  return (
    <div className="help-container p-6 md:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-[hsl(var(--help-text))]">
          {t('help.title')}
        </h2>
        <p className="text-lg font-medium opacity-80 text-[hsl(var(--help-text))]">
          {t('help.subtitle')}
        </p>
      </div>

      <div className="space-y-12">
        {/* Section 1: What is it? */}
        <section>
          <div className="flex items-start gap-4 mb-6">
            <div className="help-number-circle">1.</div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-[hsl(var(--help-text))]">{t('help.s1Title')}</h3>
              <p className="font-medium opacity-80 leading-relaxed text-[hsl(var(--help-text))]">
                {t('help.s1Desc')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-0 md:pl-14">
            <div className="help-box">
              <Wrench className="w-8 h-8 text-[hsl(var(--help-accent))] mb-3" />
              <h4 className="font-bold mb-2 text-[hsl(var(--help-text))]">{t('help.s1Box1Title')}</h4>
              <p className="text-sm font-medium opacity-80 text-[hsl(var(--help-text))]">{t('help.s1Box1Desc')}</p>
            </div>
            <div className="help-box">
              <Gamepad2 className="w-8 h-8 text-[hsl(var(--help-accent))] mb-3" />
              <h4 className="font-bold mb-2 text-[hsl(var(--help-text))]">{t('help.s1Box2Title')}</h4>
              <p className="text-sm font-medium opacity-80 text-[hsl(var(--help-text))]">{t('help.s1Box2Desc')}</p>
            </div>
            <div className="help-box">
              <Shuffle className="w-8 h-8 text-[hsl(var(--help-accent))] mb-3" />
              <h4 className="font-bold mb-2 text-[hsl(var(--help-text))]">{t('help.s1Box3Title')}</h4>
              <p className="text-sm font-medium opacity-80 text-[hsl(var(--help-text))]">{t('help.s1Box3Desc')}</p>
            </div>
          </div>
        </section>

        {/* Section 2: Advanced Options */}
        <section>
          <div className="flex items-start gap-4 mb-6">
            <div className="help-number-circle">2.</div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-[hsl(var(--help-text))]">{t('help.s2Title')}</h3>
              <p className="font-medium opacity-80 leading-relaxed text-[hsl(var(--help-text))]">
                {t('help.s2Desc')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-0 md:pl-14">
            <div className="help-box flex gap-3 items-start">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-[hsl(var(--help-accent))]" />
              <div>
                <h4 className="font-bold mb-1 text-[hsl(var(--help-text))]">{t('help.s2Opt1Title')}</h4>
                <p className="text-sm font-medium opacity-80 text-[hsl(var(--help-text))]">{t('help.s2Opt1Desc')}</p>
              </div>
            </div>
            <div className="help-box flex gap-3 items-start">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-[hsl(var(--help-accent))]" />
              <div>
                <h4 className="font-bold mb-1 text-[hsl(var(--help-text))]">{t('help.s2Opt2Title')}</h4>
                <p className="text-sm font-medium opacity-80 text-[hsl(var(--help-text))]">{t('help.s2Opt2Desc')}</p>
              </div>
            </div>
            <div className="help-box flex gap-3 items-start">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-[hsl(var(--help-accent))]" />
              <div>
                <h4 className="font-bold mb-1 text-[hsl(var(--help-text))]">{t('help.s2Opt3Title')}</h4>
                <p className="text-sm font-medium opacity-80 text-[hsl(var(--help-text))]">{t('help.s2Opt3Desc')}</p>
              </div>
            </div>
            <div className="help-box flex gap-3 items-start">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-[hsl(var(--help-accent))]" />
              <div>
                <h4 className="font-bold mb-1 text-[hsl(var(--help-text))]">{t('help.s2Opt4Title')}</h4>
                <p className="text-sm font-medium opacity-80 text-[hsl(var(--help-text))]">{t('help.s2Opt4Desc')}</p>
              </div>
            </div>
            <div className="help-box flex gap-3 items-start">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-[hsl(var(--help-accent))]" />
              <div>
                <h4 className="font-bold mb-1 text-[hsl(var(--help-text))]">{t('help.s2Opt5Title')}</h4>
                <p className="text-sm font-medium opacity-80 text-[hsl(var(--help-text))]">{t('help.s2Opt5Desc')}</p>
              </div>
            </div>
            <div className="help-box flex gap-3 items-start bg-[hsl(var(--help-accent))] text-[hsl(var(--primary-foreground))] border-transparent">
              <Lightbulb className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold mb-1">{t('help.s2ProTipTitle')}</h4>
                <p className="text-sm font-medium opacity-90">{t('help.s2ProTipDesc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: How does it work? */}
        <section>
          <div className="flex items-start gap-4 mb-6">
            <div className="help-number-circle">3.</div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-[hsl(var(--help-text))]">{t('help.s3Title')}</h3>
              <p className="font-medium opacity-80 leading-relaxed text-[hsl(var(--help-text))]">
                {t('help.s3Desc')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pl-0 md:pl-14 mb-6">
            <div className="help-box relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-3">
                <div className="help-number-badge">1</div>
                <Search className="w-5 h-5 text-[hsl(var(--help-accent))]" />
              </div>
              <h4 className="font-bold mb-2 text-[hsl(var(--help-text))]">{t('help.s3Step1Title')}</h4>
              <p className="text-sm font-medium opacity-80 text-[hsl(var(--help-text))]">{t('help.s3Step1Desc')}</p>
            </div>

            <div className="help-box relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-3">
                <div className="help-number-badge">2</div>
                <Book className="w-5 h-5 text-[hsl(var(--help-accent))]" />
              </div>
              <h4 className="font-bold mb-2 text-[hsl(var(--help-text))]">{t('help.s3Step2Title')}</h4>
              <p className="text-sm font-medium opacity-80 text-[hsl(var(--help-text))]">{t('help.s3Step2Desc')}</p>
            </div>

            <div className="help-box relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-3">
                <div className="help-number-badge">3</div>
                <Layers className="w-5 h-5 text-[hsl(var(--help-accent))]" />
              </div>
              <h4 className="font-bold mb-2 text-[hsl(var(--help-text))]">{t('help.s3Step3Title')}</h4>
              <p className="text-sm font-medium opacity-80 text-[hsl(var(--help-text))]">{t('help.s3Step3Desc')}</p>
            </div>

            <div className="help-box relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-3">
                <div className="help-number-badge">4</div>
                <Filter className="w-5 h-5 text-[hsl(var(--help-accent))]" />
              </div>
              <h4 className="font-bold mb-2 text-[hsl(var(--help-text))]">{t('help.s3Step4Title')}</h4>
              <p className="text-sm font-medium opacity-80 text-[hsl(var(--help-text))]">{t('help.s3Step4Desc')}</p>
            </div>
          </div>

          <div className="pl-0 md:pl-14">
            <div className="bg-[hsl(var(--card))] border-l-4 border-[hsl(var(--help-accent))] rounded-r-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Lightbulb className="w-6 h-6 text-[hsl(var(--help-accent))]" />
                <h4 className="font-bold text-lg text-[hsl(var(--help-text))]">{t('help.s3TipsTitle')}</h4>
              </div>
              <p className="font-medium opacity-80 text-[hsl(var(--help-text))]">
                {t('help.s3TipsDesc')}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpSection;