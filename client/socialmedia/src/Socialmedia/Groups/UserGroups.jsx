import React, { useEffect, useState } from 'react';
import { _get, apiClient } from '../axios/Axios';
import { toast } from 'react-toastify';
import './UserGroups.css';
import GroupChat from './GroupChat/GroupChat';
import { updateSetstatus, updateShowCreategroup, updateShowOwngroup,updateGroupchatStatus } from '../../Redux/SocialCompent';
import { useDispatch } from 'react-redux';
import { Col, Row } from 'react-bootstrap';

function UserGroups() {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null); // 💡 Track selected 
  const [status,setStatus]=useState(false)
  const token = localStorage.getItem("token");
  const dispatch=useDispatch()
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
    setStatus(true)
    setSelectedGroup(group); // 💡 Set the selected group
    dispatch(updateSetstatus(false));
    dispatch(updateGroupchatStatus(true))

  
  
  };

  const handleBack = () => {
    alert("back")
    setSelectedGroup(null); // 💡 Reset to show group list again
    dispatch(updateSetstatus(false))
    dispatch(updateGroupchatStatus(false))
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
    <Row className="mt-3">
      {!status ? 
       <Col md={12}>
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
      </Col>:
      <Col md={12}>
          <GroupChat groupName='sample' membersCount={8}/>
        </Col>
      }
    </Row>
  );
}

export default UserGroups;
