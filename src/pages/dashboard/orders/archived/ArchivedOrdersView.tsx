import ArchivedOrdersColumns from "./ArchivedOrdersColumns";
import TableBasic from "@/components/common/table/TableBasic";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useSearchParams } from "@/lib/navigation";

type ArchivedOrdersViewProps = {
  tableTitle: string;
};

export default function ArchivedOrdersView({ tableTitle }: ArchivedOrdersViewProps) {
  const searchParams = useSearchParams();
  const columns = ArchivedOrdersColumns();

  const params: Record<string, unknown> = {};
  searchParams.forEach((value, key) => { params[key] = value; });

  const { data: response } = useApiQuery({
    queryKey: ["ordersArchived", JSON.stringify(params)],
    endPoint: ["ordersArchived"],
    params,
    staleTime: 0
  });

  const orders: Record<string, unknown>[] = Array.isArray(response?.data) ? response.data : [];
  const total = response?.total ?? orders.length;

  return (
    <TableBasic
      data={orders}
      hideCreateNew
      columns={columns}
      pagination={{ total }}
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
      }, {
        name: 'fromDate',
        type: 'date'
      }, {
        name: 'toDate',
        type: 'date'
      }]}
    />
  );
}
