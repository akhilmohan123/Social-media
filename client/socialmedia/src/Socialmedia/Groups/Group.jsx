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

function Group() {
  const dispatch = useDispatch();
  const groupStatus = useSelector((state) => state.Social.groupComponent);
  const groupBack=useSelector((state)=>state.Social.handleGroupback)
  const showOwngroup=useSelector((state)=>state.Social.showOwngroup)
  const showCreategroup=useSelector((state)=>state.Social.showCreategroup)
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [arraygroup,setArraygroup]=useState([])
  const token=localStorage.getItem("token")
  const status=useSelector((state)=>state.Social.status)
  const groupchat=useSelector((state)=>state.Social.groupchat)
  async function getGroups()
  {
    apiClient.defaults.headers.common['Authorization']=`Bearer ${token}`
    await _get("/api/socialmedia/groups/all-groups").then((response)=>{
      if(response.status===200)
      {
        console.log(response.data)
        setArraygroup(response.data)
      }
    }).catch((error)=>{
      setArraygroup([])
    })
  }


  useEffect(()=>{
    getGroups();
    console.log("set status status is "+status);
    console.log("group chat status"+groupchat)
  },[groupchat])

  useEffect(()=>{
    console.log(selectedGroup)
  },[selectedGroup])


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
    {(!selectedGroup && !status)&&  (
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
          {(!status && !groupchat) && (
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
          )}

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
                  onClick={() => setSelectedGroup(group)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      selectedGroup === group.name ? "#e3f2fd" : "white")
                  }
                >
                  {group.groupname}
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
         <GroupDetails group={selectedGroup} onBack={()=>setSelectedGroup(null)}/>
        </Card>
      </Col>
    )}
  </Row>
)}

    </>
  );
}

export default Group;
