import React from 'react';
import { ListGroup, Image } from 'react-bootstrap';

function SocialmediaRCP() {
  const activeFriends = [
    { name: "Alice", image: "/images/alice.jpg" },
    { name: "Bob", image: "/images/bob.jpg" },
    { name: "Charlie", image: "/images/charlie.jpg" }
  ];

  return (
    <div style={{ width: '250px', padding: '10px' }}>
      {/* Latest Activity */}
      <h5 className="mb-3">Latest Activity</h5>
      <ListGroup variant="flush" className="mb-4">
        <ListGroup.Item>✅ You liked John’s post</ListGroup.Item>
        <ListGroup.Item>📝 You commented on Sarah’s photo</ListGroup.Item>
        <ListGroup.Item>📸 You uploaded a new picture</ListGroup.Item>
      </ListGroup>

      {/* Active Friends */}
      <h5 className="mb-3">Active Friends</h5>
      <ListGroup variant="flush">
        {activeFriends.map((friend, index) => (
          <ListGroup.Item key={index} className="d-flex align-items-center">
            <div style={{ position: 'relative', marginRight: '10px' }}>
              <Image
                src={friend.image}
                roundedCircle
                style={{ width: '35px', height: '35px', objectFit: 'cover' }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '10px',
                  height: '10px',
                  backgroundColor: 'green',
                  borderRadius: '50%',
                  border: '2px solid white'
                }}
              ></span>
            </div>
            {friend.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default SocialmediaRCP;
