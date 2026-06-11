import ArchivedOrdersColumns from "./ArchivedOrdersColumns";
import TableBasic from "@/components/common/table/TableBasic";
import { useTranslations } from "@/lib/i18n";

type ArchivedOrdersViewProps = {
  orders: Record<string, unknown>[];
  total?: number;
  tableTitle: string;
};

export default function ArchivedOrdersView({ orders, total, tableTitle }: ArchivedOrdersViewProps) {
  // Call the column factory here (valid hook context) so useTranslations() inside it runs correctly
  const columns = ArchivedOrdersColumns();

  return (
    <TableBasic
      data={orders}
      hideCreateNew
      columns={columns}
      pagination={{
        total: total ?? orders?.length
      }}
      tableActions={{
        onInfo: true,
        fixedActions: true
      }}
      cardHeader={tableTitle}
      filters={[{
        name: 'branchId',
        type: 'selectPaginated',
        apiUrl: ['branches']
      }, {
        name: 'deliveryId',
        type: 'selectPaginated',
        apiUrl: ['deliveryAll']
      }, {
        name: 'userId',
        type: 'selectPaginated',
        apiUrl: ['users']
      }]}
    />
  );
}
