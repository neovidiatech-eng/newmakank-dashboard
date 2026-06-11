
  import { SelectReq } from "@/validations/Select.schema";
import { z } from "zod";
  
  
  
  
  
  import { noSchema } from "@/validations/String.schema";
  export const ScheduleSchema = (t: TFunction, branchId?: any, deliveryId?: any) => {
  return z.object({
    // branchId is required only when neither branchId nor deliveryId is pre-provided
    branchId: !!branchId || !!deliveryId ? noSchema() : SelectReq(t),
    // deliveryId is accepted for delivery schedules (hidden when provided)
    deliveryId: !!deliveryId ? noSchema() : noSchema(),
    day: SelectReq(t),
    openingTime: noSchema(),
    closingTime: noSchema(),
    is24Hours: z.array(z.string()).optional()
  });
};

  export type ScheduleType = z.infer<
	ReturnType<typeof ScheduleSchema>
  >;
  
  