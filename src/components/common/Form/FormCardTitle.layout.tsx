export default function FormCardTitle({
  title,
  icon,
}: {
  icon?: JSX.Element;
  title: string | JSX.Element;
}) {
  return (
    <div className="col-span-6 flex flex-wrap items-center justify-between gap-2 text-[21px] font-semibold">
      <div className="flex items-center gap-2">
        <span className="mx-1"> {icon}</span>
        {title}
      </div>
    </div>
  );
}
