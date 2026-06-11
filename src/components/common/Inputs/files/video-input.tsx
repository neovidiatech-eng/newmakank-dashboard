import type React from "react";
import { useEffect, useRef, useState } from "react";
import { FileVideo, Upload, X, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n";
const API_IMG_URL = import.meta.env.VITE_API_IMG_URL;

type VideoInputProps = {
  name: string;
  onChange?: (file: File | null) => void;
  onControlChange?: (file: File | null) => void;
  value?: File | string;
  className?: string;
  disabled?: boolean;
};

export default function VideoInput({
  name,
  onChange,
  value,
  onControlChange,
  className,
  disabled = false
}: VideoInputProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = useTranslations();
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    setIsLoading(true);
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setFileName(file.name);
    onChange?.(file);
    onControlChange?.(file);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleReset = () => {
    setVideoSrc(null);
    setFileName("");
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    onChange?.(null);
    onControlChange?.(null);
    if (videoRef.current) {
      videoRef.current.src = "";
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) {
      handleFileChange(file);
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;

    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVideoLoad = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsLoading(false);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    // Handle initial value from API
    if (value && typeof value === "string") {
      setIsLoading(true);
      const videoUrl = value.startsWith("http") ? value : API_IMG_URL + value;
      setVideoSrc(videoUrl);
      setFileName(value.split("/").pop() || "");

      // Reset video element if ref exists
      if (videoRef.current) {
        videoRef.current.load();
      }
    } else if (value instanceof File) {
      setIsLoading(true);
      const url = URL.createObjectURL(value);
      setVideoSrc(url);
      setFileName(value.name);
    } else {
      // Reset states if no value
      setVideoSrc(null);
      setFileName("");
    }

    // Cleanup function
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
      }
      // Cleanup blob URLs
      if (videoSrc?.startsWith("blob:")) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [value]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {!videoSrc ? (
        <Card
          className={cn(
            "border-2 border-dashed p-6 text-center flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="font-medium text-sm">{t("Drop your video here or")}</p>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-primary"
              disabled={disabled}
            >
              {t("browse files")}
            </Button>
          </div>
          <p className="text-xs text-gray-500">{t("Supported formats: MP4, WebM, Ogg")}</p>
          <input
            ref={fileInputRef}
            type="file"
            name={name}
            onChange={handleInputChange}
            accept="video/*"
            className="sr-only"
            aria-label="Choose video"
            disabled={disabled}
          />
        </Card>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
          )}

          <div className="relative aspect-video bg-black">
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleVideoLoad}
              onEnded={handleVideoEnded}
              onClick={togglePlayPause}
            >
              <track kind="captions" src="" label="English" />
              {t("Your browser does not support the video tag")}
            </video>

            {!isPlaying && !isLoading && (
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-12 h-12"
                onClick={togglePlayPause}
              >
                <Play className="h-5 w-5" />
              </Button>
            )}
          </div>

          <div className="p-3 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <div
                className="flex-1 cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={handleSeek}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSeek(e as unknown as React.MouseEvent<HTMLDivElement>);
                  }
                }}
              >
                <Progress value={(currentTime / duration) * 100} className="h-2" />
              </div>

              <span className="text-xs text-gray-500 min-w-[60px] text-right">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <FileVideo className="w-2 h-2" />
                </div>
                <span className="text-sm font-medium truncate max-w-[200px]" title={fileName}>
                  {fileName}
                </span>
              </div>

              {!disabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  onClick={handleReset}
                >
                  <X className="w-3 h-3 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
