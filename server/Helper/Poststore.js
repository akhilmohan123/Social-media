const { Schema } = require("mongoose");
const Post = require("../model/postmodel");
const usermodel = require("../model/usermodel");
const { getAllFriends, getFriendName } = require("./getfriendsprofile");
const { mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
module.exports = {
  addpost: (content, image, name) => {
    return new Promise(async (resolve, reject) => {
      //console.log(name+"ss iss")
      let id = name.userId;
      const user = await usermodel.findOne({ Email: id });
      const username = user.Fname;
      const userid = user._id;
      const postmodel = new Post({
        Username: username,
        Userid: userid,
        Image: image,
        Description: content,
        Like: 0,
      });
      postmodel.save().then((res) => {
        resolve(res);
      });
    });
  },
  toggleLike: async (userId, postId) => {
    try {
      const post = await Post.findById(postId);

      if (!post) {
        return false; // post not found
      }

      const alreadyLiked = post.Like.includes(userId);

      const update = alreadyLiked
        ? { $pull: { Like: userId } } // unlike
        : { $addToSet: { Like: userId } }; // like

      const res = await Post.findByIdAndUpdate(postId, update, { new: true });

      return res;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  removelike: (userId, postid) => {
    return new Promise(async (resolve, reject) => {
      let res = await Post.findByIdAndUpdate(
        postid,
        { $pull: { Like: userId } },
        { $set: { isLiked: false } }, // removes the userId from likes array
        { new: true }
      );
      if (res) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  //adding image,caption,location to database a helper function
  uploadpost: (id, image, caption, location) => {
    return new Promise(async (resolve, reject) => {
      try {
        const postmodel = new Post({
          Userid: id,
          Image: image,
          Caption: caption,
          Location: location,
        });
        postmodel
          .save()
          .then((res) => {
            //console.log("Respons is ======",res)
            resolve(res);
          })
          .catch((err) => {
            //console.log(err)
            reject(err);
          });
      } catch (error) {
        //console.log(error)
        reject(error);
      }
    });
  },
  showPost: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        //console.log("Fetching posts for user: " + id);
        let friends = await getAllFriends(id);
        if(friends.length > 0) {
          console.log("Friends are " + friends);
        // Fetch posts and make them plain objects
        let posts = await Post.find({ Userid: { $in: friends } })
          .populate("Userid")
          .lean();
         console.log("Posts are " + posts);
        // Add isLiked dynamically
        posts = posts.map((p) => ({
          ...p,
          isLikedstatus: p.Like.some(
            (likeId) => likeId.toString() === id.toString()
          ),
        }));

        console.log(posts);
        resolve(posts);
      }else if(friends.length === 0) {
        resolve([]);
      }
      } catch (error) {
        console.log("Error is " + error);
        reject(error);
      }
    });
  },
  saveComment: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        let { postid, userid, comment } = data;
        let friendname = await getFriendName(userid);
        const newComment = {
          Userid: userid,
          Text: comment,
        };
        if (friendname) {
          newComment.Username = friendname;
        } else {
          newComment.Username = "Unknown";
        }
        await Post.findOneAndUpdate(
          {
            _id: postid,
          },
          {
            $push: { Comment: newComment },
          },{
            new:true
          }
        );
        resolve(true);
      } catch (error) {
        console.log("Error is " + error);
      }
    });
  },
};
