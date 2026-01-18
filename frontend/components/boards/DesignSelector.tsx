"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/queryClient";
import { Button } from "@/components/shared/Button";
import { Check } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface DesignSelectorProps {
  onClose: () => void;
}

export function DesignSelector({ onClose }: DesignSelectorProps) {
  const queryClient = useQueryClient();

  const { data: designs, isLoading } = useQuery({
    queryKey: queryKeys.boards.designs,
    queryFn: api.boards.getDesigns,
  });

  const { mutate: selectDesign, isPending } = useMutation({
    mutationFn: api.boards.selectDesign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.current });
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.designs });
      onClose();
    },
  });

  const handleSelectDesign = (designId: string) => {
    selectDesign({ designId });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Choose Your Board Design</h2>
      <p className="text-gray-600 mb-6">
        Select a design style for your vision board. Your board will be regenerated with the new design.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-video bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : designs && designs.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {designs.map((design) => (
            <div
              key={design.id}
              onClick={() => !isPending && handleSelectDesign(design.id)}
              className={cn(
                "relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all",
                design.isActive
                  ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2"
                  : "border-gray-200 hover:border-gray-400",
                isPending && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="relative aspect-video bg-gray-100">
                <Image
                  src={design.previewUrl}
                  alt={design.designName}
                  fill
                  className="object-cover"
                />
                {design.isActive && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Active
                  </div>
                )}
              </div>
              <div className="p-4 bg-white">
                <p className="font-medium text-gray-900">{design.designName}</p>
                <p className="text-sm text-gray-500 capitalize mt-1">{design.designStyle}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No designs available</p>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
