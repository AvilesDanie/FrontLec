import React from 'react';
import '../css/UserInfo.css';

const UserInfo = ({ user }) => {
  return (
    <div id="user-info-container" className="user-info-container">
      <h2 id="user-info-title" className="user-info-title">User Information</h2>
      <p id="user-username"><strong>Username:</strong> {user.username}</p>
      <p id="user-level"><strong>Level:</strong> {user.level}</p>
      <p id="user-xp"><strong>Experience Points:</strong> {user.experiencePoints}</p>
      <p id="user-completed-challenges"><strong>Completed Challenges:</strong> {user.completedChallenges.length}</p>
      <p id="user-progress"><strong>Progress:</strong> {user.progress}%</p>
      <p id="user-created-at"><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>

  );
};

export default UserInfo;
