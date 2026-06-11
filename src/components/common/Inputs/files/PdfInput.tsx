import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileIcon, UploadIcon, XIcon } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import Link from "@/lib/Link";
import React, { useEffect, useState } from "react";

interface PdfInputProps {
  name?: string;
  value?: string;
  className?: string;
  onChange?: (file: File) => void;
  disabled?: boolean;
}

const baseUrl = import.meta.env.VITE_API_URL;
export default function PdfInput({
  name,
  value,
  className,
  onChange,
  disabled = false
}: PdfInputProps): JSX.Element {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) setPdfUrl(value);
    return () => {
      if (pdfUrl && typeof pdfUrl == "string" && pdfUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [value]);

  const handleChange = (file: File | null) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Invalid file type Please select a PDF file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPdfUrl(objectUrl);
    setFileName(file.name);
    onChange?.(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleChange(file || null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
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

    const file = e.dataTransfer.files?.[0];
    handleChange(file || null);
  };

  const handleRemoveFile = () => {
    setPdfUrl("");
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    onChange?.(undefined as unknown as File);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  const t = useTranslations();

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        name={name}
        className="sr-only"
        onChange={handleFileInputChange}
        aria-label={t("Choose PDF file")}
        disabled={disabled}
      />

      {!pdfUrl ? (
        <Card
          className={cn(
            "border-2 border-dashed p-6 text-center flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={!disabled ? handleDrop : undefined}
          onClick={!disabled ? handleButtonClick : undefined}
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <UploadIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="font-medium text-sm">{t("Drop your PDF here or")}</p>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-primary"
              disabled={disabled}
            >
              {t("browse files")}
            </Button>
          </div>
          <p className="text-xs text-gray-500">{t("Only PDF files are accepted")}</p>
        </Card>
      ) : (
        <Card className="p-4 flex items-center gap-3 border">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <FileIcon className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate" title={fileName}>
              {fileName || "PDF Document"}
            </p>
            <Link
              href={baseUrl + pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              {t("Preview PDF")}
            </Link>
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="flex-shrink-0 size-8"
              onClick={handleRemoveFile}
              aria-label="Remove file"
            >
              <XIcon className="size-4" />
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
