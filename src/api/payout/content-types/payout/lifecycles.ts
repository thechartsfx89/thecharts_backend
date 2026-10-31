// export default {
//   async beforeUpdate(event) {
//     const { params } = event;
//     const data = params.data;
//     const where = params.where;

//     // Only act when payout_status is being set to PAID
//     if (data.payout_status !== 'PAID') return;

//     // Fetch existing payout (to avoid double update)
//     const existing = await strapi.db
//       .query('api::payout.payout')
//       .findOne({
//         where,
//         populate: { user: true },
//       });

//     if (!existing) return;

//     // Prevent double processing
//     if (existing.payout_status === 'PAID') {
//       throw new Error('Payout already marked as PAID');
//     }

//     const userId = existing.user?.id;
//     const withdrawAmount = Number(existing.withdraw_amount || 0);

//     if (!userId || withdrawAmount <= 0) return;

//     // Fetch wallet
//     const wallet = await strapi.db
//       .query('api::wallet.wallet')
//       .findOne({
//         where: {
//           user: { id: userId },
//         },
//       });

//     if (!wallet) {
//       throw new Error('Wallet not found for user');
//     }

//     // Update wallet
//     await strapi.db
//       .query('api::wallet.wallet')
//       .update({
//         where: { id: wallet.id },
//         data: {
//           total_withdrawn:
//             Number(wallet.total_withdrawn || 0) + withdrawAmount,
//           total_balance:
//             Number(wallet.total_balance || 0) - withdrawAmount,
//           locked_amount:
//             Math.max(
//               Number(wallet.locked_amount || 0) - withdrawAmount,
//               0
//             ),
//           last_transaction_at: data.paid_date || new Date(),
//         },
//       });
//   },
// };


export default {
  async beforeUpdate(event) {
    const { params } = event;
    const { data, where } = params;

    // 1. Check if payout_status is being updated to 'PAID'
    if (data.payout_status === 'PAID') {
      
      // 2. Fetch the current state of the record to check its previous status
      const existing = await strapi.db
        .query('api::payout.payout')
        .findOne({ where });

      // 3. Only set the date if it wasn't already PAID (prevents overwriting on every save)
      if (existing && existing.payout_status !== 'PAID') {
        data.paid_date = new Date();
        
        strapi.log.info(`Payout ID ${existing.id} marked as PAID. Setting paid_date.`);
      }
    }

    // 4. Optional: Clear the paid_date if the status is moved back to PENDING/REJECTED
    if (data.payout_status && data.payout_status !== 'PAID') {
      data.paid_date = null;
    }
  },
};