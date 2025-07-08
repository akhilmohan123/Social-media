const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // ID of the user who should receive this notification
    ref: 'User',
    required: true,
  },
  fromUser: {
    id: {
      type: mongoose.Schema.Types.ObjectId, // Sender (like who started the live stream or made the group request)
      ref: 'User',
    },
    name: String,
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group', // optional
    },
    groupname: String,
    username: String,
  },
  title: {
    type: String,
    required: true,
  },
  body: String,
  type: {
    type: String,
    enum: ['live-stream', 'group-joining-request', 'message', 'other'],
    required: true,
  },
  notificationid: {
    type: String,
    required: true,
    unique: true, // unique to avoid duplicate FCM payloads
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  read: {
    type: Boolean,
    default: false,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
