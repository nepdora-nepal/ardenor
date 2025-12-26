import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchImages, uploadImage } from "@/services/image-service";
import { toast } from "sonner";

export function useImages() {
    return useQuery({
        queryKey: ["images"],
        queryFn: fetchImages,
    });
}

export function useUploadImage(onSuccess?: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadImage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["images"] });
            toast.success("Image uploaded successfully");
            onSuccess?.();
        },
        onError: (error) => {
            toast.error(`Upload failed: ${error.message}`);
        },
    });
}
