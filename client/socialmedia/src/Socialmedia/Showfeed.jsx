import React, { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import {
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaRegCommentDots,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { _post, apiClient } from "./axios/Axios";

function Showfeed({
  name = "default",
  image = "sample.png",
  description = "nothing",
  like = 0,
  postid = 2,
  comment = [],
  createdAt,
  location,
}) {
  const [postPic, setPostpic] = useState(null);
  const [likes, setLikes] = useState(like);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(comment);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
  }

  useEffect(() => {
    setPostpic(`http://localhost:3001/uploads/posts/${image}`);
  }, [image]);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // Toggle like
  const handleLike = async () => {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    if (isLiked) {
      setLikes(likes - 1);
      await _post(`http://localhost:3001/remove-like/${postid}`);
    } else {
      await _post(`http://localhost:3001/add-like/${postid}`);
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);

    // Send like status to backend (optional)
    // axios.post("/like", { postid, liked: !isLiked });
  };

  useEffect(()=>{
    setLikes(like.length)
  },[like])

  // Add comment
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;
    const newComment = { user: "You", text: commentText };
    setComments([...comments, newComment]);
    setCommentText("");

    // Send comment to backend (optional)
    // axios.post("/comment", { postid, text: commentText });
  };

  return (
    <div className="feed d-flex justify-content-center align-items-center">
      <Card style={{ width: "50rem" }}>
        <Card.Img
          variant="top"
          src={postPic}
          style={{ height: "85vh", objectFit: "cover" }}
        />
        <Card.Body>
          {/* Post Header */}
          <Card.Title>
            {name}
            <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
              {location && (
                <>
                  <FaMapMarkerAlt
                    style={{ color: "red", marginRight: "5px" }}
                  />
                  {location}
                </>
              )}
              {formattedDate && (
                <span style={{ marginLeft: location ? "10px" : "0" }}>
                  • {formattedDate}
                </span>
              )}
            </div>
          </Card.Title>

          {/* Description */}
          <Card.Text>{description}</Card.Text>

          {/* Like & Comment buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "10px",
            }}
          >
            <span
              onClick={handleLike}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              {isLiked ? (
                <FaHeart color="red" size={20} />
              ) : (
                <FaRegHeart size={20} />
              )}
              {likes}
            </span>

            <span
              onClick={() => setShowComments(!showComments)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <FaRegCommentDots size={20} />
              {comments.length}
            </span>
          </div>

          {/* Comments Section */}
          {/* Comments Section */}
          {showComments && (
            <div style={{ marginTop: "10px" }}>
              <div
                className="comments-section"
                style={{
                  maxHeight: "75px", // limit height
                  overflowY: "auto", // enable vertical scroll
                  paddingRight: "5px", // space for scrollbar
                }}
              >
                {comments.length > 0 ? (
                  comments.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: "14px",
                        marginBottom: "5px",
                        paddingBottom: "5px",
                      }}
                    >
                      <strong>{c.user}:</strong> {c.text}
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    No comments yet
                  </p>
                )}
              </div>

              {/* Add Comment Form */}
              <Form
                onSubmit={handleCommentSubmit}
                style={{ marginTop: "10px" }}
              >
                <Form.Control
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button type="submit" size="sm" style={{ marginTop: "5px" }}>
                  Post
                </Button>
              </Form>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Showfeed;
