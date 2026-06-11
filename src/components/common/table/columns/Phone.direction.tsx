import { Phone } from "lucide-react";

interface PhoneDirectionColProps {
    value: string;
}

export default function PhoneDirectionCol({ value }: PhoneDirectionColProps) {
    if (!value) return <span>-</span>;

    return (
        <a
            href={`tel:${value}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline"
            dir="ltr"
        >
            <Phone className="h-4 w-4" />
            {value}
        </a>
    );
}