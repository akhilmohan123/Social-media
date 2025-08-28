import React, { useEffect, useState, useRef } from 'react';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBTypography,
  MDBIcon,
  MDBInput,
} from 'mdb-react-ui-kit';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewFriend.css';

export default function ViewFriend() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilepic] = useState(null);
  const [activePostIndex, setActivePostIndex] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [posts, setPosts] = useState([]);
  const [fullscreen, setFullscreen] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const user = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/view-friend-profile/${id}`);
        setData(response.data.data);
        
        if (response.data.data?.image) {
          setProfilepic(`http://localhost:3001/uploads/profilePics/${response.data.data.image}`);
        }

        if (response.data.data?.friendpost) {
          const initialPosts = response.data.data.friendpost.map((image, index) => ({
            id: index,
            imageUrl: `http://localhost:3001/uploads/posts/${image}`,
            likes: Math.floor(Math.random() * 100) + 10,
            comments: [],
            isLiked: false,
            showComments: false,
          }));
          setPosts(initialPosts);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching friend data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked,
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId) => {
    if (!commentInput.trim()) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: Date.now(),
                user: "you",
                text: commentInput,
              },
            ],
          };
        }
        return post;
      })
    );

    setCommentInput("");
  };

  const toggleComments = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            showComments: !post.showComments,
          };
        }
        return post;
      })
    );
  };

  function handleMessageClick(id) {
    navigate(`/chat-friend/${id}`);
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <MDBContainer className="py-5 mdbcolor">
        <MDBRow className="justify-content-center">
          <MDBCol lg="9" xl="7">
            <MDBCard className="profile-card">
              {/* Profile Header Section */}
              <div className="profile-header">
                <div className="profile-image-container">
                  <MDBCardImage
                    src={profilePic}
                    alt="Profile"
                    className="profile-image"
                    fluid
                  />
                </div>
                <div className="profile-info d-flex align-items-center gap-3">
                  <MDBTypography tag="h4" className="profile-name">
                    {data.Fname} {data.Lname}
                  </MDBTypography>

                  <Button
                    className="message-btn"
                    variant="primary"
                    onClick={() => handleMessageClick(id)}
                  >
                    Message
                  </Button>
                </div>
              </div>

              {/* Stats Section */}
              <div className="profile-stats">
                <div className="stat-item">
                  <MDBCardText className="stat-number">
                    {posts.length}
                  </MDBCardText>
                  <MDBCardText className="stat-label">Posts</MDBCardText>
                </div>
                <div className="stat-item">
                  <MDBCardText className="stat-number">
                    {data.followers || 0}
                  </MDBCardText>
                  <MDBCardText className="stat-label">Followers</MDBCardText>
                </div>
                <div className="stat-item">
                  <MDBCardText className="stat-number">
                    {data.following || 0}
                  </MDBCardText>
                  <MDBCardText className="stat-label">Following</MDBCardText>
                </div>
              </div>

              {/* Posts Section */}
              <MDBCardBody className="posts-section">
                <div className="section-header">
                  <MDBCardText className="section-title">
                    {data.Fname}'s Posts
                  </MDBCardText>
                </div>

                {posts.map((post) => (
                  <div className="post-card" key={post.id}>
                    {/* Post Image */}
                    <div className="post-image-container">
                      <MDBCardImage
                        src={post.imageUrl}
                        alt={`Post ${post.id}`}
                        className="post-image"
                        onClick={() => {
                          setActivePostIndex(post.id);
                          setFullscreen(post.imageUrl);
                        }}
                      />
                    </div>

                    {/* Post Actions */}
                    <div className="post-actions">
                      <button
                        className={`like-btn ${post.isLiked ? "liked" : ""}`}
                        onClick={() => handleLike(post.id)}
                      >
                        <MDBIcon
                          fas
                          icon="heart"
                          size="lg"
                          className="action-icon"
                        />
                        <span>{post.likes} likes</span>
                      </button>

                      <button
                        className="comment-btn"
                        onClick={() => toggleComments(post.id)}
                      >
                        <MDBIcon
                          far
                          icon="comment"
                          size="lg"
                          className="action-icon"
                        />
                        <span>{post.comments.length} comments</span>
                      </button>
                    </div>

                    {/* Comments Section */}
                    {post.showComments && (
                      <div className="comments-section">
                        <div className="comments-list">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="comment">
                              <strong>{comment.user}: </strong>
                              <span>{comment.text}</span>
                            </div>
                          ))}
                        </div>

                        <div className="add-comment">
                          <MDBInput
                            label="Add a comment..."
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            className="comment-input"
                          />
                          <button
                            className="post-comment-btn"
                            onClick={() => handleAddComment(post.id)}
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      {fullscreen && (
        <div
          className="custom-fullscreen-overlay"
          onClick={() => setFullscreen(null)}
        >
          <button
            className="fullscreen-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreen(null);
            }}
            aria-label="Close fullscreen image"
          >
            &times;
          </button>
          <img
            src={fullscreen}
            alt="Fullscreen"
            className="fullscreen-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}