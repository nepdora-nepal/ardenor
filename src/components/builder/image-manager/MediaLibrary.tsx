"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Check } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/config/site";
import { useImages } from "@/hooks/use-images";

interface MediaLibraryProps {
    selectedImage: string | null;
    onSelect: (image: string) => void;
}

export function MediaLibrary({ selectedImage, onSelect }: MediaLibraryProps) {
    const { data: images, isLoading: isLoadingImages, isError } = useImages();

    return (
        <ScrollArea className="h-full">
            <div className="p-4 sm:p-6">
                {isLoadingImages ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center h-40 text-destructive">
                        Failed to load images
                    </div>
                ) : (
                    <div className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images && Object.entries(images).map(([key]) => (
                            <div
                                key={key}
                                className={cn(
                                    "relative group cursor-pointer aspect-square rounded-lg overflow-hidden border-2 transition-all shadow-sm bg-muted/30 hover:bg-muted/50",
                                    selectedImage === key ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent hover:border-muted-foreground/25"
                                )}
                                onClick={() => onSelect(key)}
                            >
                                <div className="absolute inset-2">
                                    <Image
                                        src={getImageUrl(key)}
                                        alt={key}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                {selectedImage === key && (
                                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                        <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
                                            <Check className="h-4 w-4" />
                                        </div>
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] sm:text-xs p-1.5 truncate text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    {key}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ScrollArea>
    );
}

