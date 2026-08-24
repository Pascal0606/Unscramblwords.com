import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage.js';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
  { code: 'it', name: 'Italiano' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ru', name: 'Русский' },
  { code: 'pl', name: 'Polski' },
  { code: 'ar', name: 'العربية' }
];

const LanguageSelector = () => {
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLanguageChange = (langCode) => {
    navigate(`/${langCode}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[140px] h-10 bg-card/90 backdrop-blur-md border border-border shadow-sm rounded-xl text-sm font-semibold transition-colors focus:ring-primary">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-border shadow-xl z-50 bg-card/95 backdrop-blur-md">
          {languages.map((lang) => (
            <SelectItem 
              key={lang.code} 
              value={lang.code} 
              className="font-medium cursor-pointer py-2 focus:bg-primary/10 focus:text-primary"
            >
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;