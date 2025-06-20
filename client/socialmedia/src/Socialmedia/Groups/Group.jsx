import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import './Group.css'
import { updateGroupcomponentBack, updateShowOwngroup } from "../../Redux/SocialCompent";
import { updateShowCreategroup } from "../../Redux/SocialCompent";
import CreateGroup from "./CreateGroup";
import UserGroups from "./UserGroups";
import { _get, apiClient } from "../axios/Axios";
import { response } from "express";
function Group() {
  const dispatch = useDispatch();
  const groupStatus = useSelector((state) => state.Social.groupComponent);
  const groupBack=useSelector((state)=>state.Social.handleGroupback)
  const showOwngroup=useSelector((state)=>state.Social.showOwngroup)
  const showCreategroup=useSelector((state)=>state.Social.showCreategroup)
  const [selectedGroup, setSelectedGroup] = useState(null);
  const token=localStorage.getItem("token")

  async function getGroups()
  {
    apiClient.defaults.headers.common['Authorization']=`Bearer ${token}`
    await _get("/api/socialmedia/groups/all-groups").then((response)=>{
      if(response.status===200)
      {
        console.log(response.data)
        return response.data;
      }
    }).catch((error)=>{
      return []
    })
  }

  useEffect(()=>{
    async function fetchGroups() {
      const arraygroup = await getGroups();
      if (arraygroup && arraygroup.length > 0) {
        console.log("Fetched Groups:", arraygroup);
      } else {
        console.log("No groups found or error fetching groups.");
      }
    }
    fetchGroups();
  },[])
  // const arraygroup = [
  //   { name: "Group1" }, { name: "Group2" }, { name: "Group3" },
  //   { name: "Group4" }, { name: "Group5" }, { name: "Group6" },
  //   { name: "Group7" }, { name: "Group8" }, { name: "Group9" },
  //   { name: "Group10" }, { name: "Group11" }, { name: "Group12" },
  //   { name: "Group13" }
  // ];

 const handleGoBack = () => {
  if (showCreategroup || showOwngroup || selectedGroup) {
    dispatch(updateShowCreategroup(false));
    dispatch(updateShowOwngroup(false));
    setSelectedGroup(null);
  } else {
    dispatch(updateGroupcomponentBack(true)); // hide full Group component
  }
};

const handleShowCreategroup = () => {
  dispatch(updateShowCreategroup(true));
  dispatch(updateShowOwngroup(false));
  setSelectedGroup(null);
};

const handleShowOwngroups = () => {
  dispatch(updateShowOwngroup(true));
  dispatch(updateShowCreategroup(false));
  setSelectedGroup(null);
};
  useEffect(()=>{
    console.log(showCreategroup)

  },[showCreategroup])

  return (
    <>
      {groupStatus && !groupBack && (
  <Row className="mt-3">
    {!selectedGroup && (
      <Col md={4}>
        {/* Sidebar Group List */}
        <Card
          style={{
            height: "80vh",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            width: "260px",
          }}
        >
          {/* Header */}
          <div
            className="d-flex justify-content-between align-items-center p-3 bg-light flex-wrap gap-2"
            style={{
              borderBottom: "1px solid #dee2e6",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <h5 className="mb-0 text-primary">Groups</h5>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <Button variant="outline-primary" size="sm" onClick={handleShowCreategroup}>
                ➕ Create
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={handleShowOwngroups}>
                📁 My Groups
              </Button>
              <Button variant="outline-danger" size="sm" onClick={handleGoBack}>
                ← Go Back
              </Button>
            </div>
          </div>

          {/* Scrollable list */}
          {showCreategroup ? (
            <CreateGroup />
          ) : showOwngroup ? (
            <UserGroups />
          ) : (
            <div style={{ overflowY: "auto", height: "100%" }}>
              {arraygroup.map((group, index) => (
                <div
                  key={`${group.name}-${index}`}
                  className="px-3 py-2"
                  style={{
                    cursor: "pointer",
                    backgroundColor: selectedGroup === group.name ? "#e3f2fd" : "white",
                    fontWeight: selectedGroup === group.name ? "bold" : "normal",
                    borderBottom: "1px solid #f1f1f1",
                    transition: "background-color 0.2s",
                  }}
                  onClick={() => setSelectedGroup(group.name)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      selectedGroup === group.name ? "#e3f2fd" : "white")
                  }
                >
                  {group.name}
                </div>
              ))}
            </div>
          )}
        </Card>
      </Col>
    )}

    {/* Full-width content when group is selected */}
    {selectedGroup && (
      <Col md={12}>
        <Card
          className="p-4"
          style={{
            minHeight: "100vh",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="text-secondary">
              Selected Group: <span className="text-dark">{selectedGroup}</span>
            </h4>
            <Button variant="outline-danger" size="sm" onClick={() => setSelectedGroup(null)}>
              ← Back to Groups
            </Button>
          </div>
          <p className="text-muted">You can add chat messages, posts, or group info here.</p>
        </Card>
      </Col>
    )}
  </Row>
)}

    </>
  );
}

export default Group;
