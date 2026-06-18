import { fetchHelper } from "./fetch";

export default async function getPermissions(): Promise<Permission> {
  const {
    data: permissions
  }: ApiResponse<any> = await fetchHelper({
    endPoint: ['myPermissions'],
    method: "GET",
    isLocalized: false,
    cache: "no-store"
  });

  const output = permissions?.reduce((acc: any, curr: any) => {
    // Define all possible methods
    const allMethods = ["get", "post", "put", "patch", "delete", "manage"];

    // Initialize all methods with false
    const methodsObject = allMethods.reduce((methodsInit: any, method: string) => {
      methodsInit[method] = false;
      return methodsInit;
    }, {} as Record<string, boolean>);

    // Set true for the methods that exist
    const methodsArray = curr.method || curr.methods || [];
    methodsArray.forEach((method: any) => {
      if (typeof method === "string") {
        methodsObject[method.toLowerCase()] = true;
      } else if (method && typeof method === "object" && method.method) {
        methodsObject[method.method.toLowerCase()] = true;
      }
    });

    // Gather all possible keys for this permission to populate in the output object.
    // This handles prefix, string name, and localized name object.
    const keys: string[] = [];
    if (curr.prefix) keys.push(curr.prefix);
    if (typeof curr.name === "string") {
      keys.push(curr.name);
    } else if (curr.name && typeof curr.name === "object") {
      if (curr.name.en) keys.push(curr.name.en);
      if (curr.name.ar) keys.push(curr.name.ar);
    }

    keys.forEach(key => {
      if (key) {
        acc[key] = methodsObject;
        acc[key.toLowerCase()] = methodsObject;
      }
    });

    return acc;
  }, {});

  return (output || {}) as Permission;
}
