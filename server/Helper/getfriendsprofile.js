const Friend = require("../model/Friendsmodel");
const Post = require("../model/postmodel");
const usermodel = require("../model/usermodel");
module.exports = {
  getfriendsprofile: (id) => {
    let friend_details = {};
    let friends = [];
    let total_images = [];
    let followers;
    return new Promise(async (resolve, reject) => {
      await usermodel
        .findById(id)
        .then((res) => {
          (friend_details.Fname = res.Fname),
            (friend_details.Lname = res.Lname),
            (friend_details.image = res.Image)
        })
        .catch((error) => {
          friend_details.error = true;
        });
      await Post.find({ Userid: id })
        .then((res) => {
          total_images = res.map((i) => i.Image);
          if (res) {
            console.log("locztion is ======"+res)
            friend_details.friendpost = total_images;
            friend_details.totalpost = total_images.length;
            friend_details.location = res[0].Location;
          } else {
            friend_details.friendpost = "";
          }
        })
        .catch((error) => {
          friend_details.error = true;
        });
      await Friend.find({ Userid: id }).then((res) => {
        //console.log(res)
        //console.log(res.length)
        followers = res.length;

        friend_details.followers = followers;
      });
      resolve(friend_details);
    });
  },
  //function to get all users id based on the friends and return it
  getAllFriends: async (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        await Friend.find({ Userid: id })
          .then((res) => {
            console.log(res);
            if (res.length == 0) {
              resolve([]);
            }
            if (res) {
              res.forEach((val) => {
                resolve(val.Friendsid);
              });
            }
          })
          .catch((error) => reject(error));
      } catch (error) {
        consol.log(error);
        reject(error);
      }
    });
  },

  //function to get the friendname based on the id
  getFriendName: (id) => {
    let name = "";
    return new Promise(async (resolve, reject) => {
      try {
        //console.log("called helper function")
        await usermodel
          .findOne({ _id: id })
          .then((res) => {
            ////console.log("user found"+res)
            ////console.log(res)
            if (
              (res.Fname = "" || res.Fname != null || res.Fname != undefined)
            ) {
              name += res.Fname;
            }
            if (
              res.Lname != "" ||
              res.Lname != null ||
              res.Lname != undefined
            ) {
              name += res.Lname;
            }
            ////console.log("name is "+name)
            resolve(name);
          })
          .catch((err) => {
            //console.log("there is an error")
            //console.log(err)
            reject(err);
          });
      } catch (error) {
        //console.log(error)
        reject(error);
      }
    });
  },
};
