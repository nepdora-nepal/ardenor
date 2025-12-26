"use client";

import { Loader2, Upload } from "lucide-react";
import { useUploadImage } from "@/hooks/use-images";

interface UploadPaneProps {
    onUploadSuccess: () => void;
}

export function UploadPane({ onUploadSuccess }: UploadPaneProps) {
    const uploadMutation = useUploadImage(onUploadSuccess);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadMutation.mutate(file);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4 h-full">
            <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 flex flex-col items-center justify-center gap-4 w-full max-w-sm hover:bg-accent/50 transition-colors">
                <div className="bg-muted p-4 rounded-full">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">SVG, PNG, JPG or GIF</p>
                </div>
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                    accept="image/*"
                />
            </div>
            {uploadMutation.isPending && (
                <div className="flex items-center gap-2 text-primary">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                </div>
            )}
        </div>
    );
}

