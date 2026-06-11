'use client';
import { Calendar } from "lucide-react";


export default function DateCol({
    date,
    // dateOptions
}: {
    date: string;
    // dateOptions?: {
    //     year: 'numeric';
    //     month: 'short'; day: 'numeric'; hour: '2-digit'; minute: '2-digit';
    // }
}) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="flex justify-start  items-start gap-0.5 text-[12px] text-gray-600 dark:text-gray-300 whitespace-nowrap">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
        </div>
    );
}