"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/shared/Button";
import type { DomainImage } from "@/lib/types";

interface ImageUploaderProps {
  domainId: string;
  existingImages: DomainImage[];
  maxImages?: number;
  onImagesChange?: () => void;
}

export function ImageUploader({
  domainId,
  existingImages,
  maxImages = 5,
  onImagesChange,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadImage, isPending } = useMutation({
    mutationFn: (file: File) => api.domains.uploadImage(domainId, file),
    onSuccess: () => {
      onImagesChange?.();
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/") && existingImages.length < maxImages) {
          uploadImage(file);
        }
      }
    },
    [existingImages.length, maxImages, uploadImage]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (existingImages.length < maxImages) {
        uploadImage(file);
      }
    }
  };

  const canUploadMore = existingImages.length < maxImages;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Images ({existingImages.length}/{maxImages})
      </label>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {existingImages.map((image) => (
            <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={image.imageUrl}
                alt={`Domain image ${image.sortOrder}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canUploadMore && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
            }
            ${isPending ? "opacity-50 pointer-events-none" : ""}
          `}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop images here, or click to select
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Upload up to {maxImages - existingImages.length} more image
            {maxImages - existingImages.length !== 1 ? "s" : ""}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
          >
            Select Files
          </Button>
        </div>
      )}

      {!canUploadMore && (
        <p className="text-sm text-gray-500">
          Maximum number of images ({maxImages}) reached
        </p>
      )}
    </div>
  );
}