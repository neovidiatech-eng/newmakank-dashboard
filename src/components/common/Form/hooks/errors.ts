// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getNestedError = (errors: any, path: string): string | undefined => {
  if (!path) return undefined;

  const parts = path.split(".");
  let current;
  if (parts.length === 3) {
    current = errors?.[parts[0]];
    current = current?.[parts[1]];
    current = current?.[parts[2]];
    return current?.message;
  }
};
