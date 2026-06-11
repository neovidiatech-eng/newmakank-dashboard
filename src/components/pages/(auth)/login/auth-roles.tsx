import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, usePathname } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Crown, GraduationCap, Shield, User, Users } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { useSearchParams } from "@/lib/navigation";

interface RolesDisplayProps {
  data: Roles[];
}

const getRoleIcon = (roleName: RoleKey) => {
  switch (roleName.toLowerCase()) {
    case "admin":
      return <Crown className="size-6" />;
    case "teacher":
      return <GraduationCap className="size-6" />;
    case "student":
      return <User className="size-6" />;
    case "parent":
      return <Users className="size-6" />;
    default:
      return <Shield className="size-6" />;
  }
};

const getRoleColor = (roleName: RoleKey) => {
  switch (roleName.toLowerCase()) {
    case "admin":
      return "text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-950 dark:hover:bg-red-900";
    case "teacher":
      return "text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-950 dark:hover:bg-blue-900";
    case "student":
      return "text-green-600 bg-green-50 hover:bg-green-100 dark:text-green-400 dark:bg-green-950 dark:hover:bg-green-900";
    case "parent":
      return "text-purple-600 bg-purple-50 hover:bg-purple-100 dark:text-purple-400 dark:bg-purple-950 dark:hover:bg-purple-900";
    default:
      return "text-gray-600 bg-gray-50 hover:bg-gray-100 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700";
  }
};

export default function AuthRules({ data }: RolesDisplayProps) {
  const baseUrl = usePathname();
  const t = useTranslations();
  const searchParams = useSearchParams();

  const createRoleUrl = (role: Roles) => {
    const params = new URLSearchParams({
      roleName: role.name
    });
    return `${baseUrl}?${params.toString()}`;
  };
  console.log(data, "asd2");
  return (
    <div className="w-full max-w-4xl mx-auto mt-16 md:pt-2 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t("Available Roles")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{t("Select a role to continue")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {data?.map(role => (
          <Link key={role.id} href={createRoleUrl(role)}>
            <Card
              className={cn(
                `cursor-pointer flex flex-col items-center text-center transition-all duration-200 hover:shadow-lg hover:scale-105 ${getRoleColor(role.name)} border-2 hover:border-current`,
                searchParams.get("roleName") === role.name
                  ? "border-current dark:border-white"
                  : "border-transparent"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-center space-x-2">
                    {getRoleIcon(role.name)}
                    <CardTitle className="text-lg font-semibold">{t(role.name)}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{t("Click to select")}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
