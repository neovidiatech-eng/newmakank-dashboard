import { stores } from "@/pages/dashboard/stores/types";
import { CheckCircle2, Layers, Star } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";
import { getEnv } from "@/lib/env";

interface StoreHeroProps {
  data: stores;
}

export function StoreHero({ data }: StoreHeroProps) {
  const t = useTranslations();
  const imgUrl = getEnv("VITE_API_IMG_URL");

  const getName = (obj: { en: string; ar: string } | undefined) => {
    return obj?.en || obj?.ar || "N/A";
  };

  return (
    <div className="relative w-full h-56 md:h-72 rounded-xl overflow-hidden group">
      <Image
        src={imgUrl + data?.cover || "/placeholder-cover.jpg"}
        alt="Store Cover"
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        priority
      />
      {/* Scrim: stronger at bottom, minimal at top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full px-6 md:px-8 pb-5 md:pb-6 flex items-end gap-5">
        {/* Logo */}
        <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg bg-white flex-shrink-0">
          <Image
            src={imgUrl + data?.logo || "/placeholder-logo.jpg"}
            alt="Store Logo"
            fill
            className="object-cover"
          />
        </div>

        {/* Identity */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight truncate">
              {getName(data?.name)}
            </h1>
            {data?.isVerified && (
              <CheckCircle2 className="h-5 w-5 text-blue-400 fill-blue-400/20 flex-shrink-0" aria-label={t("Verified")} />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
              <span className="font-medium text-white">{data?.rating}</span>
              <span>({data?.review} {t("reviews")})</span>
            </div>

            {data?.Module?.name && (
              <>
                <span className="text-white/40">·</span>
                <div className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{getName(data?.Module?.name)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
