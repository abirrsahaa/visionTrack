import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Plus, Sparkles, RefreshCw, Search, Layers, Image as ImageIcon, Trash2 } from "lucide-react";
import { SystemButton } from "@/components/shared/SystemButton";
import { cn } from "@/lib/utils";
import { imagesApi } from "@/lib/api/images";

interface ExtractedDomain {
  name: string;
  description: string;
  suggestedGoal: string;
  colorHex: string;
  imageKeywords: string[];
}

interface DomainImageStepProps {
  domains: ExtractedDomain[];
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
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State for search results
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const currentDomain = domains[currentDomainIndex];
  // Calculate total images across all domains
  const totalImages = Object.values(domainImages).reduce((acc, curr) => acc + curr.length, 0);

  // Auto-Search on Domain Change (Populates Left Panel, NOT Right Panel)
  useEffect(() => {
    if (!currentDomain) return; // Safeguard

    const fetchSuggestions = async () => {
      // Only fetch if we don't have results for this domain yet to save API calls
      // For simplicity in this demo, we just check if it's empty. In prod, cache this.
      if (!isSearching) {
        setIsSearching(true);
        try {
          const query = currentDomain.imageKeywords?.join(" ") || currentDomain.name + " aesthetic";
          const foundImages = await imagesApi.search(query);
          if (foundImages.length > 0) {
            setSearchResults(foundImages);
          }
        } catch (e) {
          console.error("Auto-search failed", e);
        } finally {
          setIsSearching(false);
        }
      }
    };

    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDomain?.name]);

  // Safeguard
  if (!currentDomain) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <RefreshCw className="w-8 h-8 text-neon-cyan animate-spin mb-4" />
        <p className="font-mono text-neon-cyan/70 tracking-widest animate-pulse">SYSTEM SYNCHRONIZATION...</p>
      </div>
    );
  }

  const handleSelectImage = (url: string) => {
    const currentImages = domainImages[currentDomain.name] || [];
    // duplicate check
    if (currentImages.includes(url)) return;

    onDomainImagesChange(currentDomain.name, [...currentImages, url]);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (files.length > 0) {
        const fileUrls = files.map((file) => URL.createObjectURL(file));
        const currentImages = domainImages[currentDomain.name] || [];
        onDomainImagesChange(currentDomain.name, [...currentImages, ...fileUrls]);
      }
    },
    [currentDomain, domainImages, onDomainImagesChange]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length > 0) {
      const fileUrls = files.map((file) => URL.createObjectURL(file));
      const currentImages = domainImages[currentDomain.name] || [];
      onDomainImagesChange(currentDomain.name, [...currentImages, ...fileUrls]);
    }
  };

  const removeImage = (domainName: string, imageIndex: number) => {
    const currentImages = domainImages[domainName] || [];
    const newImages = currentImages.filter((_, i) => i !== imageIndex);
    onDomainImagesChange(domainName, newImages);
  };

  return (
    <div className="max-w-[1700px] mx-auto min-h-[70vh] flex flex-col lg:flex-row gap-8">

      {/* LEFT PANEL: ASSET DISCOVERY (SEARCH & SELECT) */}
      <div className="lg:w-1/3 space-y-6 flex flex-col">
        {/* Domain Selector */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex-shrink-0">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-neon-purple" />
            Active Frequency
          </h3>
          <div className="flex flex-wrap gap-2">
            {domains.map((domain, index) => {
              const isActive = index === currentDomainIndex;
              return (
                <button
                  key={domain.name}
                  onClick={() => onDomainChange(index)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-mono transition-all duration-300 border flex items-center gap-2",
                    isActive
                      ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      : "bg-black/40 text-gray-500 border-white/5 hover:border-white/20 hover:text-gray-300"
                  )}
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-neon-cyan blink" : "bg-gray-600")} />
                  {domain.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search / Suggestions Area */}
        <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col overflow-hidden relative border-t-4 border-t-neon-cyan">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Search className="w-4 h-4 text-neon-cyan" />
              Suggested Assets
            </h3>
            <button
              onClick={() => document.getElementById('panel-upload')?.click()}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 hover:underline"
            >
              <Upload className="w-3 h-3" /> Upload specific
            </button>
            <input id="panel-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleFileInput} />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {isSearching ? (
              <div className="h-full flex flex-col items-center justify-center text-neon-cyan/50">
                <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                <span className="text-xs font-mono">SCANNING NETWORK...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {searchResults.map((url, i) => (
                  <motion.div
                    key={`${url}-${i}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="aspect-[3/4] rounded-lg overflow-hidden relative group cursor-pointer border border-white/5 hover:border-neon-cyan transition-colors"
                    onClick={() => handleSelectImage(url)}
                  >
                    <img src={url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" loading="lazy" />
                    <div className="absolute inset-0 bg-neon-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Plus className="w-8 h-8 text-white drop-shadow-md" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: LIVE BOARD PREVIEW */}
      <div className="lg:w-2/3 glass-panel p-8 rounded-2xl flex flex-col relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        <div className="flex justify-between items-center mb-6 z-10">
          <div>
            <h3 className="text-xl font-bold text-white glow-text-purple">Master Vision Matrix</h3>
            <p className="text-xs text-gray-400 font-mono mt-1">
              TOTAL ASSETS: {totalImages} // SYNC STATUS: NOMINAL
            </p>
          </div>
          <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs text-neon-purple font-mono border-neon-purple/30">
            LIVE_PREVIEW_MODE
          </div>
        </div>

        <div
          className={cn(
            "flex-1 overflow-y-auto pr-2 relative transition-all duration-300 min-h-[500px]",
            dragging && "opacity-50 scale-[0.98]"
          )}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
        >
          {totalImages === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/5 rounded-xl bg-black/20">
              <ImageIcon className="w-16 h-16 opacity-20 mb-4" />
              <p className="font-mono text-sm max-w-md text-center">
                MATRIX EMPTY. <br />
                <span className="text-neon-cyan">SELECT ASSETS FROM LEFT</span> OR <span className="text-neon-purple">DRAG FILES HERE</span>.
              </p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 gap-4 space-y-4 pb-20">
              <AnimatePresence>
                {domains.map(domain => {
                  const domainImgs = domainImages[domain.name] || [];
                  return domainImgs.map((url, imgIndex) => (
                    <motion.div
                      key={`${domain.name}-${imgIndex}`}
                      layout
                      initial={{ opacity: 0, scale: 0.5, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="break-inside-avoid mb-4 relative group"
                    >
                      <div className={cn(
                        "relative rounded-xl overflow-hidden border transition-all duration-300 bg-black/40",
                        domain.name === currentDomain.name
                          ? "border-neon-cyan/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                          : "border-white/10 opacity-70 hover:opacity-100"
                      )}>
                        <img
                          src={url}
                          alt="Asset"
                          className="w-full h-auto object-cover"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                          <button
                            onClick={() => removeImage(domain.name, imgIndex)}
                            className="p-3 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all scale-90 hover:scale-100 ring-1 ring-red-500/50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Domain Tag */}
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur text-[9px] text-white font-mono rounded border border-white/10 uppercase">
                          {domain.name}
                        </div>
                      </div>
                    </motion.div>
                  ));
                })}
              </AnimatePresence>
            </div>
          )}

          {dragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-neon-cyan/10 border-2 border-neon-cyan border-dashed rounded-xl z-50 backdrop-blur-sm">
              <p className="text-neon-cyan font-bold text-xl animate-pulse tracking-widest">INITIATE UPLOAD</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
