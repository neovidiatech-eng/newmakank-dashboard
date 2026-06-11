export const links = ({ permissions }: { permissions: Permission }): NavItem[] => {
  return (
    [
      permissions?.statistics?.get && {
        title: "Dashboard",
        url: "/dashboard"
      },
      permissions?.statistics?.get && {
        title: "activityLogs",
        url: "/dashboard/logs"
      },
      permissions?.Stores?.get && {
        title: "stores",
        url: "/stores"
      },
      permissions?.Modules?.get && {
        title: "modules",
        url: "/modules"
      },
      permissions?.Schedule?.get && {
        title: "schedule",
        url: "/schedule"
      },
      permissions?.Branches?.get && {
        title: "branches",
        url: "/branches"
      },

      permissions?.Rating?.get && {
        title: "rating",
        url: "/rating"
      },

      (permissions?.Banners?.get ||
        permissions?.Categories?.get ||
        permissions?.Service?.get ||
        permissions?.Coupons?.get ||
        permissions?.["Social Media"]?.get ||
        permissions?.["store-categories"]?.get) && {
        title: "content",
        items: [
          permissions?.Banners?.get && {
            title: "banners",
            url: "/banners"
          },
          permissions?.Banners?.get && {
            title: "fortuneWheel",
            url: "/banners/fortune-wheel"
          },
          (permissions?.Banners?.get || permissions?.Coupons?.get) && {
            title: "campaignsCenter",
            url: "/campaigns"
          },
          permissions?.Categories?.get && {
            title: "category",
            url: "/category"
          },
          permissions?.Service?.get && {
            title: "services",
            url: "/services"
          },
          permissions?.Coupons?.get && {
            title: "coupons",
            url: "/coupons"
          },
          {
            title: "variationTemplate",
            url: "/variationTemplate"
          },
          permissions?.["Social Media"]?.get && {
            title: "socialMedia",
            url: "/socialMedia"
          }
        ].filter(Boolean)
      },

      (permissions?.Roles?.get ||
        permissions?.Permissions?.get ||
        permissions?.Users?.get ||
        permissions?.Customers?.get ||
        permissions?.specialists?.get) && {
        title: "users & access",
        items: [
          permissions?.Roles?.get && {
            title: "roles",
            url: "/roles"
          },
          permissions?.Permissions?.get && {
            title: "permissions",
            url: "/permissions"
          },
          {
            title: "delivery",
            url: "/delivery"
          },
          permissions?.Users?.get && {
            title: "users",
            url: "/users"
          },
          permissions?.Customers?.get && {
            title: "customers",
            url: "/customers"
          }
        ].filter(Boolean)
      },

      (permissions?.Cities?.get || permissions?.Zones?.get) && {
        title: "locations",
        items: [
          permissions?.Cities?.get && {
            title: "cities",
            url: "/cities"
          },
          permissions?.Zones?.get && {
            title: "zones",
            url: "/zones"
          }
        ].filter(Boolean)
      },

      (permissions?.Orders?.get || permissions?.Complaints?.get) && {
        title: "orders & support",
        items: [
          permissions?.Orders?.get && {
            title: "orders",
            url: "/orders"
          },
          permissions?.Orders?.get && {
            title: "archivedOrders",
            url: "/orders/archived"
          },
          permissions?.Complaints?.get && {
            title: "complaint",
            url: "/complaint"
          }
        ].filter(Boolean)
      },

      (permissions?.withdraw?.get ||
        permissions?.banks?.get ||
        permissions?.fund?.get ||
        permissions?.transactions?.get ||
        permissions?.bankAccounts?.get ||
        permissions?.wallet?.get) && {
        title: "accounting",
        items: [
          permissions?.withdraw?.get && {
            title: "withdraw",
            url: "/withdraw"
          },
          permissions?.banks?.get && {
            title: "banks",
            url: "/banks"
          },
          permissions?.fund?.get && {
            title: "fund",
            url: "/fund"
          },
          permissions?.transactions?.get && {
            title: "transactions",
            url: "/transactions"
          },
          permissions?.bankAccounts?.get && {
            title: "bankAccounts",
            url: "/bankAccounts"
          },
          permissions?.wallet?.get && {
            title: "wallet",
            url: "/wallet"
          }
        ].filter(Boolean)
      },
      permissions?.settings?.get && {
        title: "settings",
        url: "/settings"
      }
    ]
      .map(item => {
        if (!item || !("items" in item)) {
          return item;
        }

        if (!item?.items?.length) {
          return undefined;
        }

        return item;
      })
      .filter(Boolean) as NavItem[]
  ).filter(Boolean) as NavItem[]; // Filter out any undefined values
};
