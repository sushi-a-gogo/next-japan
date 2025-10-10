import * as notificationService from "../services/notificationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authorized } from "../utils/authHelpers.js";

// GET notifications for a specific user
export const getUserNotifications = asyncHandler(async (req, res) => {
  if (!authorized(req, res, true)) return;

  const notifications = await notificationService.fetchUserNotifications(
    req.params.userId
  );
  res.json({ success: true, data: notifications });
});

// GET single notification
export const getNotification = asyncHandler(async (req, res) => {
  const notification = await notificationService.fetchNotification(
    req.params.notificationId
  );
  if (!notification) {
    return res
      .status(404)
      .json({ success: false, data: null, message: "Notification not found" });
  }
  res.json({ success: true, data: notification });
});

// POST new notification
export const createNotification = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const notificationId = await notificationService.createUserNotification(
    req.body
  );
  res.status(201).json({ success: true, data: { notificationId } });
});

// PUT update notification
export const updateNotification = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const notificationId = await notificationService.updateUserNotification(
    req.params.notificationId,
    req.body
  );
  if (!notificationId) {
    return res
      .status(404)
      .json({ success: false, data: null, message: "Notification not found" });
  }
  res.json({ success: true, data: { notificationId } });
});

// DELETE notification(s)
export const deleteNotification = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const { notificationId } = req.params;
  const { userId } = req.query;

  const result = await notificationService.deleteUserNotification(
    notificationId,
    userId
  );
  res.json({ success: true, data: result });
});
