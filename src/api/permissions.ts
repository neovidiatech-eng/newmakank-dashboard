import { fetchHelper } from "./fetch";

export default async function getPermissions(): Promise<Permission> {
  const {
    data: permissions
  }: ApiResponse<
    {
      id: number;
      name: string;
      method: ("get" | "post" | "put" | "patch" | "delete")[];
    }[]
  > = await fetchHelper({
    endPoint: ['myPermissions'],
    method: "GET",
    locale: "en",
    isLocalized: true,
    cache: "force-cache"
  });
  const output = permissions?.reduce((acc, curr) => {
    // Define all possible methods
    const allMethods = ["get", "post", "put", "patch", "delete", "manage"];

    // Initialize all methods with false
    const methodsObject = allMethods.reduce((methodsInit, method) => {
      methodsInit[method] = false;
      return methodsInit;
    }, {});

    // Set true for the methods that exist
    curr.method.forEach(method => {
      methodsObject[method] = true;
    });

    acc[curr.name] = methodsObject;
    return acc;
  }, {});

  return output as Permission;
}
