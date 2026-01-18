"use client";

import { motion } from "framer-motion";
import { Edit, Trash2, Image as ImageIcon, ArrowRight } from "lucide-react";
import type { Domain } from "@/lib/types";
import { useState } from "react";

interface DomainCardProps {
  domain: Domain;
  onEdit?: (domain: Domain) => void;
  onDelete?: (id: string) => void;
  onClick?: (domain: Domain) => void;
}

export function DomainCard({ domain, onEdit, onDelete, onClick }: DomainCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 cursor-pointer"
      onClick={() => onClick?.(domain)}
    >
      {/* Image Container with Overlay */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {domain.images.length > 0 ? (
          <>
            <motion.img
              src={domain.images[0].imageUrl}
              alt={domain.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            
            {/* Gradient Overlay on Hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Domain Color Indicator with Pulse */}
            <motion.div
              className="absolute top-4 right-4 w-12 h-12 rounded-full shadow-2xl border-4 border-white z-10"
              style={{ backgroundColor: domain.colorHex }}
              animate={{
                boxShadow: [
                  `0 0 0 0 ${domain.colorHex}40`,
                  `0 0 0 8px ${domain.colorHex}00`,
                ],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            
            {/* Image Count Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-gray-200 z-10"
            >
              <div className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-gray-700" />
                <span className="text-xs font-bold text-gray-900">
                  {domain.images.length} {domain.images.length === 1 ? 'Image' : 'Images'}
                </span>
              </div>
            </motion.div>
            
            {/* Domain Name Overlay on Hover */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2">{domain.name}</h3>
              <p className="text-sm text-white/90 line-clamp-2 leading-relaxed">
                {domain.description}
              </p>
            </motion.div>
          </>
        ) : (
          /* Empty State */
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No images yet</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-6 bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {domain.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {domain.description}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
          {onEdit && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(domain);
              }}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit className="w-4 h-4" />
              Edit
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete "${domain.name}"? This will also delete all associated images and goals.`)) {
                  onDelete(domain.id);
                }
              }}
              className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>
        
        {/* Hover Arrow Indicator */}
        {onClick && (
          <motion.div
            className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            whileHover={{ scale: 1.1, rotate: -45 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
