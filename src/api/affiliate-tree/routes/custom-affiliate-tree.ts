export default {
  routes: [
    {
      method: "GET",
      path: "/affiliate-trees/hierarchy/:parentId",
      handler: "affiliate-tree.hierarchy",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/affiliate-trees/upline/:childId",
      handler: "affiliate-tree.getUpline",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/affiliate-trees/direct/:userId",
      handler: "affiliate-tree.getDirectReferrals",
      config: {
        auth: false, // set true if needed
      },
    },
    {
      method: 'GET',
      path: '/affiliate/hierarchyDashDetails/:parentId?',
      handler: 'affiliate-tree.getHierarchyDashDetails',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
