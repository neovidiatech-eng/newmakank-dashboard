import { Link } from "@/lib/navigation";

export default function LinkColumn({ href, name }: { href: string; name: string }): JSX.Element {
  return (
    <div className="flex justify-center items-center">
      <Link href={href} className="text-primary hover:underline">
        {name}
      </Link>
    </div>
  );
}
