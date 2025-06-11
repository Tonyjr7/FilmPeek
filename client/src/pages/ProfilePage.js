import { useState, useEffect } from 'react';
import axios from 'axios';
import { userProfile } from '../utils/api';

function Profile() {
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    userProfile(token).then((res) => {
      setName(res.data.name);
      setProfilePicture(res.data.profilePicture);
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 mt-20">
      <div className="flex flex-col items-center gap-4">
        <img
          src={profilePicture || 'https://via.placeholder.com/100'}
          alt="Profile"
          className="w-24 h-24 rounded-full border-2 border-gray-300"
        />
        <h2 className="text-xl font-semibold">
          {`Hello ${name}` || 'Your Name'}
        </h2>
      </div>

      {/* Placeholder for later sections */}
      <div className="mt-10">
        <h3 className="text-lg font-medium mb-2">
          Your Watchlists & Favorites
        </h3>
        <p className="text-gray-500">Coming soon...</p>
      </div>
    </div>
  );
}

export default Profile;
