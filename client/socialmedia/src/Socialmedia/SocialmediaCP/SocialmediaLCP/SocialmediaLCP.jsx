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
      </ListGroup>
    </div>:<Group/>}
    
    </>
    
  );
}

export default SocialmediaLCP;
