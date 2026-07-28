import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent was already given in this session
    const hasConsented = sessionStorage.getItem('cookieConsent');
    
    if (!hasConsented) {
      // Add a small delay so it doesn't pop up instantly on initial load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setIsVisible(false);
    // Use sessionStorage to keep it hidden for the current session as requested
    sessionStorage.setItem('cookieConsent', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[100]"
        >
          <div className="bg-card/80 backdrop-blur-xl border border-border shadow-2xl p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden">
            {/* Subtle top border accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary opacity-50" />
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-2.5 bg-primary/10 rounded-full">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1.5">
                <h3 className="font-semibold text-foreground text-sm tracking-tight">We use cookies</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use cookies to personalize content, serve Google AdSense ads, and analyze our traffic to improve your experience.
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end w-full mt-1">
              <Button 
                onClick={handleAccept} 
                size="default" 
                className="w-full sm:w-auto rounded-xl font-semibold shadow-sm"
              >
                Got it
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;