import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const FilterPanel = ({ 
  filters, 
  clearFilters 
}) => {
  // Check if any of our 5 specific filters are active
  const activeKeys = ['startsWith', 'endsWith', 'contains', 'requiredLetter', 'wordLength'];
  const hasActiveFilters = activeKeys.some(key => filters[key] !== '' && filters[key] !== undefined);

  if (!hasActiveFilters) {
    return null;
  }

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
              Starts with: {filters.startsWith.toUpperCase()}
            </span>
          )}
          {filters.endsWith && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-secondary/20 text-secondary-foreground font-bold text-xs">
              Ends with: {filters.endsWith.toUpperCase()}
            </span>
          )}
          {filters.contains && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-accent/10 text-accent font-bold text-xs">
              Contains: {filters.contains.toUpperCase()}
            </span>
          )}
          {filters.requiredLetter && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs">
              Required: {filters.requiredLetter.toUpperCase()}
            </span>
          )}
          {filters.wordLength && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-accent/10 text-accent font-bold text-xs">
              Length: {filters.wordLength}
            </span>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-7 px-2 text-xs font-bold text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg ml-1"
          >
            <X className="w-3 h-3 mr-1" />
            Clear Filters
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FilterPanel;