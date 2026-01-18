"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, Sparkles } from "lucide-react";
import { SystemButton } from "@/components/shared/SystemButton";

interface DomainImageStepProps {
  domains: string[];
  domainImages: Record<string, string[]>;
  onDomainImagesChange: (domain: string, images: string[]) => void;
  currentDomainIndex: number;
  onDomainChange: (index: number) => void;
}

export function DomainImageStep({
  domains,
  domainImages,
  onDomainImagesChange,
  currentDomainIndex,
  onDomainChange,
}: DomainImageStepProps) {
  const [dragging, setDragging] = useState(false);
  const currentDomain = domains[currentDomainIndex];
  const images = domainImages[currentDomain] || [];

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (files.length > 0) {
        const fileUrls = files.map((file) => URL.createObjectURL(file));
        onDomainImagesChange(currentDomain, [...images, ...fileUrls]);
      }
    },
    [currentDomain, images, onDomainImagesChange]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length > 0) {
      const fileUrls = files.map((file) => URL.createObjectURL(file));
      onDomainImagesChange(currentDomain, [...images, ...fileUrls]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onDomainImagesChange(currentDomain, newImages);
  };

  const addAISuggestion = () => {
    // Mock AI suggestion - in real app would call API
    const mockImages = [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    ];
    onDomainImagesChange(currentDomain, [...images, ...mockImages.slice(0, 5 - images.length)]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Add Images for {currentDomain}
        </h2>
        <p className="text-gray-600">
          Upload 1-5 inspirational images that represent your completed vision for this domain.
        </p>
      </div>

      {/* Domain Navigation */}
      <div className="flex justify-center gap-2">
        {domains.map((domain, index) => (
          <motion.button
            key={domain}
            onClick={() => onDomainChange(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              index === currentDomainIndex
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-600 border border-gray-300 hover:border-blue-400"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {domain}
            {(domainImages[domain]?.length || 0) > 0 && (
              <span className="ml-2 text-xs">({domainImages[domain]?.length})</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Progress */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {domains.filter((d) => (domainImages[d]?.length || 0) > 0).length} of {domains.length}{" "}
          domains completed
        </p>
      </div>

      {/* Image Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        className={`relative border-2 border-dashed rounded-xl p-12 transition-all ${
          dragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        }`}
      >
        {images.length === 0 ? (
          <div className="text-center">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop images here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supported formats: JPG, PNG, WebP (max 5 images)
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="image-upload"
            />
            <SystemButton
              onClick={() => document.getElementById("image-upload")?.click()}
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              Browse Files
            </SystemButton>
            <div className="mt-4">
              <SystemButton
                onClick={addAISuggestion}
                variant="outline"
                className="flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-4 h-4" />
                Get AI Suggestions
              </SystemButton>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence>
              {images.map((url, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-square rounded-lg overflow-hidden group border-2 border-gray-200"
                >
                  <img
                    src={url}
                    alt={`${currentDomain} image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <motion.button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>

            {images.length < 5 && (
              <motion.label
                htmlFor="image-upload"
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-center">
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-600">Add More</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="image-upload"
                />
              </motion.label>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
