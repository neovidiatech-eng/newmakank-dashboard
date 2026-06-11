import CustomForm from "@/components/common/Form/CustomForm";
import { testBranchesForm } from "./branches-check-form-validation";
import type { BranchesType } from "./branches.schema";
import useBranchesLogic from "./useBranchesForm.logic";

export default function BranchesFormPage({ data, storeId }: { data?: BranchesType, storeId?: number }) {
  const { inputs, t, control, formSubmit } = useBranchesLogic({ storeId, data });
  testBranchesForm();

  return (
    <CustomForm
      handleSubmit={formSubmit}
      control={control}
      cardConfig={[
        {
          id: "lang",
          title: t("Branches Information"),
          multiLang: true,
          width: 6
        }
      ]}
      inputs={inputs}
    />
  );
}


