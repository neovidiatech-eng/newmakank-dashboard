import { ImageCell } from "./img-cell";
import PhoneDirectionCol from "./Phone.direction";

type EntityInfoCellProps = {
  image?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
};

export default function EntityInfoCell({ image, name, email, phone }: EntityInfoCellProps) {
  return (
    <div className="flex items-center gap-3 min-w-[230px]">
      <div className="shrink-0">
        {image ? (
          <ImageCell cell={image} className="w-12 h-12 rounded-full" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-muted" />
        )}
      </div>
      <div className="flex flex-col gap-0.5 text-sm">
        {name && <span className="font-medium text-foreground leading-tight">{name}</span>}
        {email && <span className="text-muted-foreground leading-tight">{email}</span>}
        {phone && (
          <span className="text-muted-foreground leading-tight">
            <PhoneDirectionCol value={phone} />
          </span>
        )}
      </div>
    </div>
  );
}
