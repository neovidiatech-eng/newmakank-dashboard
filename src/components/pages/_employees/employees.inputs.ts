import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const EmployeesInputs = ({ isEdit }: { isEdit: boolean }) => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "tel", required: true },
    { name: "password", type: "password", required: true, isHidden: isEdit },
    { name: "roleId", type: "selectPaginated", apiUrl: ["allRoles"], required: true },
    { name: "branchId", type: "selectPaginated", apiUrl: ["branches"], required: false }
  ];
  return inputs;
};
