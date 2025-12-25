"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Upload, Check } from "lucide-react";
import { fetchImages, uploadImage } from "@/services/image-service";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getImageUrl } from "@/config/site";

interface ImageManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (imagePath: string) => void;
    initialTab?: "library" | "upload";
}

export function ImageManagerModal({ isOpen, onClose, onSelect, initialTab = "library" }: ImageManagerModalProps) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { data: images, isLoading: isLoadingImages, isError } = useQuery({
        queryKey: ["images"],
        queryFn: fetchImages,
        enabled: isOpen,
    });

    const uploadMutation = useMutation({
        mutationFn: uploadImage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["images"] });
            toast.success("Image uploaded successfully");
            setActiveTab("library");
        },
        onError: (error) => {
            toast.error(`Upload failed: ${error.message}`);
        },
    });

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadMutation.mutate(file);
        }
    };

    const handleSelect = () => {
        if (selectedImage) {
            onSelect(selectedImage);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitle>Image Manager</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(v) => setActiveTab(v as "library" | "upload")} className="flex-1 flex flex-col min-h-0">
                    <div className="px-6 border-b">
                        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                            <TabsTrigger
                                value="library"
                                className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                            >
                                Media Library
                            </TabsTrigger>
                            <TabsTrigger
                                value="upload"
                                className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                            >
                                Upload New
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="library" className="flex-1 min-h-0 p-0 overflow-hidden relative">
                        <ScrollArea className="h-full p-6">
                            {isLoadingImages ? (
                                <div className="flex items-center justify-center h-40">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : isError ? (
                                <div className="flex items-center justify-center h-40 text-destructive">
                                    Failed to load images
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {images && Object.entries(images).map(([key]) => (
                                        <div
                                            key={key}
                                            className={cn(
                                                "relative group cursor-pointer aspect-square rounded-lg overflow-hidden border-2 transition-all",
                                                selectedImage === key ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent hover:border-muted-foreground/25"
                                            )}
                                            onClick={() => setSelectedImage(key)}
                                        >
                                            <Image
                                                src={getImageUrl(key)}
                                                alt={key}
                                                fill
                                                className="object-cover"
                                            />
                                            {selectedImage === key && (
                                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                                                        <Check className="h-4 w-4" />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {key}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>

                    </TabsContent>

                    <TabsContent value="upload" className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 flex flex-col items-center justify-center gap-4 w-full max-w-sm hover:bg-accent/50 transition-colors">
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
                    </TabsContent>
                </Tabs>

                <div className="p-4 border-t bg-muted/20 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSelect} disabled={!selectedImage || activeTab !== 'library'}>
                        Select Image
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
