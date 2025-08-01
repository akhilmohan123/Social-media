const { set } = require("mongoose");
const Group = require("../model/GroupModel");
const Messagemodel = require("../model/Messagemodel");
const { getuserid } = require("./Getuser");
const Notification = require("../model/Notification");
const GroupMessage = require("../model/GroupMessage");
const usermodel = require("../model/usermodel");

module.exports = {
  addMessage: async (req, res) => {
    const { chatId, senderId, text } = req.body;
    const Message = new Messagemodel({
      chatId,
      senderId,
      text,
    });
    try {
      const result = Message.save().then((result) => {
        res.status(200).json(result);
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getMessages: async (req, res) => {
    const { chatId } = req.params;
    //console.log("clicked");
    try {
      const result = await Messagemodel.find({ chatId });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  },
  createGroup: async (header, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await getuserid(header);
        //if no user is there resolve false

        if (!user) {
          resolve(false);
        }
        //console.log("group name is ", data.groupName);
        //if user is there create group
        //console.log(user);
        let group = new Group({
          groupname: data.name,
          groupImage: data.image,
          admin: user.userId,
          memebers: [user.userId],
          groupDescription: data.description,
          groupType: data.type,
        });
        await group
          .save()
          .then((result) => {
            //console.log("Group created successfully", result);
            resolve(result);
          })
          .catch((error) => {
            //console.log("Error in creating group", error);
            reject(error);
          });
      } catch (error) {
        //console.log("Error in createGroup:", error);
        reject(error);
      }
    });
  },
  getUserGroups: async (req) => {
    return new Promise(async (resolve, reject) => {
      let user = await getuserid(req.headers);
      if (!user) {
        reject("user not found");
        return;
      }
      try {
        let groups = await Group.find({
          $or: [{ admin: user.userId }, { members: user.userId }],
        });
        //console.log(groups.length);
        //if the groups are found resolve the groups
        if (groups.length > 0) {
          resolve(groups);
        } else {
          resolve("No groups found for the user");
        }
      } catch (error) {
        reject("Error in fetching user groups " + error);
      }
    });
  },
  getAllgroups: async (req) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await getuserid(req.headers);
        if (!user) {
          reject("user not found");
          return;
        } else {
          //console.log("user is" + user);
          //fetch groups that is not user part
          let groups = await Group.find({
            $and: [
              { members: { $ne: user.userId } },
              { admin: { $ne: user.userId } },
            ],
          });
          if (groups) {
            //console.log("groups are", groups);
            resolve(groups);
          } else {
            resolve("No groups found");
          }
        }
      } catch (error) {
        reject("Error in fetching all groups:" + error);
      }
    });
  },
  joinGroup: async (req) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await getuserid(req.headers);
        if (!user) {
          reject("user not found");
          return;
        }
        let groupJoined = await Group.findOne({
          _id: req.body.groupId,
        });
        if (!groupJoined) {
          reject("Group not found");
          return;
        }
        //check if user is already a memeber of the group
        if (groupJoined.members.includes(user.userId)) {
          resolve("User is already a member of the group");
          return;
        }
        //if user is not a member of the group then add the user to the group
        await groupJoined
          .updateOne({
            $push: { members: user.userId },
          })
          .then((result) => {
            //console.log("user joined the group successfully", result);
            resolve(result);
          });
      } catch (error) {
        reject("Error in joining group:" + error);
      }
    });
  },
  //function to request to join the group
  requestJoinGroup: async (req) => {
    return new Promise(async (resolve, reject) => {
      try {
        //console.log(req.headers);
        let user = await getuserid(req.headers);
        if (!user) {
          reject("user not found");
          return;
        }
        let group = await Group.findOne({
          _id: req.body.groupId,
        });
        if (!group) {
          reject("Group not found");
          return;
        }
        if (group.joinRequests.includes(user.userId)) {
          resolve("User has already requested to join the group");
          return;
        }
        await group
          .updateOne({
            $push: { joinRequests: user.userId },
          })
          .then((result) => {
            //console.log("User has requested to join the group" + result);
            resolve(result);
          })
          .catch((error) => {
            //console.log("Error in requesting to join the group", error);
            reject("Error in requesting to join the group:" + error);
          });
      } catch (error) {
        //console.log("Error in request join group:", error);
        reject("Error in request join group:" + error);
      }
    });
  },
  getGroupname: async (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        await Group.find({ _id: id }).then((response) => {
          if (response) {
            //console.log(9);
            //console.log(response);
            resolve(response[0].groupname);
          }
        });
      } catch (error) {
        resolve(error);
      }
    });
  },
  Acceptgroupjoin: async (data) => {
    return new Promise(async (resolve, reject) => {
      var updatednotification;
      try {
        if (data.id) {
          //console.log("data is " + data.id);
          //if data.id is present then find the notification and mark it as read is true
          updatednotification = await Notification.findOneAndUpdate(
            {
              notificationid: data.id,
            },
            {
              $set: { read: true, status: "accepted" },
            },
            { new: true }
          );
          //console.log("notification marked as read");
          //console.log(updatednotification);
        }
        const groupid = data.fromUser.groupId;
        //console.log("group id is " + groupid);
        // Perform the update with the correct syntax
        const updatedGroup = await Group.findByIdAndUpdate(
          groupid, // Pass only groupid, no object wrapping
          {
            $push: { members: data.fromUser.id }, // Add user to members array
            $pull: { joinRequests: data.fromUser.id }, // Remove user from joinRequests array
          },
          { new: true } // Return the updated document
        );
        //console.log("updated one " + updatedGroup); // Log the updated group
        resolve({ updatednotification }); // Resolve the promise with the updated group
      } catch (error) {
        console.error("Error accepting group join:", error);
        reject(error); // Reject the promise with the error
      }
    });
  },
  Rejectgroupjoin: async (data) => {
    let updatednotification;
    return new Promise(async (resolve, reject) => {
      try {
        const groupid = data.fromUser.groupId;
        if (data.id) {
          //console.log("data is " + data.id);
          //if data is present update the notification as marked
          updatednotification = await Notification.findOneAndUpdate(
            {
              notificationid: data.id,
            },
            {
              $set: {
                read: true,
                status: "rejected",
              },
            },
            { new: true }
          );
        }
        //console.log(updatednotification);
        // Perform the update with the correct syntax
        const updatedGroup = await Group.findByIdAndUpdate(
          groupid, // Pass only groupid, no object wrapping
          {
            $pull: { joinRequests: data.fromUser.id }, // Remove user from joinRequests array
          },
          { new: true } // Return the updated document
        );

        //console.log("updated one " + updatedGroup); // Log the updated group
        resolve(updatednotification); // Resolve the promise with the updated group
      } catch (error) {
        console.error("Error accepting group join:", error);
        reject(error); //reject the promise with error
      }
    });
  },
  groupStatus: async (req) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { groupId, user } = req.query;
        if (!groupId || !user) {
          return reject("Group ID and user ID are required");
        }
        const group = await Group.findById(groupId);
        if (!group) {
          return reject("Group not found");
        }
        const isMember = group.members.includes(user);
        resolve({ groupId, user, isMember });
      } catch (error) {
        reject(error);
      }
    });
  },

  saveGroupMessage: (req) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (req.body) {
          //console.log(req.body);
          const { groupname, groupID, sender, text, timestamp } = req.body;

          const message = new GroupMessage({
            groupname,
            groupID,
            sender,
            text,
            timestamp,
          });

          const savedMessage = await message.save();
          //console.log(savedMessage);
          if (savedMessage) {
            resolve(true);
          } else {
            reject("Message not saved");
          }
        } else {
          reject("No request body");
        }
      } catch (error) {
        reject(error); // Reject with the actual error for better debugging
      }
    });
  },
  fetchGroupmessage: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (id) {
          await GroupMessage.find({ groupID: id })
            .sort({ timestamp: 1 })
            .then((res) => {
              //console.log(res);
              resolve(res);
            })
            .catch((err) => {
              //console.log(err);
              reject(false);
            });
        }
      } catch (error) {
        //console.log(error);
        reject(false);
      }
    });
  },
  fetchGroupmembers: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        var userData;
        var userDetails;
        let { groupid, user } = data;
        const group = await Group.findById(groupid).lean(); // use `.lean()` for faster performance if you're not modifying it

        if (!group) {
          reject(false);
        }
        //console.log(group);

        //console.log(user);

        // Filter out the current user
        const filteredMembers = group.members;
        if (filteredMembers.length > 0) {
           userDetails = await Promise.all(
            filteredMembers.map(async (element) => {
              const userData = await usermodel
                .findById(element)
                .select("Fname");
              return userData?.Fname || null;
            })
          );
        }

        //console.log(userDetails);
        //console.log(userDetails);
        //console.log("userfromfetch");
        resolve(userDetails);
      } catch (err) {
        //console.log(err);
        reject(false);
      }
    });
  },
};
