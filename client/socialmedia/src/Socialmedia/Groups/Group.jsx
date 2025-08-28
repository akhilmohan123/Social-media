import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import './Group.css'
import { updateGroupcomponentBack, updateShowOwngroup } from "../../Redux/SocialCompent";
import { updateShowCreategroup } from "../../Redux/SocialCompent";
import CreateGroup from "./CreateGroup";
import UserGroups from "./UserGroups";
import { _get, apiClient } from "../axios/Axios";
import GroupDetails from "./GroupDetails";
import { MDBIcon } from "mdb-react-ui-kit";

function Group() {
  const dispatch = useDispatch();
  const groupStatus = useSelector((state) => state.Social.groupComponent);
  const groupBack = useSelector((state) => state.Social.handleGroupback)
  const showOwngroup = useSelector((state) => state.Social.showOwngroup)
  const showCreategroup = useSelector((state) => state.Social.showCreategroup)
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [arraygroup, setArraygroup] = useState([])
  const token = localStorage.getItem("token")
  const status = useSelector((state) => state.Social.status)
  const groupchat = useSelector((state) => state.Social.groupchat)

  async function getGroups() {
    await _get("/api/socialmedia/groups/all-groups").then((response) => {
      if (response.status === 200) {
        console.log(response.data)
        setArraygroup(response.data)
      }
    }).catch((error) => {
      setArraygroup([])
    })
  }

  useEffect(() => {
    getGroups();
    console.log("set status status is " + status);
    console.log("group chat status" + groupchat)
  }, [groupchat])

  useEffect(() => {
    console.log(selectedGroup)
  }, [selectedGroup])

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

  useEffect(() => {
    console.log(showCreategroup)
  }, [showCreategroup])

  return (
    <>
      {groupStatus && !groupBack && (
        <div className="modern-group-container">
          {(!selectedGroup && !status) && (
            <div className="group-sidebar">
              {/* Header */}
              {(!status && !groupchat) && (
                <div className="group-header">
                  <h5 className="group-title">
                    <MDBIcon fas icon="users" className="me-2" />
                    Groups
                  </h5>
                  <div className="group-actions">
                    <Button variant="primary" size="sm" onClick={handleShowCreategroup} className="action-btn">
                      <MDBIcon fas icon="plus" className="me-1" />
                      Create
                    </Button>
                    <Button variant="outline-primary" size="sm" onClick={handleShowOwngroups} className="action-btn">
                      <MDBIcon fas icon="user-friends" className="me-1" />
                      My Groups
                    </Button>
                    <Button variant="outline-secondary" size="sm" onClick={handleGoBack} className="action-btn">
                      <MDBIcon fas icon="arrow-left" className="me-1" />
                      Back
                    </Button>
                  </div>
                </div>
              )}

              {/* Scrollable list */}
              {showCreategroup ? (
                <CreateGroup />
              ) : showOwngroup ? (
                <UserGroups />
              ) : (
                <div className="group-list">
                  {arraygroup.length > 0 ? (
                    arraygroup.map((group, index) => (
                      <div
                        key={`${group._id}-${index}`}
                        className="group-item"
                        onClick={() => setSelectedGroup(group)}
                      >
                        <div className="group-avatar">
                          {group.groupname ? group.groupname.charAt(0).toUpperCase() : 'G'}
                        </div>
                        <div className="group-info">
                          <h6 className="group-name">{group.groupname}</h6>
                          <p className="group-members">{group.members?.length || 0} members</p>
                        </div>
                        <div className="group-arrow">
                          <MDBIcon fas icon="chevron-right" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-groups">
                      <MDBIcon fas icon="users" size="2x" className="mb-2" />
                      <p>No groups available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Full-width content when group is selected */}
          {selectedGroup && (
            <div className="group-detail-view">
              <GroupDetails group={selectedGroup} onBack={() => setSelectedGroup(null)} />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Group;