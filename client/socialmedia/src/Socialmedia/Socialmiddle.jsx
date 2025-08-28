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
import { _get } from "./axios/Axios";
import "./Socialmiddle.css"; // We'll create this CSS file

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
    // Your existing logic
  }, [live]);
  
  useEffect(() => {
    _get("http://localhost:3001/get-post")
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

  if (loading) {
    return (
      <div className="socialmiddle-loading">
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
    <div className="socialmiddle-container">
      {/* Left Sidebar */}
      <div className="socialmiddle-sidebar left-sidebar">
        <SocialmediaLCP />
      </div>

      {/* Middle Feed */}
      <div className="socialmiddle-feed">
        {streamstatus ? <StreamPlayer /> : <CreatePost />}
        
        {data?.length === 0 ? (
          <div className="empty-feed-message">
            <h3>No posts yet</h3>
            <p>Be the first to share something!</p>
          </div>
        ) : (
          data?.map((post) => (
            <Showfeed
              key={post._id}
              image={post.Image ? post.Image : "/default-image.png"}
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
          ))
        )}
      </div>

      {/* Right Sidebar */}
      <div className="socialmiddle-sidebar right-sidebar">
        <SocialmediaRCP />
      </div>
    </div>
  );
}

export default Socialmiddle;