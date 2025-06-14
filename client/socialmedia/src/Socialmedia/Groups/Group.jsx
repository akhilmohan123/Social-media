import React, { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import './Group.css'
import { updateGroupcomponentBack } from "../../Redux/SocialCompent";
function Group() {
  const dispatch = useDispatch();
  const groupStatus = useSelector((state) => state.Social.groupComponent);
  const groupBack=useSelector((state)=>state.Social.handleGroupback)
  const [selectedGroup, setSelectedGroup] = useState(null);
  const arraygroup = [
    { name: "Group1" }, { name: "Group2" }, { name: "Group3" },
    { name: "Group4" }, { name: "Group5" }, { name: "Group6" },
    { name: "Group7" }, { name: "Group8" }, { name: "Group9" },
    { name: "Group10" }, { name: "Group11" }, { name: "Group12" },
    { name: "Group13" }
  ];

  const handleGoBack = () => {
    dispatch(updateGroupcomponentBack(true))
  };

  return (
    <>
      {groupStatus && !groupBack && (
        <Row className="mt-3">
          {/* Sidebar Group List */}
          <Col md={4}>
            <Card
              style={{
                height: "80vh",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                width:'200px'
              }}
            >
              {/* Header */}
              <div
                className="d-flex justify-content-between align-items-center p-3 bg-light"
                style={{
                  borderBottom: "1px solid #dee2e6",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <h5 className="mb-0 text-primary">Groups</h5>
                <Button variant="outline-danger" size="sm" onClick={handleGoBack}>
                  ← Back
                </Button>
              </div>

              {/* Scrollable list */}
              <div style={{ overflowY: "auto", height: "100%" }}>
                {arraygroup.map((group, index) => (
                  <div
                    key={`${group.name}-${index}`}
                    className="px-3 py-2"
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedGroup === group.name ? "#e3f2fd" : "white",
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
            </Card>
          </Col>

          {/* Main Content */}
          <Col md={8}>
            {selectedGroup && (
              <Card
                className="p-4"
                style={{
                  minHeight: "100vh",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                }}
              >
                <h4 className="text-secondary mb-3">
                  Selected Group: <span className="text-dark">{selectedGroup}</span>
                </h4>
                <p className="text-muted">
                  You can add chat messages, posts, or group info here.
                </p>
              </Card>
            )}
          </Col>
        </Row>
      )}
    </>
  );
}

export default Group;
