import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const EmployeesInputs = ({
  isEdit,
  selectedStore,
  setSelectedStore
}: {
  isEdit: boolean;
  selectedStore?: string | number | null;
  setSelectedStore?: (storeId: string | number | null) => void;
}) => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "tel", required: true },
    { name: "password", type: "password", required: true, isHidden: isEdit },
    { name: "roleId", type: "selectPaginated", apiUrl: ["allRoles"], required: true },
    {
      name: "storeId",
      type: "selectPaginated",
      apiUrl: ["stores"],
      required: false,
      onChange: (val) => setSelectedStore?.((val as string) || null)
    },
    {
      name: "branchId",
      type: "selectPaginated",
      apiUrl: ["branches"],
      required: false,
      searchFilters: selectedStore ? [{ key: "storeId", value: Number(selectedStore) }] : [],
      disabled: !selectedStore,
      placeholder: !selectedStore ? "selectStoreFirst" : undefined
    }
  ];
  return inputs;
};
