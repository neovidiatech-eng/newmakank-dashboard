import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ExternalLink, Image as Img } from "lucide-react";
import Image from "@/lib/Image";
import Link from "@/lib/Link";
import { getEnv } from "@/lib/env";
import { useState } from "react";
const API_IMG_URL = getEnv("VITE_API_IMG_URL");

/**
 * Temporary workaround: backend incorrectly appends "test" to image extensions
 * e.g. "uploads/image/abc.jpgtest" → "uploads/image/abc.jpg"
 */
function sanitizeImagePath(path: string): string {
  return path.replace(/\.(jpg|jpeg|png|webp|gif|svg|bmp|avif)test$/i, ".$1");
}

export function ImageCell({ cell, className, openImgWhenClickType = 'view' }: {
  openImgWhenClickType?: "new_tab" | "download" | 'view' | 'none';
  cell: string; className?: string
}): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const placeholder = (
    <div className="flex justify-center">
      <div className={cn("w-16 h-16 rounded-md bg-muted flex items-center justify-center", className)}>
        <Img className="w-8 h-8 text-muted-foreground" />
      </div>
    </div>
  );

  // Handle missing API_IMG_URL or empty/invalid cell values or load error
  if (!API_IMG_URL || !cell || cell.trim() === '' || imgError) {
    return placeholder;
  }

  const imageUrl = `${API_IMG_URL}${sanitizeImagePath(cell)}`;

  if (openImgWhenClickType === 'view') {
    return (
      <div className="flex justify-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className={cn("relative w-16 h-16 rounded-md overflow-hidden cursor-pointer", className)}>
              <Image
                src={imageUrl}
                fill
                alt="Data image"
                className="object-cover"
                onError={() => setImgError(true)}
              />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Image View</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-full max-w-2xl h-96">
                <Image
                  src={imageUrl}
                  fill
                  alt="Full size image"
                  className="object-contain"
                />
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link href={imageUrl} target="_blank">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View in New Tab
                  </Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (openImgWhenClickType === 'none') {
    return (
      <div className="flex justify-center">
        <div className={cn("relative w-16 h-16 rounded-md overflow-hidden", className)}>
          <Image
            src={imageUrl}
            fill
            alt="Data image"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Link
        href={imageUrl}
        download={openImgWhenClickType === "download"}
        target={openImgWhenClickType === "new_tab" ? "_blank" : undefined}
        className={cn("relative w-16 h-16 rounded-md overflow-hidden", className)}
      >
        <Image
          src={imageUrl}
          fill
          alt="Data image"
          className="object-cover"
          onError={() => setImgError(true)}
        />
      </Link>
    </div>
  );
}
