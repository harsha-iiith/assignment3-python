import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PROFILE_ENDPOINT = '/profile';

const ClassItem = ({ name, role }) => (
  <div className="flex justify-between items-center p-2 border-b border-gray-300">
    <span>{name}</span>
    <span className="font-semibold text-gray-700">({role})</span>
  </div>
);

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('created');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {

        const response = await axios.get(PROFILE_ENDPOINT);
        const data = response.data;

        setProfile(data);

        if (data.createdClasses.length === 0 && data.joinedClasses.length > 0) {
          setActiveTab('joined');
        }

      } catch (e) {
        console.error('Fetching profile failed:', e);

        if (e.response) {
          setError(`Error ${e.response.status}: Failed to load profile.`);
        } else {
          setError(e.message || 'Network error: Server is unreachable.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getTabClasses = (tabName) => {
    const isActive = activeTab === tabName;
    const activeStyles = 'px-4 py-2 text-sm font-medium bg-green-500 text-white rounded hover:bg-green-600 shadow-md';
    const inactiveStyles = 'px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800';
    return isActive ? activeStyles : inactiveStyles;
  };

  if (loading) return <p className="p-8">Loading profile...</p>;

  if (error) return <p className="p-8 text-red-600">Error: {error}</p>;

  if (!profile) return <p className="p-8">No profile data available.</p>;

  return (
    <div className="min-h-screen bg-white p-8">
      {/* User Info */}
      <p className="mb-2"><strong>Name:</strong> {profile.name}</p>
      <p className="mb-4"><strong>Email:</strong> {profile.email}</p>

      {/* Tabs */}
      <div className="mb-4 flex space-x-2 items-end">
        <button onClick={() => setActiveTab('created')} className={getTabClasses('created')}>
          Your Classes ({profile.createdClasses.length})
        </button>
        <button onClick={() => setActiveTab('joined')} className={getTabClasses('joined')}>
          Joined Classes ({profile.joinedClasses.length})
        </button>
      </div>

      {/* Content */}
      <div className="border border-gray-300 rounded p-4 bg-white shadow-sm">
        {activeTab === 'created' && (
          <div className="mb-6">
            <p className="mb-2 font-semibold">Your Classes:</p>
            <div className="border rounded">
              {profile.createdClasses.length > 0
                ? profile.createdClasses.map((cls, idx) => <ClassItem key={idx} {...cls} />)
                : <p className="p-2 text-gray-500">You haven't created any classes yet.</p>
              }
            </div>
          </div>
        )}

        {activeTab === 'joined' && (
          <div className="mb-6">
            <p className="mb-2 font-semibold">Joined Classes:</p>
            <div className="border rounded">
              {profile.joinedClasses.length > 0
                ? profile.joinedClasses.map((cls, idx) => <ClassItem key={idx} {...cls} />)
                : <p className="p-2 text-gray-500">You haven't joined any classes yet.</p>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;