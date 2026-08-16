

import { fetchHelper } from "@/api/fetch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getTranslations } from '@/lib/i18n';
import BlockCustomerButton from "@/components/pages/_customers/BlockCustomerButton";

interface Customer {
  id: number;
  name: string;
  allowNotification: boolean;
  email: string;
  phone: string;
  verified: boolean;
  Branch: null | any;
  roleKey: string;
  active: boolean;
  image: string;
  Details: {
    wallet: number;
    points: number;
  };
  createdAt: string;
  deletedAt: null | string;
  totalOrders: number;
  totalSpent: number;
}

const page = async ({ params }: { params: Params }) => {
  const t = await getTranslations();
  const response = await fetchHelper({
    endPoint: ['customers', Number((await params).id)],
    method: "GET",
  });

  const customer: Customer = response.data;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 shrink-0">
                <AvatarImage src={customer.image} alt={customer.name} />
                <AvatarFallback>{customer.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{customer.name}</CardTitle>
                <p className="text-muted-foreground text-sm">{customer.email}</p>
                <p dir="ltr" className="text-muted-foreground text-sm">{customer.phone}</p>
              </div>
            </div>
            {/* Block / Unblock Action */}
            <div className="flex items-center gap-2 shrink-0">
              <BlockCustomerButton
                customerId={customer.id}
                isActive={customer.active}
                customerName={customer.name}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant={customer.active ? "default" : "destructive"}>
              {customer.active ? t('Active') : "🚫 محظور"}
            </Badge>
            <Badge variant={customer.verified ? "default" : "outline"}>
              {customer.verified ? t('Verified') : t('Unverified')}
            </Badge>
            <Badge variant="outline">{customer.roleKey}</Badge>
            {customer.allowNotification && (
              <Badge variant="secondary">{t('Notifications Enabled')}</Badge>
            )}
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{customer.Details?.wallet ?? 0}</p>
              <p className="text-sm text-muted-foreground">{t('Wallet Balance')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{customer.Details?.points ?? 0}</p>
              <p className="text-sm text-muted-foreground">{t('Points')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{customer.totalOrders}</p>
              <p className="text-sm text-muted-foreground">{t('Total Orders')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{customer.totalSpent}</p>
              <p className="text-sm text-muted-foreground">{t('Total Spent')}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('Customer ID')}:</span>
              <span>{customer.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('Created At')}:</span>
              <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
            </div>
            {customer.deletedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('Deleted At')}:</span>
                <span>{new Date(customer.deletedAt).toLocaleDateString()}</span>
              </div>
            )}
            {customer.Branch && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('Branch')}:</span>
                <span>{customer.Branch.name || 'N/A'}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
