import { Card } from "@/components/ui/card";
import KeyLabel from "@/components/ui/KeyLabel";
import { useTranslations } from "@/lib/i18n";
import React from "react";
import BackButton from "./BackButton";
import ContentTextSection from "./ContentTextSection";
import ImageSection from "./ImageSection";

function DefaultItemDetailsCreator({
  data
}: {
  data: { [key: string]: unknown };
}): JSX.Element {
  const t = useTranslations();
  const format = {
    dateTime(value: Date, options: Intl.DateTimeFormatOptions) {
      return new Intl.DateTimeFormat(localStorage.getItem("locale") || "ar", options).format(
        value instanceof Date ? value : new Date(value)
      );
    }
  };
  if (!data)
    return <div className="p-8 text-center text-muted-foreground">{t("No Data Available")}</div>;

  const isKeyImage = (key: string) =>
    key == "image" ||
    key == "mainImage" ||
    key == "logo" ||
    key == "certificateOfBirth" ||
    key == "images" ||
    key == "commercialRecord" ||
    key == "attachments" ||
    key == "identifyImage" ||
    key == "icon" ||
    key == "thumbnail" ||
    key == "cover";

  const images = Object?.keys(data)
    .filter(key => isKeyImage(key))
    .map(key =>
      !Array.isArray(data[key])
        ? { url: data[key] as string, key: key }
        : (data[key] as string[]).map(item => {
          return { url: item, key: key };
        })
    )
    .flat();

  const mainImages = images.filter(image => image.key !== "commercialRecord" && image.url);
  const documentImages = images.filter(image => image.key === "commercialRecord" && image.url);

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-card overflow-hidden">
        {mainImages.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-card-foreground">{t("Images")}</h3>
            <ImageSection images={mainImages} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object?.keys(data).map((key, index) => {
            if (isKeyImage(key)) return null;

            if (
              key.toLowerCase().includes("date") ||
              key.toLowerCase().includes("time") ||
              key === "date" ||
              key === "blockAt" ||
              key === "activatedAt" ||
              key === "updatedAt" ||
              key === "createdAt"
            ) {
              const date = format.dateTime(data[key] as Date, {});

              return (
                <div
                  className="px-2 py-1 rounded-md hover:bg-muted/40 transition-colors"
                  key={index}
                >
                  <ContentTextSection label={key} content={date} />
                </div>
              );
            }

            if (React.isValidElement(data[key])) {
              return (
                <div
                  className="px-2 py-1 rounded-md hover:bg-muted/40 transition-colors"
                  key={index}
                >
                  <div className="flex items-center gap-3">
                    <KeyLabel label={key} />
                    {data[key]}
                  </div>
                </div>
              );
            }

            return (
              (typeof data[key] == "string" || typeof data[key] == "number") && (
                <div
                  className="px-2 py-1 rounded-md hover:bg-muted/40 transition-colors"
                  key={index}
                >
                  <ContentTextSection label={key} content={data[key]} />
                </div>
              )
            );
          })}
        </div>

        {documentImages.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-4 text-lg font-semibold text-card-foreground">{t("Documents")}</h3>
            <ImageSection images={documentImages} />
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <BackButton />
        </div>
      </Card>
    </div>
  );
}

export default DefaultItemDetailsCreator;
