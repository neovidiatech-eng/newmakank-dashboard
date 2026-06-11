import { queryClient } from "@/lib/queryClient";

export async function revalidatePathAction(path: string) {
  await queryClient.invalidateQueries({ queryKey: [path] });
}
