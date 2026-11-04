import { Server } from "socket.io";
import express from 'express';
import path from 'path';
import os from 'os';
import serve from 'koa-static';
export default {
  /**
   * 🚀 Called when Strapi starts up
   * 
   */

  // register({ strapi }: { strapi: any }) {
  //   const plugin = strapi.plugin('users-permissions');

  //   // 2. Extend Email Confirmation Controller
  //   const originalConfirm = plugin.controller('auth').emailConfirmation;
  //   plugin.controller('auth').emailConfirmation = async (ctx: any) => {
  //     const { confirmation } = ctx.query;
  //     // console.log({confirmation}, ">>>>>>>>>>>")
  //     const user = await strapi.db
  //       .query("plugin::users-permissions.user")
  //       .findOne({ where: { confirmationToken: confirmation } });

  //     await originalConfirm(ctx);
  //     // console.log({user}, ">>>>>>>>>>>")

  //     if (user) {
  //       await strapi.plugin("email").service("email").send({
  //         to: user.email,
  //         subject: "🎉 Welcome to EduCandle!",
  //         html: `<h2>Welcome ${user.username} 👋</h2><p>Activated!</p>`,
  //       });
  //     }
  //   };
  // },
  register({ strapi }: { strapi: any }) {
    
    const plugin = strapi.plugin('users-permissions');
    plugin.controller('user').find = async (ctx: any) => {
      // Get pagination params from query (e.g. ?pagination[page]=1&pagination[pageSize]=10)
      // Default to page 1, limit 25 if not provided
      const { pagination } = ctx.query;
      const page = parseInt(pagination?.page) || 1;
      const pageSize = parseInt(pagination?.pageSize) || 10;
      const start = (page - 1) * pageSize;

      // Use the internal db query to fetch only the slice we need
      const users = await strapi.db.query('plugin::users-permissions.user').findMany({
        where: ctx.query.filters || {}, // Support filtering
        limit: pageSize,
        offset: start,
        orderBy: ctx.query.sort || { createdAt: 'desc' },
        populate: ctx.query.populate || [],
      });

      // Get total count for the 'meta' object
      const total = await strapi.db.query('plugin::users-permissions.user').count({
        where: ctx.query.filters || {},
      });

      // Return the standard Strapi 5 response format
      ctx.body = {
        data: users,
        meta: {
          pagination: {
            page,
            pageSize,
            pageCount: Math.ceil(total / pageSize),
            total,
          },
        },
      };
    };

    // Extend Email Confirmation Controller
    const originalConfirm = plugin.controller('auth').emailConfirmation;

    plugin.controller('auth').emailConfirmation = async (ctx: any) => {
      const { confirmation } = ctx.query;

      // 1. Find user BEFORE confirmation clears the token
      const user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({ where: { confirmationToken: confirmation } });

      // 2. Execute original Strapi confirmation logic
      await originalConfirm(ctx);

      if (user) {
        // 3. Calculate Expiry Date (createdAt + 35 days)
        const creationDate = new Date(user.createdAt);
        const expiryDate = new Date(creationDate);
        expiryDate.setDate(expiryDate.getDate() + 35);

        // 4. Update the user record with affiliate_expiredAt and affiliateJoinedAt
        await strapi.db.query("plugin::users-permissions.user").update({
          where: { id: user.id },
          data: {
            affiliate_expiredAt: expiryDate,
          },
        });

        // 5. Send Welcome Email
        await strapi.plugin("email").service("email").send({
          to: user.email,
          subject: "🎉 Welcome to EduCandle!",
          html: `<h2>Welcome ${user.username} 👋</h2>
                 <p>Active affiliate account by purchase full course!</p>
                 <p>Note: After 35-day affiliate window expires on <b>${expiryDate.toDateString()}</b>.</p>`,
        });
      }
    };
  },
  async bootstrap({ strapi }: { strapi: any }) {
    const httpServer = strapi.server?.httpServer;

    if (!httpServer) {
      console.error("❌ No HTTP server found — Socket.IO cannot attach");
      return;
    }

    // 🔹 Initialize Socket.IO
    const io = new Server(httpServer, {
      cors: {
        origin: "*", // Replace with frontend domain in production
        methods: ["GET", "POST"],
      },
    });

    console.log("✅ Socket.IO initialized — waiting for connections...");
    const onlineUsers = new Map();
    const COMMUNITY_ROOM = "COMMUNITY_ROOM";

    io.on("connection", (socket) => {
      console.log("🟢 New connection:", socket.id);

      /**
       * 👥 Join Personal Chat (Student ↔ Mentor)
       */
      socket.on("joinChat", async ({ senderId, receiverId }) => {
        const roomA = `personal_${senderId}_${receiverId}`;
        const roomB = `personal_${receiverId}_${senderId}`;
        socket.join(roomA);
        socket.join(roomB);
        // socket.join("community");
        console.log(`👥 User ${senderId} joined rooms: ${roomA}, ${roomB}`);
        onlineUsers.set(senderId, socket.id);
        //  socket.on('typing', (userName) => {
        //         socket.to(ROOM).emit('typing', userName);
        //     });

        //     socket.on('stopTyping', (userName) => {
        //         socket.to(ROOM).emit('stopTyping', userName);
        //     });
        // ✅ Update Strapi user to online
        await strapi.db.query("plugin::users-permissions.user").update({
          where: { id: senderId },
          data: { is_online: true },
        });

        io.emit("userActive", { userId: senderId, is_online: true });
      });

      socket.on("typingMentor", ({ senderId, receiverId }) => {
        const roomA = `personal_${senderId}_${receiverId}`;
        const roomB = `personal_${receiverId}_${senderId}`;
        console.log("✏️ Typing from mentor:", { senderId, receiverId, roomA, roomB });
        socket.to([roomA, roomB]).emit("typingMentor", { senderId, receiverId });
      });

      socket.on("stopTypingMentor", ({ senderId, receiverId }) => {
        const roomA = `personal_${senderId}_${receiverId}`;
        const roomB = `personal_${receiverId}_${senderId}`;
        console.log("🛑 Stop typing from mentor:", { senderId, receiverId });
        socket.to([roomA, roomB]).emit("stopTypingMentor", { senderId, receiverId });
      });


      socket.on("leaveChat", ({ senderId, receiverId }) => {
        const roomA = `personal_${senderId}_${receiverId}`;
        const roomB = `personal_${receiverId}_${senderId}`;
        socket.leave(roomA);
        socket.leave(roomB);
        console.log(`🚪 User ${senderId} left rooms: ${roomA}, ${roomB}`);
      });

      /**
       * 🌐 Join Community Room
       */
      socket.on("joinCommunity", async ({ senderId, is_community = true }) => {
        if (!senderId) return;
        const joinedAt = new Date();
        await socket.join(COMMUNITY_ROOM);
        onlineUsers.set(senderId, socket.id);
        console.log(`🌍 ${senderId} joined community chat`);


        await strapi.db.query("plugin::users-permissions.user").update({
          where: { id: senderId },
          data: { is_online: true },
        });

        // Notify others in the room
        socket.to(COMMUNITY_ROOM).emit("roomNotice", { senderId, is_online: true, joinedAt });
      });
      socket.on("leaveCommunity", async ({ senderId }) => {
        if (!senderId) return;

        socket.leave(COMMUNITY_ROOM);
        console.log(`🚪 User ${senderId} left community chat`);

        onlineUsers.delete(senderId);

        await strapi.db.query("plugin::users-permissions.user").update({
          where: { id: senderId },
          data: { is_online: false, last_seen: new Date() },
        });

        socket.to(COMMUNITY_ROOM).emit("roomNotice", { senderId, is_online: false });
      });
      /**
       * 💬 Send Message (Personal or Community)
       */
      socket.on("sendMessage", async ({ sender, receiver, text, is_community = false, file }) => {
        if (!sender || !text) {
          console.warn("⚠️ Invalid message payload:", { sender, receiver, text, is_community });
          return;
        }

        try {
          // Save to Strapi database
          const message = await strapi.db.query("api::message.message").create({
            data: { sender, receiver, text, is_community, file },
            populate: ["file"]
          });

          // console.log("💾 Message saved:", message);

          if (receiver) {
            // 🔹 Personal chat: send to both user ↔ mentor rooms
            const roomA = `personal_${sender}_${receiver}`;
            const roomB = `personal_${receiver}_${sender}`;
            io.to([roomA, roomB]).emit("newMessage", message);
          } else {
            // 🔹 Community broadcast
            io.to(COMMUNITY_ROOM).emit("newMessage", message);
          }

        } catch (err) {
          console.error("❌ Error saving message:", err);
        }
      });

      /**
       * ✍️ Typing Indicators (Community)
       */
      socket.on("typing", (sender) => {
        if (sender) socket.to(COMMUNITY_ROOM).emit("typing", sender);
      });

      socket.on("stopTyping", (sender) => {
        if (sender) socket.to(COMMUNITY_ROOM).emit("stopTyping", sender);
      });

      /**
       * 🔴 Handle Disconnection
       */
      socket.on("disconnect", async () => {
        console.log("🔴 Socket disconnected:", socket.id);
        const userId = [...onlineUsers.entries()]
          .find(([_, id]) => id === socket.id)?.[0];

        if (userId) {
          onlineUsers.delete(userId);
          await strapi.db.query("plugin::users-permissions.user").update({
            where: { id: userId },
            data: { is_online: false, last_seen: new Date() },
          });
          console.log(`⏱️ User ${userId} marked offline`);
          io.emit("userActive", { userId, is_online: false, last_seen: new Date() });
          io.emit("roomNotice", { senderId: userId, is_online: false, last_seen: new Date() });
        }

      });
    });

    // Optional: expose io for use elsewhere in Strapi controllers/services
    strapi.io = io;


    //  const desktopPath = path.join(os.homedir(), 'Desktop/uploads');
    //   const UPLOADS_PATH =
    //   process.env.NODE_ENV === "production"
    //     ? "/var/www/uploads"
    //     : path.join(os.homedir(), "Desktop/uploads");


    //    strapi.server.app.use(async (ctx, next) => {
    //   if (ctx.path.startsWith("/uploads")) {
    //     ctx.path = ctx.path.replace("/uploads", "");
    //     await serve(UPLOADS_PATH)(ctx, next);
    //   } else {
    //     await next();
    //   }
    // });

    //  const uploadsPath = '/Desktop/uploads';

    // strapi.server.app.use(async (ctx, next) => {
    //   if (ctx.path.startsWith('/uploads')) {
    //     ctx.path = ctx.path.replace('/uploads', '');
    //     await serve(uploadsPath)(ctx, next);
    //   } else {
    //     await next();
    //   }
    // });

    // You can call this function from a custom controller or a bootstrap script.
    // await syncWalletBalances();

    // strapi.db.lifecycles.subscribe({
    //   models: ['plugin::users-permissions.user'],

    //   async afterUpdate(event:any) {
    //     const { result, params } = event;
    //     console.log("🔄 User updated:", { result, params });
    //     // 'result' is the user after update
    //     // 'params.data' contains the fields that were sent in the update request

    //     const isNowConfirmed = result.confirm_affiliate_payment === true;
    //     const wasUpdateAction = params.data.hasOwnProperty('confirm_affiliate_payment');

    //     if (isNowConfirmed && wasUpdateAction) {
    //       console.log(`💰 Payment confirmed for User ID: ${result.id}. Distributing commissions...`);

    //       try {
    //         // Call your commission service
    //         // Note: Ensure this service is registered in src/api/affiliate/services/...
    //         await strapi
    //           .service("api::affiliate.affiliate")
    //           .distributeLevelCommission(result.id);

    //       } catch (err) {
    //         strapi.log.error(`Failed to distribute commission for user ${result.id}: ${err.message}`);
    //       }
    //     }
    //   },
    // });

    console.log("🚀 Lifecycle Subscriber Initialized");
    // strapi.db.lifecycles.subscribe({
    //   models: ['api::payment.payment'],

    // //   // src/api/payment/content-types/payment/lifecycles.js
    // async afterUpdate(event:any) {
    //   const { result } = event;

    //   // Fetch with relations
    //   const fullPayment = await strapi.documents('api::payment.payment').findOne({
    //     documentId: result.documentId,
    //     populate: ['course', 'user'],
    //   });
    //    console.log("🔄 Payment updated:", { fullPayment });
    //   const isSuccess = fullPayment?.payment_status === 'SUCCESS';
    //   const targetCourseIds = ['yijrnm2mbfm4rxxm5mumf0gb', 'w7ru2um7ouxua9yxsw7c81i8', 's49yybok4tyc4hpb41m645rh'];
    //    console.log("isSuccess:=>>>>>>>>>>", { isSuccess });

    //   if (isSuccess && fullPayment.course && targetCourseIds.includes(fullPayment.course.documentId)) {
    //     await strapi.service('api::affiliate.affiliate').processAffiliateUpgrade(fullPayment.user.id);
    //   }
    // }
    // });

   strapi.db.lifecycles.subscribe({
  models: ['api::payment.payment'],

  async afterUpdate(event) {
    const { result } = event;

    if (!result?.documentId) return;

    const fullPayment = await strapi.documents('api::payment.payment').findOne({
      documentId: result.documentId,
      populate: {
        course: true,
        user: true,
      },
    });

    if (!fullPayment || !fullPayment.user) return;

    await strapi.service("api::affiliate.affiliate").handlePaymentUpdate(fullPayment);
  },
});

    // Payments verified before the refund hold existed must not start a hold if an admin edits them later
    await strapi.db.query("api::payment.payment").updateMany({
      where: { payment_status: "SUCCESS", verified_at: { $null: true } },
      data: { verified_at: new Date() },
    });

    strapi.db.lifecycles.subscribe({
      models: ['api::refund.refund'],

      async afterUpdate(event: any) {
        if (event.result?.refund_status !== 'approved') return;

        await strapi.service("api::affiliate.affiliate").handleRefundApproved(event.result.id);
      },
    });

    // strapi.db.lifecycles.subscribe({
    //   // Try using the specific model UID
    //   models: ['plugin::users-permissions.user'],

    // async afterUpdate(event: any) {
    //   const { result, params } = event;

    //   // Debugging: See what Strapi is actually sending
    //   console.log("Log: Update detected on user", result.id);

    //   // In v5, params.data might be nested or result might 
    //   // return differently depending on if it's a "document" update
    //   const isConfirmed = result.confirm_affiliate_payment === true;
    //   const isExpired = result.level_5_commission_window_expired === false;


    //   // We check params.data to ensure the field was actually part of THIS save operation
    //   if (isExpired && isConfirmed && params.data.hasOwnProperty('confirm_affiliate_payment')) {
    //     console.log("💰 TRIGGERING COMMISSION for ID:", result.id);

    //     try {
    //       const today = new Date();
    //       const expiryDate = new Date();
    //       expiryDate.setDate(today.getDate() + 35);

    //       // ✅ Update user table fields
    //       await strapi.entityService.update(
    //         'plugin::users-permissions.user',
    //         result.id,
    //         {
    //           data: {
    //             affiliateJoinedAt: today,
    //             level_5_commission_window_expiredAt: expiryDate,
    //           },
    //         }
    //       );
    //       await strapi
    //         .service("api::affiliate.affiliate")
    //         .distributeLevelCommission(result.id);
    //     } catch (error) {
    //       console.error("Commission Error:", error);
    //     }
    //   }
    // },



    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],

      async afterCreate(event: any) {
        const { result } = event;

        try {
          // Create the wallet for the new user
          await strapi.entityService.create('api::wallet.wallet', {
            data: {
              total_balance: 0,
              total_earned: 0,
              total_withdrawn: 0,
              locked_amount: 0,
              wallet_status: 'ACTIVE',
              user: result.id, // Links the wallet to the user
              publishedAt: new Date(), // Important: Makes the wallet "Published" immediately
            },
          });

          strapi.log.info(`Wallet automatically created for user: ${result.username}`);
        } catch (error) {
          strapi.log.error(`Failed to create wallet for user ${result.id}: ${error.message}`);
        }
      },
    });

     strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
  async afterCreate(event) {
    const { result } = event;
    const { withdraw_amount, wallet, user, transaction_type, id: payoutId } = result;

    // Safety check: Ensure we have the required relations
    if (!wallet?.id || !user?.id) {
      strapi.log.error('Payout created without a valid wallet or user relation.');
      return;
    }

    try {
      // 1. Fetch current wallet state
      const userWallet = await strapi.entityService.findOne('api::wallet.wallet', wallet.id);
      
      const currentBalance = parseFloat(userWallet.total_balance || 0);
      const currentLocked = parseFloat(userWallet.locked_amount || 0);
      const amount = parseFloat(withdraw_amount || 0);

      // 2. Prepare Wallet Update Data
      const isDeduct = transaction_type === 'DEDUCT';
      let walletUpdateData = {
        total_balance: currentBalance - amount,
      };

      // If it's a standard withdrawal, move funds to 'locked' instead of just removing them
      if (!isDeduct) {
        // walletUpdateData.locked_amount = currentLocked + amount;
      }

      // 3. Execute Wallet Update
      await strapi.entityService.update('api::wallet.wallet', wallet.id, {
        data: walletUpdateData,
      });

      // 4. Log to Transaction History
      await strapi.entityService.create('api::transaction-history.transaction-history', {
        data: {
          amount: amount,
          direction: 'DEBIT',
          type: isDeduct ? 'DEDUCT' : 'WITHDRAW',
          transaction_status: isDeduct ? 'SUCCESS' : 'PENDING',
          wallet: wallet.id,
          earner: user.id,
          payout: payoutId,
          transdate: new Date().toISOString(),
          publishedAt: new Date(), // Ensures it's published if using Draft & Publish
        },
      });

    } catch (error) {
      strapi.log.error(`Failed to process payout logic for ID ${payoutId}: ${error.message}`);
      // In a production environment, you might want to throw the error 
      // or trigger a notification to an admin here.
    }
  }
    });
    strapi.db.lifecycles.subscribe({
      models: ['api::payout.payout'],

      async afterUpdate(event:any) {
        const { result } = event;

        // 1. Only trigger when status is updated to "PAID"
        if (result.payout_status === 'PAID') {
          try {
            // 2. Fetch the payout with the user relation using Document Service
            // We use the result.documentId from the event
            const payoutWithUser = await strapi.documents('api::payout.payout').findOne({
              documentId: result.documentId,
              populate: ['user'],
            });

            const userId = payoutWithUser?.user?.id;
            if (!userId) {
              strapi.log.warn(`Payout ${result.documentId} marked PAID but no user found.`);
              return;
            }

            // 3. Check for duplicates (Optional but recommended)
            // Prevents creating multiple debits if the admin saves the PAID status twice
            const existingDebit = await strapi.documents('api::commission.commission').findFirst({
              filters: {
                earner: { id: userId },
                transaction_for: 'WITHDRAW',
                remark: { $contains: result.documentId }
              }
            });

            if (existingDebit) return;

            // 4. Create the Debit entry in the Commissions table
            await strapi.documents('api::commission.commission').create({
              data: {
                earner: userId,
                debit: parseFloat(result.withdraw_amount || 0),
                transaction_type: 'DEBIT',
                transaction_for: 'WITHDRAW',
                transaction_status: 'SUCCESS',
                remark: `Payout Withdrawal - Ref: ${result.documentId}`,
                publishedAt: new Date(),
              },
            });

            strapi.log.info(`✅ Commission Debit logged for User ${userId}`);
          } catch (error) {
            strapi.log.error(`❌ Payout Lifecycle Error: ${error.message}`);
          }
        }
      },
    });


    //       async afterUpdate(event:any) {
    //   const { result, params } = event;

    //   // 1. Check if 'referredBy' was changed in this specific update
    //   // 'params.data' contains only the fields submitted in the current update request
    //   if (params.data && params.data.referredBy) {
    //     console.log(`🔄 User ${result.id} updated with new referrer: ${params.data.referredBy}`);
    //     // 2. Fetch the full user to get the ID of the new referrer (parentId)
    //     // and the current user's ID (childId)
    //     const userWithReferrer = await strapi.documents('plugin::users-permissions.user').findOne({
    //       documentId: result.documentId,
    //       populate: ['referredBy'],
    //     });

    //     // 3. Ensure the referrer actually exists
    //     if (userWithReferrer?.referredBy) {
    //       const parentId = userWithReferrer.referredBy.id;
    //       const childId = userWithReferrer.id;

    //       console.log(`🚀 Affiliate Flow triggered: Parent ${parentId} -> Child ${childId}`);

    //       try {
    //         await strapi.service("api::affiliate.affiliate").handleUserAffiliateFlow({
    //           parentId,
    //           childId,
    //         });
    //         console.log("✅ Success!");
    //       } catch (error) {
    //         console.error("❌ Failed:", error);
    //       }
    //     }
    //   }
    // }
    //   });
  },
};
