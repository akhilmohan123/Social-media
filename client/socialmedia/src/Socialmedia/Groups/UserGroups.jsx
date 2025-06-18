import React, { useEffect, useState } from 'react';
import { _get, apiClient } from '../axios/Axios';
import { toast } from 'react-toastify';
import './UserGroups.css'; // Add this CSS file for custom styling

function UserGroups() {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    async function fetchUserGroups() {
      const userGroups = await getUsergroups();
      if (userGroups) {
        setGroups(userGroups);
      }
    }
    fetchUserGroups();
  }, []);

  async function getUsergroups() {
    console.log(token);
    try {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await _get('/api/socialmedia/groups/user-groups');
      console.log(response);
      if (response.status === 200) {
        if (response.data && response.data.length > 0) {
          return response.data;
        } else {
          setError("No groups found");
        }
      } else {
        setError("Failed to fetch user groups");
      }
    } catch (error) {
      setError("An error occurred while fetching user groups");
    }
  }

  return (
    <div className="user-groups-container">
      <h2 className="title">My Groups</h2>
      <div className="group-list">
        {groups.length > 0 ? (
          groups.map(group => (
            <div key={group._id} className="group-card">
              <h5>{group.groupname}</h5>
              <p>{group.description}</p>
            </div>
          ))
        ) : (
          <p className="no-groups">No groups to display</p>
        )}
      </div>
    </div>
  );
}

export default UserGroups;
