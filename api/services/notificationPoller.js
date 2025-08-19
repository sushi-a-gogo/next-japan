import EventRegistration from "../models/EventRegistration.js";
import UserNotification from "../models/UserNotification.js";

const notificationPoller = (intervalMs = 60_000) => {
  return setInterval(async () => {
    const now = new Date();

    try {
      // Step 1: Find all notifications that are due
      const notifications = await UserNotification.find({
        pending: true,
        sendAt: { $lte: now },
      }).lean(); // lean = plain JS objects (faster for batch ops)

      if (!notifications.length) return;

      const regIds = notifications.map((n) => n.registrationId);

      // Step 2: Update all matching registrations that aren’t cancelled
      const result = await EventRegistration.updateMany(
        { _id: { $in: regIds }, status: { $ne: "cancelled" } },
        { $set: { status: "registered" } }
      );

      // Step 3: Split notifications into "deliver" vs "delete"
      const validRegIds = await EventRegistration.find(
        { _id: { $in: regIds }, status: "registered" },
        { _id: 1 }
      ).lean();

      const validIdSet = new Set(validRegIds.map((r) => r._id.toString()));

      const deliverIds = notifications
        .filter((n) => validIdSet.has(n.registrationId.toString()))
        .map((n) => n._id);

      const deleteIds = notifications
        .filter((n) => !validIdSet.has(n.registrationId.toString()))
        .map((n) => n._id);

      // Step 4: Bulk update notifications
      if (deliverIds.length) {
        await UserNotification.updateMany(
          { _id: { $in: deliverIds } },
          { $set: { pending: false } }
        );
      }

      if (deleteIds.length) {
        await UserNotification.deleteMany({ _id: { $in: deleteIds } });
      }

      console.log(
        `Poller processed ${notifications.length} notifications → delivered ${deliverIds.length}, deleted ${deleteIds.length}`
      );
    } catch (err) {
      console.error("Poller batch error:", err);
    }
  }, intervalMs);
};

export default notificationPoller;
