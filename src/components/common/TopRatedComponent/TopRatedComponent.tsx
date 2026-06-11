import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@/lib/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { ImageCell } from "../table/columns/img-cell";

function TopRatedComponent({
  items,
  headerText,
  href
}: {
  items: {
    id: number;
    name: string;
    subName: string;
    count: number;
    image?: string;
  }[];
  href: string;
  headerText: string;
}) {
  const t = useTranslations();

  return (
    <Card className="shadow-card transition-all hover:shadow-card-hover overflow-hidden">
      <CardHeader className="p-4 flex flex-row items-center justify-between border-b">
        <h3 className="font-semibold text-card-foreground">{t(headerText)}</h3>
        <Link
          className="text-primary flex items-center gap-1 text-sm font-medium hover:underline transition-colors"
          href={href}
        >
          {t("View All")}
          <ArrowRight size={14} />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {items.map((item, index) => (
          <div
            className={`flex items-center justify-between p-4 ${
              index < items.length - 1 ? "border-b" : ""
            } hover:bg-muted/30 transition-colors`}
            key={item.id}
          >
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <ImageCell cell={item.image || ""} />
              </div>
              <div>
                <h4 className="text-sm font-medium">{item.name}</h4>
                <p className="text-xs text-muted-foreground">{item.subName}</p>
              </div>
            </div>
            <div className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-sm font-medium">
              {item.count}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">{t("No items found")}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default TopRatedComponent;
