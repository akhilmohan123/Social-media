const { Schema } = require("mongoose");
const Post = require("../model/postmodel");
const usermodel = require("../model/usermodel");
const { getAllFriends } = require("./getfriendsprofile");
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
  addlike: (userId, postid) => {
    return new Promise(async (resolve, reject) => {
      let res = await Post.findByIdAndUpdate(
        postid,
        { $addToSet: { Like: userId } }, // ensures no duplicates
        { new: true }
      );
      if (res) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  removelike: (userId, postid) => {
    return new Promise(async (resolve, reject) => {
      let res = await Post.findByIdAndUpdate(
        postid,
        { $pull: { Like: userId } }, // removes the userId from likes array
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
        let friends = await getAllFriends(id); //get the friends of the user
        //only need to show the friends posts
        let posts = await Post.find({ Userid: { $in: friends } }).populate(
          "Userid"
        );
        console.log(posts);
        resolve(posts);
      } catch (error) {
        reject(error);
      }
    });
  },
};
