const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  fromUser: {
    id: {
      type: mongoose.Schema.Types.ObjectId, // Sender (like who started the live stream or made the group request)
      ref: 'userdetails',
    },
    name: String,
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group', // optional
    },
    groupname: String,
    username: String,
  },
  body: String,
  type: {
    type: String,
    enum: ['live-stream', 'group-joining-request', 'message', 'other','liked-post'],
    required: true,
  },
  notificationid: {
    type: String,
    required: true,
    unique: true, // unique to avoid duplicate FCM payloads
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected','ended'],
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
