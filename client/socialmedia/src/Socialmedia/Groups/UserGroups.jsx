import React, { useEffect, useState } from 'react';
import { _get, apiClient } from '../axios/Axios';
import { toast } from 'react-toastify';
import './UserGroups.css';
import GroupChat from './GroupChat/GroupChat';

function UserGroups() {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null); // 💡 Track selected group
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

  const handleGroup = (group) => {
    setSelectedGroup(group); // 💡 Set the selected group
  };

  const handleBack = () => {
    setSelectedGroup(null); // 💡 Reset to show group list again
  };

  async function getUsergroups() {
    try {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await _get('/api/socialmedia/groups/user-groups');
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
      {selectedGroup ? (
        <GroupChat
          groupName={selectedGroup.groupname}
          membersCount={selectedGroup.members.length || 0}
          onBack={handleBack}
        />
      ) : (
        <>
          <h2 className="title">My Groups</h2>
          <div className="group-list">
            {groups.length > 0 ? (
              groups.map(group => (
                <div key={group._id} className="group-card" onClick={() => handleGroup(group)}>
                  <h5>{group.groupname}</h5>
                  <p>{group.description}</p>
                </div>
              ))
            ) : (
              <p className="no-groups">No groups to display</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default UserGroups;
