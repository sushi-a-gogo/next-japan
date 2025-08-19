import EventRegistration from "../models/EventRegistration.js";
import UserNotification from "../models/UserNotification.js";

/**
 * notificationPoller.js
 *
 * This background process simulates a "real world" workflow.
 * In a production app, event registrations would be approved
 * by an admin or automated rule engine. Here, we fake it:
 *
 * - Users register for events -> system creates a pending notification.
 * - The poller wakes up periodically, finds due notifications,
 *   marks them delivered, and also flips the linked registration's
 *   status from "requested" to "registered".
 *
 * This makes the demo app feel more "alive" without requiring
 * an actual approval workflow or admin dashboard.
 *
 * NOTE: In a real-world system, notifications would typically
 * only reference the event or user. The registrationId link here
 * exists solely to make this simulation possible.
 */
const notificationPoller = () => {
  return setInterval(async () => {
    const now = new Date();

    const notifications = await UserNotification.find({
      pending: true,
      sendAt: { $lte: now },
    });

    for (const notification of notifications) {
      const reg = await EventRegistration.findById(notification.registrationId);

      if (reg && reg.status !== "cancelled") {
        reg.status = "registered"; // simulate approval
        await reg.save();
      }
      // Deliver notification (e.g., just mark pending=false)
      notification.pending = false;
      await notification.save();

      // Optionally, push to a real-time service (Socket.io, Pusher, etc.)
    }
  }, 60_000); // check every minute
};

export default notificationPoller;
