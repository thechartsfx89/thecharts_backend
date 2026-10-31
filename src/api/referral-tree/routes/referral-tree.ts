// /**
//  * referral-tree router
//  */

// // import { factories } from '@strapi/strapi';

// // export default factories.createCoreRouter('api::referral-tree.referral-tree');
// export default {
//   routes: [
//     {
//       method: "GET",
//       path: "/referral-tree/root",
//       handler: "referral-tree.getRootUsers",
//       config: { auth: false },
//     },
//     {
//       method: "GET",
//       path: "/referral-tree/children/:parentId",
//       handler: "referral-tree.getChildren",
//       config: { auth: false },
//     },
//     {
//       method: "GET",
//       path: "/referral-tree/upline/:userId",
//       handler: "referral-tree.getUpline",
//       config: { auth: false },
//     },
//     {
//       method: "GET",
//       path: "/referral-tree/level/:userId/:level",
//       handler: "referral-tree.getUsersByLevel",
//       config: { auth: false },
//     },
//     {
//       method: "GET",
//       path: "/referral-tree/hierarchy/:parentId",
//       handler: "referral-tree.getHierarchy",
//       config: {
//         auth: false,
//       },
//     },
//     {
//     method: "GET",
//     path: "/referral-tree/hierarchy/:userId/:level",
//     handler: "referral-tree.getHierarchyByLevel",
//     config: {
//       auth: false,
//     },
//   },
//   ],
// };

/**
 * referral-tree router
 */

// import { factories } from '@strapi/strapi';

// export default factories.createCoreRouter('api::referral-tree.referral-tree');


import { factories } from '@strapi/strapi';

// 1. Get the default core routes (POST, GET, etc.)
const defaultRouter = factories.createCoreRouter('api::referral-tree.referral-tree');

// 2. Define your custom routes manually
const customRouter = (innerRouter:any, extraRoutes:any) => {
  return {
    get routes() {
      return innerRouter.routes.concat(extraRoutes);
    },
  };
};

const myExtraRoutes = [
  {
    method: "GET",
    path: "/referral-tree/root",
    handler: "api::referral-tree.referral-tree.getRootUsers",
    config: { auth: false },
  },
  {
    method: "GET",
    path: "/referral-tree/children/:parentId",
    handler: "api::referral-tree.referral-tree.getChildren",
    config: { auth: false },
  },
  {
    method: "GET",
    path: "/referral-tree/upline/:userId",
    handler: "api::referral-tree.referral-tree.getUpline",
    config: { auth: false },
  },
  {
    method: "GET",
    path: "/referral-tree/level/:userId/:level",
    handler: "api::referral-tree.referral-tree.getUsersByLevel",
    config: { auth: false },
  },
  {
    method: "GET",
    path: "/referral-tree/hierarchy/:parentId",
    handler: "api::referral-tree.referral-tree.getHierarchy",
    config: { auth: false },
  },
  {
    method: "GET",
    path: "/referral-tree/hierarchy/:userId/:level",
    handler: "api::referral-tree.referral-tree.getHierarchyByLevel",
    config: { auth: false },
  },
];

export default customRouter(defaultRouter, myExtraRoutes);



