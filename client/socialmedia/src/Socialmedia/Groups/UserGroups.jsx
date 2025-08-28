import React, { useEffect, useState } from 'react';
import { _get, apiClient } from '../axios/Axios';
import { toast } from 'react-toastify';
import './UserGroups.css';
import GroupChat from './GroupChat/GroupChat';
import { updateSetstatus, updateShowCreategroup, updateShowOwngroup, updateGroupchatStatus, updateSelectedGroup } from '../../Redux/SocialCompent';
import { useDispatch } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import socket from '../Socket/Socket';
import { updateUsername } from '../../Redux/UserSlice';
import { MDBIcon } from 'mdb-react-ui-kit';

function UserGroups() {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    async function fetchUserGroups() {
      setLoading(true);
      const userGroups = await getUsergroups();
      if (userGroups) {
        setGroups(userGroups);
      }
      setLoading(false);
    }
    fetchUserGroups();
  }, []);

  const handleGroup = (group) => {
    setStatus(true);
    setSelectedGroup(group);
    dispatch(updateSetstatus(false));
    dispatch(updateGroupchatStatus(true));
    dispatch(updateSelectedGroup(group));
    socket.emit("joined-group", { Id: group._id });
    fetchUsername();
  };

  async function fetchUsername() {
    try {
      const response = await _get("/api/socialmedia/get-username");
      if (response.status === 200) {
        dispatch(updateUsername(response.data.result));
      } else {
        dispatch(updateUsername("User"));
      }
    } catch (error) {
      dispatch(updateUsername("User"));
    }
  }

  const handleBack = () => {
    setSelectedGroup(null);
    dispatch(updateSetstatus(false));
    dispatch(updateGroupchatStatus(false));
    setStatus(false);
  };

  async function getUsergroups() {
    try {
      const response = await _get('/api/socialmedia/groups/user-groups');
      if (response.status === 200) {
        if (response.data && response.data.length > 0) {
          return response.data;
        } else {
          setError("No groups found");
          return [];
        }
      } else {
        setError("Failed to fetch user groups");
        return [];
      }
    } catch (error) {
      setError("An error occurred while fetching user groups");
      return [];
    }
  }

  return (
    <div className="modern-user-groups">
      {!status ? (
        <div className="groups-container">
          <div className="groups-header">
            <h2 className="groups-title">
              <MDBIcon fas icon="users" className="me-2" />
              My Groups
            </h2>
            <p className="groups-subtitle">Connect with your communities</p>
          </div>

          {loading ? (
            <div className="groups-loading">
              <div className="spinner"></div>
              <p>Loading your groups...</p>
            </div>
          ) : (
            <div className="groups-list">
              {groups.length > 0 ? (
                groups.map(group => (
                  <div key={group._id} className="group-card" onClick={() => handleGroup(group)}>
                    <div className="group-avatar">
                      {group.groupname.charAt(0).toUpperCase()}
                    </div>
                    <div className="group-info">
                      <h5 className="group-name">{group.groupname}</h5>
                      <p className="group-description">{group.description || "No description provided"}</p>
                      <div className="group-meta">
                        <span className="members-count">
                          <MDBIcon fas icon="user-friends" className="me-1" />
                          {group.members?.length || 0} members
                        </span>
                      </div>
                    </div>
                    <div className="group-arrow">
                      <MDBIcon fas icon="chevron-right" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-groups">
                  <MDBIcon fas icon="users" size="3x" className="mb-3" />
                  <h4>No groups yet</h4>
                  <p>You haven't joined any groups yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <GroupChat onBack={handleBack} />
      )}
    </div>
  );
}

export default UserGroups;