import { motion } from "framer-motion";
import { Check, LayoutGrid, LayoutTemplate, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface DesignSelectorStepProps {
  selectedDesign: string | null;
  onDesignSelect: (designId: string) => void;
  images?: string[]; // New prop for live preview
}

const designs = [
  {
    id: "masonry",
    name: "Pinterest Masonry",
    description: "Organic, flowing layout that respects aspect ratios.",
    icon: LayoutTemplate
  },
  {
    id: "grid",
    name: "Structured Grid",
    description: "Clean, uniform rows and columns for maximum order.",
    icon: LayoutGrid
  },
  {
    id: "collage",
    name: "Chaos Collage",
    description: "Overlapping, artistic arrangement for maximum vibe.",
    icon: Layers
  },
];

export function DesignSelectorStep({
  selectedDesign,
  onDesignSelect,
  images = [],
}: DesignSelectorStepProps) {
  // Flatten images for preview (limit to 6 for performance)
  const previewImages = images.slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto space-y-12 min-h-[60vh] flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full">
          PHASE 3: ARCHITECTURE
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Choose Your Structure
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          How should your future look? Select the framework that fits your mental model.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {designs.map((design, index) => {
          const isSelected = selectedDesign === design.id;
          const Icon = design.icon;

          return (
            <motion.button
              key={design.id}
              onClick={() => onDesignSelect(design.id)}
              className={cn(
                "group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all duration-500 flex flex-col items-start text-left",
                isSelected
                  ? "border-purple-500 bg-black/80 shadow-[0_0_50px_rgba(168,85,247,0.3)]"
                  : "border-white/10 bg-black/40 hover:border-white/30 hover:bg-black/60"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Live Preview Area */}
              <div className="w-full flex-1 relative overflow-hidden p-4">
                {/* GRID PREVIEW */}
                {design.id === 'grid' && (
                  <div className="grid grid-cols-2 gap-2 w-full h-full content-start opacity-70 group-hover:opacity-100 transition-opacity">
                    {previewImages.map((src, i) => (
                      <img key={i} src={src} className="w-full h-24 object-cover rounded-md" alt="" />
                    ))}
                  </div>
                )}

                {/* MASONRY PREVIEW (Simulated with columns) */}
                {design.id === 'masonry' && (
                  <div className="columns-2 gap-2 w-full h-full opacity-70 group-hover:opacity-100 transition-opacity">
                    {previewImages.map((src, i) => (
                      <img key={i} src={src} className="w-full mb-2 object-cover rounded-md" style={{ height: i % 2 === 0 ? '120px' : '80px' }} alt="" />
                    ))}
                  </div>
                )}

                {/* COLLAGE PREVIEW */}
                {design.id === 'collage' && (
                  <div className="relative w-full h-full opacity-70 group-hover:opacity-100 transition-opacity">
                    {previewImages.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        className="absolute w-24 h-24 object-cover rounded-lg shadow-lg border-2 border-white/10"
                        style={{
                          top: `${(i * 15) % 80}%`,
                          left: `${(i * 20) % 70}%`,
                          transform: `rotate(${i % 2 === 0 ? 6 : -6}deg)`,
                          zIndex: i
                        }}
                        alt=""
                      />
                    ))}
                  </div>
                )}

                {/* Fallback if no images */}
                {previewImages.length === 0 && (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <Icon size={48} />
                  </div>
                )}
              </div>

              {/* Label Area */}
              <div className="w-full p-6 bg-gradient-to-t from-black via-black/90 to-transparent pt-12 z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xl">
                    <Icon size={20} className={isSelected ? "text-purple-400" : "text-gray-500"} />
                    {design.name}
                  </div>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-purple-500 rounded-full p-1">
                      <Check size={12} className="text-white" />
                    </motion.div>
                  )}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {design.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
