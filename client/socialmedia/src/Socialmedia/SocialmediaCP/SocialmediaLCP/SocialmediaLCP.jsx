import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateGroupComponent, updateGroupcomponentBack } from '../../../Redux/SocialCompent';
import { useEffect } from 'react';
import Group from '../../Groups/Group';

function SocialmediaLCP() {
  const dispatch=useDispatch();
  const groupStatus=useSelector(state=>state.Social.groupComponent);
  const groupBack=useSelector(state=>state.Social.handleGroupback)
  useEffect(()=>{
    if(groupBack)
    {
      dispatch(updateGroupComponent(false))
    }
  },[groupBack])
  function handleGroup()
  {
   dispatch(updateGroupComponent(true));
   dispatch(updateGroupcomponentBack(false))
   console.log("updated group component is ")
  }

  return (
    <>
    {!groupStatus? <div style={{ width: '250px', padding: '10px' }}>
      {/* Main Navigation Items */}
      <ListGroup className="mb-4">
        <ListGroup.Item action href="/home">🏠 Home</ListGroup.Item>
        <ListGroup.Item action href="/friends">👥 Friends</ListGroup.Item>
        <ListGroup.Item action onClick={handleGroup} style={{marginLeft:0}}>👨‍👩‍👧 Groups</ListGroup.Item>
        <ListGroup.Item action href="/pages">📄 Pages</ListGroup.Item>
      </ListGroup>

      {/* My Groups Section */}
      <h6 className="text-muted">My Groups</h6>
      <ListGroup>
        <ListGroup.Item action href="/groups/1">📘 React Developers</ListGroup.Item>
        <ListGroup.Item action href="/groups/2">🎮 Gaming Squad</ListGroup.Item>
        <ListGroup.Item action href="/groups/3">📚 Book Club</ListGroup.Item>
        <h6 className="text-muted mt-4">Pages You Follow</h6>
        <ListGroup>
          <ListGroup.Item action href="/pages/technews">🧠 TechNews Daily</ListGroup.Item>
          <ListGroup.Item action href="/pages/fitness">💪 FitLife</ListGroup.Item>
          </ListGroup>
      </ListGroup>
    </div>:<Group/>}
    
    </>
    
  );
}

export default SocialmediaLCP;
