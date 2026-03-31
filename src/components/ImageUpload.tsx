import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UploadedImage {
  url: string;
  path: string;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

function getSessionId(): string {
  let id = localStorage.getItem("pulse_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("pulse_session_id", id);
  }
  return id;
}

export function ImageUpload({ images, onImagesChange, maxImages = 3 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed.`);
      return;
    }

    setUploading(true);
    const sessionId = getSessionId();
    const newImages: UploadedImage[] = [];

    for (const file of files) {
      try {
        // Compress image
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        const ext = compressed.type === "image/png" ? "png" : "jpg";
        const path = `uploads/${sessionId}/${Date.now()}.${ext}`;

        const { error } = await supabase.storage
          .from("media")
          .upload(path, compressed, { contentType: compressed.type });

        if (error) throw error;

        const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
        newImages.push({ url: urlData.publicUrl, path });
      } catch (err) {
        console.error("[ImageUpload] Upload error:", err);
        toast.error("Failed to upload image.");
      }
    }

    onImagesChange([...images, ...newImages]);
    setUploading(false);
    // Reset input
    e.target.value = "";
  }, [images, onImagesChange, maxImages]);

  const removeImage = useCallback((index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  }, [images, onImagesChange]);

  return (
    <div className="space-y-2">
      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <div key={img.path} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-border">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            className="gap-1.5 cursor-pointer"
            asChild
          >
            <span>
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
              {uploading ? "Uploading..." : "Add image"}
            </span>
          </Button>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
