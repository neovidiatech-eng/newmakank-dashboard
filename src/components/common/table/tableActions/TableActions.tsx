import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useTranslations } from "@/lib/i18n";
import Link from "@/lib/Link";
import { usePathname } from "@/lib/navigation";
import { BiMenu } from "react-icons/bi";
import { TableActionsType } from "../table.types";
import ChangeStatusTableAction from "./ChangeStatusTableAction";
import DeleteBtn from "./DeleteBtn.action";
import EditBtn from "./EditBtn.action";
import InfoBtn from "./InfoBtn";
export default function TableActions({
  onInfo,
  onEdit,
  onDelete,
  onChangeStatus,
  additionalActions,
  renderRowActions,
  id,
  rowData,
  // route,
  status,
  // className,
  // defaultApiPath,
  statusOptions,
  links,
  children,
  statusKey
}: TableActionsType & { id: string; rowData?: Record<string, unknown> } & React.HtmlHTMLAttributes<HTMLDivElement>): JSX.Element {
  const t = useTranslations();
  const pathname = usePathname();
  return (
    <div className="flex  justify-center items-center gap-1">
      {onChangeStatus && (
        <ChangeStatusTableAction
          endpoint={onChangeStatus}
          options={statusOptions ?? []}
          type="select"
          id={id}
          status={status || ""}
          statusKey={statusKey}
        />
      )}
      {onInfo && <InfoBtn onInfo={onInfo as string} id={id} />}
      {renderRowActions && rowData && renderRowActions(rowData)}
      {onEdit && <EditBtn onEdit={onEdit as string} id={id} />}
      {children}
      {links &&
        links.map((link, index) => (
          <Link
            key={index}
            href={`${pathname}/${id}/${link.href}`}
            className="bg-update font-bold p-2 rounded-lg"
          >
            <Button variant="outline">{t(link.label)}</Button>
          </Link>
        ))}
      {onDelete && <DeleteBtn onDelete={onDelete} id={id} />}
      {additionalActions && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="p-1 border-2 rounded hover:bg-gray-100 dark:hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={t("More actions")}
              type="button"
            >
              <BiMenu />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-fit z-50 !h-fit p-2 bg-gray-100 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 grid gap-2 overflow-y-auto">
            <div className="flex gap-2">
              <div className="flex justify-center items-center flex-col gap-1">
                {additionalActions}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
