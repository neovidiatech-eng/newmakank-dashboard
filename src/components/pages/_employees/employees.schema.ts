import { SelectReq } from "@/validations/Select.schema";
import { EmailReq, StringReq } from "@/validations/String.schema";
import { z } from "zod";

import { noSchema } from "@/validations/String.schema";
export const EmployeesSchema = (t: TFunction, isEdit: boolean) => {
  return z.object({
    name: StringReq(t),
    email: EmailReq(t),
    phone: StringReq(t).refine((val) => /^\+200?1[0125]\d{8}$/.test(val), {
      message: t("enterValidEgyptianPhone")
    }),
    password: isEdit ? noSchema() : StringReq(t, 6),
    roleId: SelectReq(t)
  });
};

export type EmployeesType = z.infer<ReturnType<typeof EmployeesSchema>>;
