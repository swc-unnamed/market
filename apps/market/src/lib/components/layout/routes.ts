import { GlobalAdminAccessPolicy, GlobalAuctioneerAccessPolicy } from '$lib/utils/access-policies';

export type Route = {
  title: string;
  href: string;
  icon?: string;
  isHref?: boolean;
  nested?: NestedRoute[];
  accessPolicy: string[];
  disablePrefetch?: boolean;
  initialOpen?: boolean;
};

export type NestedRoute = Omit<Route, "nested">;

export const getOrganizationRoutes = (orgSlug: string): Route[] => {
  return [
    {
      title: "Dashboard",
      href: `/org/${orgSlug}/dashboard`,
      icon: "lucide:layout-dashboard",
      accessPolicy: ['Owner', 'Admin'],
    },
  ];
};

export const getAuctioneerRoutes = (): Route[] => {
  return [
    		{
			title: 'Auction House Admin',
			icon: 'lucide:settings',
			href: '/auction-house/admin',
			accessPolicy: GlobalAuctioneerAccessPolicy
		},
  ]
}

export const getAdminRoutes = (): Route[] => {
  return [
    {
      title: "Users",
      href: "/admin/users",
      icon: "lucide:users",
      accessPolicy: GlobalAdminAccessPolicy,
    },
    // {
    // 	title: "Organizations",
    // 	href: "/admin/organizations",
    // 	icon: "tabler:binary-tree-2",
    // 	accessPolicy: GlobalAdminAccessPolicy,
    // },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: "lucide:settings",
      accessPolicy: GlobalAdminAccessPolicy,
      nested: [
        {
          title: "Beta Access",
          href: "/admin/settings/beta",
          icon: "lucide:users",
          accessPolicy: GlobalAdminAccessPolicy,
        },
        {
          title: "Live Auctions",
          href: "/admin/settings/live-auctions",
          icon: "lucide:hammer",
          accessPolicy: GlobalAdminAccessPolicy,
        }
      ],
    },
  ];
};