"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { getImageUrl } from "@/config/site";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Pencil, Upload, Image as ImageIcon } from "lucide-react";
import { ImageManagerModal } from "@/components/builder/ImageManagerModal";
import { updateImageMap } from "@/services/image-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps extends ImageProps {
    fallbackSrc: string;
}

const ImageWithFallback = (props: ImageWithFallbackProps) => {
    const { src, fallbackSrc, alt, className, ...rest } = props;
    const initialSrc = typeof src === 'string' ? getImageUrl(src) : src;
    const [imgSrc, setImgSrc] = useState(initialSrc);
    const [showManager, setShowManager] = useState(false);
    const [managerTab, setManagerTab] = useState<"library" | "upload">("library");

    useEffect(() => {
        setImgSrc(typeof src === 'string' ? getImageUrl(src) : src);
    }, [src]);

    const handleImageSelect = async (newPath: string) => {
        if (!rest.id) return;

        try {
            await updateImageMap(rest.id, newPath);
            setImgSrc(getImageUrl(newPath));
            toast.success("Image updated successfully");
        } catch {
            toast.error("Failed to update image map");
        }
    };

    const isEditable = !!rest.id;

    const imageElement = (
        <Image
            {...rest}
            className={cn(className, isEditable ? "cursor-pointer" : "")}
            src={imgSrc}
            alt={alt}
            onClick={(e) => {
                if (rest.id) {
                    console.log("Image selected:", rest.id);
                }
                if (rest.onClick) {
                    rest.onClick(e);
                }
            }}
            onError={() => {
                if (imgSrc !== fallbackSrc) {
                    setImgSrc(fallbackSrc);
                }
            }}
        />
    );

    if (!isEditable) {
        return imageElement;
    }

    return (
        <div className={cn("relative group inline-block", props.fill ? "w-full h-full" : "")}>
            {imageElement}

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md bg-white/90 hover:bg-white text-black">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setManagerTab("upload"); setShowManager(true); }}>
                            <Upload className="mr-2 h-4 w-4" /> Upload New
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setManagerTab("library"); setShowManager(true); }}>
                            <ImageIcon className="mr-2 h-4 w-4" /> Choose Existing
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <ImageManagerModal
                isOpen={showManager}
                onClose={() => setShowManager(false)}
                initialTab={managerTab}
                onSelect={handleImageSelect}
            />
        </div>
    );
};

export default ImageWithFallback;
