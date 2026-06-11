export default function TextCol({ text }: { text: string }) {
  return (
    <div className="flex justify-start  items-start gap-0.5 text-[12px] text-gray-600 dark:text-gray-300 whitespace-nowrap">
      <span>{text}</span>
    </div>
  );
}
