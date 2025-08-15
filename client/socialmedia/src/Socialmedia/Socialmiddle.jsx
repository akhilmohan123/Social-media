import React, { useEffect, useState } from "react";
import CreatePost from "./Createpost";
import Showfeed from "./Showfeed";
import axios from "axios";
import LoadingSpinnerComponent from "react-spinners-components";
import { useNavigate } from "react-router-dom";
import SocialmediaLCP from "./SocialmediaCP/SocialmediaLCP/SocialmediaLCP";
import SocialmediaRCP from "./SocialmediaCP/SocialmediaRCP/SocialmediaRCP";
import StreamPlayer from "../HLS/StreamPlayer";
import { useSelector } from "react-redux";
function Socialmiddle() {
  const token = localStorage.getItem("token");
  const [data, setdata] = useState([]);
  const [error, seterror] = useState(null);
  let [color, setColor] = useState("#ffffff");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const live = useSelector((state) => state.Live.LiveStatus);
  const streamstatus = useSelector((state) => state.Live.streamPlay);
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    backgroundColor: "#9de2ff",
  };
  useEffect(() => {
    alert("live status of user is ======" + live);
  }, [live]);
  useEffect(() => {
    axios
      .get("http://localhost:3001/get-post", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        setdata(res.data);
      })
      .catch((err) => {
        setLoading(false);
        seterror(err);
      });
  }, [token]);
  useEffect(() => {
    console.log("stream status is =====" + streamstatus);
  }, [streamstatus]);

  // useEffect(()=>{
  //   data?.post.forEach((item)=>{
  //     console.log(data?.name)
  //     console.log(item?.name)
  //     console.log(item?.Image)
  //     console.log(item?.Description)
  //     console.log(item?.Like)
  //     console.log(item?.createdAt)
  //   })
  // },[data])

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "lightblue",
          textAlign: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <LoadingSpinnerComponent
          color={color}
          loading={loading}
          cssOverride={override}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        backgroundColor: "#e3dede",
        minHeight: "100vh",
      }}
    >
      {/* Left Sidebar */}
      <div style={{ width: "250px" }}>
        <SocialmediaLCP />
      </div>

      {/* Middle Feed */}
      <div style={{ flex: 1, margin: "0 20px" }}>
        {streamstatus ? <StreamPlayer /> : <CreatePost />}
        {data?.map((post) => (
          <Showfeed
            key={post._id}
            image={ post.Image? post.Image : "/default-image.png"}
            description={post?.Description}
            name={`${post?.Userid?.Fname || ""} ${post?.Userid?.Lname || ""}`}
            like={post?.Like}
            postid={post?._id}
            comment={post?.Comment}
            createadAt={post?.createadAt}
            location={post?.Location}
            isLikedstatus={post?.isLikedstatus}
            userid={post?.Userid?._id}
          />
        ))}
      </div>

      {/* Right Sidebar */}
      <div style={{ width: "250px" }}>
        <SocialmediaRCP />
      </div>
    </div>
  );
}
export default Socialmiddle;
