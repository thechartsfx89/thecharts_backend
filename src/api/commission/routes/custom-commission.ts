export default {
  routes: [
    {
      method: "GET",
      path: "/commissions/user-level-summary/:userId",
      handler: "commission.userLevelSummary",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/commissions/user-club-summary/:userId",
      handler: "commission.userClubSummary",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/transaction-history/my-history",
      handler: "commission.myHistory",
      config: {
        auth: {}, // This enables the default authenticated policy
      },
    },
    {
      method: "GET",
      path: "/commissions/my-summary",
      handler: "commission.mySummary",
      config: { auth: {} },
    },
    {
      method: "GET",
      path: "/commissions/user/:userId",
      handler: "commission.userSummary",
      config: { auth: {} }, // add admin policy if needed
    },
    {
      method: 'GET',
      path: '/commissions/stats/:userId/:year',
      handler: 'commission.getStats',
      config: { auth: false }
    },
    {
      method: 'GET',
      path: '/commissions/admin/global-summary',
      handler: 'api::commission.commission.getAdminGlobalSummary',
      config: {
        auth: {}, // Requires valid JWT
      },
    },
    {
      method: "GET",
      path: "/commissions/my-wallet-summary/:userId",
      handler: "commission.myWalletSummary",
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/commissions/admin/users-summary',
      handler: 'commission.getUsersGlobalSummary',
      config: {
        auth: {}, // JWT required
      },
    },
  ],
};
