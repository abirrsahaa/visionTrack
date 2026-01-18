"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/queryClient";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { ImageUploader } from "./ImageUploader";
import type { Domain } from "@/lib/types";

const domainSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  colorHex: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").optional(),
});

type DomainForm = z.infer<typeof domainSchema>;

interface DomainEditorProps {
  domain?: Domain;
  onSuccess: () => void;
  onCancel: () => void;
}

const defaultColors = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
];

export function DomainEditor({ domain, onSuccess, onCancel }: DomainEditorProps) {
  const queryClient = useQueryClient();
  const [selectedColor, setSelectedColor] = useState(domain?.colorHex || defaultColors[0]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DomainForm>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      name: domain?.name || "",
      description: domain?.description || "",
      colorHex: domain?.colorHex || defaultColors[0],
    },
  });

  const { mutate: createDomain, isPending: isCreating } = useMutation({
    mutationFn: api.domains.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.domains.all });
      onSuccess();
    },
  });

  const { mutate: updateDomain, isPending: isUpdating } = useMutation({
    mutationFn: (data: { id: string; updates: Parameters<typeof api.domains.update>[1] }) =>
      api.domains.update(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.domains.all });
      onSuccess();
    },
  });

  const onSubmit = (data: DomainForm) => {
    const domainData = {
      name: data.name,
      description: data.description || "",
      colorHex: selectedColor,
    };

    if (domain) {
      updateDomain({ id: domain.id, updates: domainData });
    } else {
      createDomain(domainData);
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setValue("colorHex", color);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <Input
        {...register("name")}
        label="Domain Name"
        placeholder="e.g., Career, Health, Learning"
        error={errors.name?.message}
        autoFocus
      />

      {/* Description */}
      <div className="w-full">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description (Optional)
        </label>
        <textarea
          {...register("description")}
          id="description"
          rows={3}
          placeholder="What does this domain mean to you?"
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Color Picker */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <div className="flex gap-3 flex-wrap">
          {defaultColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorSelect(color)}
              className={`
                w-10 h-10 rounded-full border-2 transition-all
                ${selectedColor === color
                  ? "border-gray-900 scale-110 ring-2 ring-offset-2 ring-blue-500"
                  : "border-gray-300 hover:border-gray-400"
                }
              `}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
          <input
            {...register("colorHex")}
            type="color"
            value={selectedColor}
            onChange={(e) => handleColorSelect(e.target.value)}
            className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
          />
        </div>
        <input type="hidden" {...register("colorHex")} value={selectedColor} />
      </div>

      {/* Image Uploader (only for existing domains) */}
      {domain && (
        <ImageUploader
          domainId={domain.id}
          existingImages={domain.images}
          onImagesChange={() => {
            queryClient.invalidateQueries({ queryKey: queryKeys.domains.all });
          }}
        />
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isCreating || isUpdating}
          disabled={isCreating || isUpdating}
        >
          {domain ? "Update" : "Create"} Domain
        </Button>
      </div>
    </form>
  );
}