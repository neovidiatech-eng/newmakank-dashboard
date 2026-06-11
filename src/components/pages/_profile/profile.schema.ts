import { z } from "zod";

import { StringNotReq, StringReq } from "@/validations/String.schema";

import { noSchema } from "@/validations/String.schema";
export const ProfileSchema = (t: TFunction) => {
  return z.object({
    name: StringReq(t),
    email: StringNotReq(),
    phone: noSchema(),
    image:noSchema()
  });
};

export type ProfileType = z.infer<ReturnType<typeof ProfileSchema>>;
