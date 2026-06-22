import { ImageIcon } from "@radix-ui/react-icons";
import { Trash2 } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";
import React, { useEffect, useState, useRef } from "react";
const API_IMG_URL = import.meta.env.VITE_API_IMG_URL;
interface ImgInputProps {
  alt?: string;
  name?: string;
  value?: string;
  className?: string;
  onChange?: (e: File | string | undefined) => void;
  accept?: string;
  ratio?: string;
}

export default function ImgInput({
  alt,
  name,
  value,
  onChange,
  className,
  accept = "image/*",
  ratio = "1:1"
}: ImgInputProps): JSX.Element {
  const [fileName, setFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations();

  useEffect(() => {
    if (value && typeof value === "string") {
      setPreviewUrl(API_IMG_URL + value);
      setFileName(value.split("/").pop() || "");
    } else if (!value) {
      setPreviewUrl("");
      setFileName("");
    }

    return () => {
      // Cleanup only blob URLs
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [value]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    // Ensure file is actually a File object before creating URL
    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      // Clean up previous URL if exists
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(objectUrl);
      onChange?.(file);
    } else {
      onChange?.(undefined);
    }
  };
  const ratioStep = 100;
  const [width, height] = ratio.split(":").map(Number);

  return (
    <div className={`flex flex-col-reverse justify-end gap-2 h-full items  ${className}`}>
      <div className="flex justify-center items-center">
        <div
          className="relative w-full flex items-center  rounded-lg overflow-hidden dark:bg-gray-800 bg-gray-100"
          style={{
            alignContent: "center",
            width: `${width * ratioStep}px`,
            height: `${height * ratioStep}px`
            // aspectRatio: getAspectRatio()
          }}
        >
          <div className="max-w-[250px] max-h-[350px] ">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={alt || "Preview"}
                data-testid={name}
                fill
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute flex-col inset-0 flex items-center justify-center">
                <ImageIcon className="size-12 text-gray-400" />
                {ratio && (
                  <span className="font-normal text-sm text-gray-500">
                    {" "}
                    {t("ratio")} : <span className="text-red-500">{ratio}</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <label
        className="flex items-center gap-3 mt-1 p-1 border-2 border-dashed 
                         dark:border-gray-800 border-gray-300 rounded-lg hover:border-gray-400 
                          cursor-pointer transition-colors"
      >
        <div
          className="flex items-center justify-center w-8 h-8  dark:bg-gray-800
                               bg-gray-50 rounded-lg text-gray-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex-1 text-sm">
          {fileName ? (
            <span className="text-gray-700 text-wrap truncate">{fileName.length > 25 ? fileName.slice(0, 25) + "..." : fileName}</span>
          ) : (
            <span className="text-gray-500">{t("Choose image file")}...</span>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          name={name}
          onChange={handleChange}
          accept={accept}
          className="hidden"
          aria-label={alt || "Choose file"}
        />
      </label>
      {fileName && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setFileName("");
            setPreviewUrl("");
            if (previewUrl && previewUrl.startsWith("blob:")) {
              URL.revokeObjectURL(previewUrl);
            }
            if (inputRef.current) {
              inputRef.current.value = "";
            }
            onChange?.("");
          }}
          className="text-xs text-red-500 hover:text-red-600 transition-colors flex items-center justify-center gap-1 mt-1"
          type="button"
        >
          <Trash2 className="w-4 h-4" />
          {t("Remove file")}
        </button>
      )}
    </div>
  );
}
