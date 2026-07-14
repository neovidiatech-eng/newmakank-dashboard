export const links = ({ permissions }: { permissions: Permission }): NavItem[] => {
  return (
    [

      permissions?.statistics?.get && {
        title: "Dashboard",
        url: "/dashboard"
      },
      permissions?.logs?.get && {
        title: "activityLogs",
        url: "/logs"
      },
      permissions?.Stores?.get && {
        title: "stores",
        url: "/stores"
      },
      (permissions?.["categories"]?.get || permissions?.categories?.get) && {
        title: "categories",
        url: "/category"
      },
      (permissions?.["store-templates"]?.get || permissions?.storeTemplates?.get) && {
        title: "storeTemplates",
        url: "/store-templates"
      },
      permissions?.Schedule?.get && {
        title: "schedule",
        url: "/schedule"
      },
      permissions?.Branches?.get && {
        title: "branches",
        url: "/branches"
      },

      permissions?.Service?.get && {
        title: "services",
        url: "/services"
      },

      (permissions?.Banners?.get ||
        permissions?.Rating?.get ||
        permissions?.Coupons?.get ||
        permissions?.Service?.get ||
        permissions?.["Social Media"]?.get ||
        permissions?.["store-categories"]?.get ||
        permissions?.campaigns?.get ||
        permissions?.["variation-templates"]?.get ||
        permissions?.["fortune-wheel"]?.get) && {
        title: "content",
        items: [
          permissions?.Banners?.get && {
            title: "banners",
            url: "/banners"
          },
          (permissions?.Banners?.get || permissions?.["fortune-wheel"]?.get) && {
            title: "fortuneWheel",
            url: "/banners/fortune-wheel"
          },
          permissions?.campaigns?.get && {
            title: "campaignsCenter",
            url: "/campaigns"
          },
          permissions?.Rating?.get && {
            title: "rating",
            url: "/rating"
          },
          permissions?.Coupons?.get && {
            title: "coupons",
            url: "/coupons"
          },
          permissions?.Service?.get && {
            title: "Offers",
            url: "/offers"
          },
          permissions?.["variation-templates"]?.get && {
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
        permissions?.Employees?.get ||
        permissions?.Customers?.get ||
        permissions?.delivery?.get ||
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
          permissions?.delivery?.get && {
            title: "delivery",
            url: "/delivery"
          },
          permissions?.Users?.get && {
            title: "users",
            url: "/users"
          },
          permissions?.Employees?.get && {
            title: "employees",
            url: "/employees"
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
        permissions?.fund?.get ||
        permissions?.transactions?.get ||
        permissions?.wallet?.get ||
        permissions?.delivery?.get) && {
        title: "accounting",
        items: [
          permissions?.withdraw?.get && {
            title: "withdraw",
            url: "/withdraw"
          },
          permissions?.fund?.get && {
            title: "fund",
            url: "/fund"
          },
          permissions?.transactions?.get && {
            title: "transactions",
            url: "/transactions"
          },
          permissions?.wallet?.get && {
            title: "wallet",
            url: "/wallet"
          },
          permissions?.delivery?.get && {
            title: "Driver Withdrawals",
            url: "/delivery/withdrawals"
          },
          permissions?.delivery?.get && {
            title: "Cash Settlements",
            url: "/delivery/cash-settlements"
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
