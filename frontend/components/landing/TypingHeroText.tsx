"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function TypingHeroText() {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Your Effort Becomes Art";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.h1
      className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-foreground mb-6 font-mono"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <span className="block mb-2">{displayedText}</span>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">
        {fullText.slice(displayedText.length)}
      </span>
      {displayedText.length === fullText.length && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="inline-block ml-2 text-purple-500"
        >
          |
        </motion.span>
      )}
    </motion.h1>
  );
}
