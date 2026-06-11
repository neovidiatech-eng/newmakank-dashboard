import { z } from "zod";

import type { SettingsFormValues } from "./settings.types";

export const SettingsSchema = (): z.ZodType<SettingsFormValues> => z.record(z.any());
