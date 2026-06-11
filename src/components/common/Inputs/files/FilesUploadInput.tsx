import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";
import { useCallback, useRef, useState } from "react";
import { BiCloud } from "react-icons/bi";

export default function FilesUploadInput({
  name,
  maxSelections,
  onChange,
  minSelections,
  value,
  onRemove
}: {
  onRemove?: (value: string) => Promise<{
    success: boolean;
  } | void>;
  name?: string;
  maxSelections?: number;
  minSelections?: number;
  onChange?: (files: (File | string)[]) => void;
  value: (File | string)[];
}): JSX.Element {
  const [files, setFiles] = useState<(File | string)[]>(value ?? []);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);
  const t = useTranslations();
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(() => {
      // const isValidType = ['image/jpeg', 'image/png'].includes(file.type)
      const isValidType = true;
      // const isValidSize = file.size <= 1024 * 1024 // 1MB
      const isValidSize = true;
      return isValidType && isValidSize;
    });

    onChange?.([...files, ...validFiles]);
    setFiles(prev => {
      const newFileList = [...prev, ...validFiles];
      return newFileList.slice(0, 24); // Maximum 24 files
    });
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };
  const removeFile = async (index: number) => {
    const tempFiles = [...files];
    setFiles(prev => {
      const updatedFiles = prev.filter((_, i) => i !== index);
      onChange?.(updatedFiles);
      return updatedFiles;
    });
    if (typeof files[index] === "string" && onRemove) {
      const res = await onRemove?.(files[index]);
      if (res && res.success == false) {
        setFiles(tempFiles);
      }
      return;
    }
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="space-y-1.5"></div>
      <div
        onClick={openFileDialog}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFileDialog();
          }
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload files"
        className={cn(
          "relative border-2 border-dashed rounded-lg p-4",
          "hover:bg-muted/50 transition-colors duration-200 cursor-pointer",
          dragActive && "border-primary bg-muted/50",
          "min-h-[200px]",
          "w-full"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          name={name}
          min={minSelections}
          max={maxSelections}
          accept="image/jpeg,image/png"
          onChange={e => {
            if (onChange) {
              onChange(Array.from(e.target.files || []));
            }
            onFileSelect(e);
          }}
          className="hidden"
        />

        {files.length === 0 ? (
          <div className="!h-full min-h-[200px] flex flex-col items-center align-middle justify-center gap-4">
            <BiCloud className="h-10 w-10 text-muted-foreground" color="gray" />
            <p className="text-muted-foreground text-Grey font-bold text-[14px]">
              {t("dragImagesHereOrClickToBrowse")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
            {files.map((file, index) => (
              <div key={index} className="relative group aspect-square">
                <Image
                  src={typeof file === "string" ? file : URL?.createObjectURL(file)}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent opening file dialog
                    removeFile(index);
                  }}
                  className="absolute bg-Red -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" fill="white" />
                </button>
              </div>
            ))}
            {files.length < 24 && (
              <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
                <BiCloud className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
