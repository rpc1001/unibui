"use client";

import { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export default function SearchBar({ onSearch, isSearching }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative px-4 py-2 border-b border-[var(--text-secondary)]/10">
      <div className="relative flex items-center">
        <IoSearchOutline className="absolute left-3 text-[var(--text-secondary)]" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search jobs or companies..."
          className="w-full pl-10 pr-4 py-2 bg-[var(--background)] rounded-full 
                   border border-[var(--text-secondary)]/20
                   focus:outline-none focus:border-[var(--accent)]
                   text-[var(--foreground)] placeholder-[var(--text-secondary)]"
        />
        <AnimatePresence>
          {isSearching && query && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-3 text-sm text-[var(--text-secondary)]"
            >
              Searching...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
