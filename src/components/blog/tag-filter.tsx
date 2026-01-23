"use client";

/**
 * Tag Filter Component
 * 
 * Horizontal scrollable tag filters with active state
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

interface TagFilterProps {
  tags: Tag[];
  activeTag: string | null;
  onTagChange: (slug: string | null) => void;
}

export function TagFilter({ tags, activeTag, onTagChange }: TagFilterProps) {
  return (
    <div className="relative">
      {/* Gradient fade on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-white to-transparent z-10 pointer-events-none md:hidden" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-white to-transparent z-10 pointer-events-none md:hidden" />
      
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
        {/* All posts button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTagChange(null)}
          className={cn(
            "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            "border",
            activeTag === null
              ? "bg-[#111111] text-white border-[#111111]"
              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          )}
        >
          All posts
        </motion.button>
        
        {/* Tag buttons */}
        {tags.map((tag) => (
          <motion.button
            key={tag.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTagChange(tag.slug)}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              "border",
              activeTag === tag.slug
                ? "bg-[#111111] text-white border-[#111111]"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            {tag.name}
            {tag.postCount > 0 && (
              <span className={cn(
                "ml-1.5 text-xs",
                activeTag === tag.slug ? "text-white/70" : "text-gray-400"
              )}>
                {tag.postCount}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
