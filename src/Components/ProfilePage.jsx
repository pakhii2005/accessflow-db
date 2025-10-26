import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [settings, setSettings] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:5000/api/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setSettings(response.data.settings || {});
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching profile:', error);
      navigate('/login');
    });
  }, [navigate]);

  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    
    axios.put('http://localhost:5000/api/profile', 
      { settings },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(() => {
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    })
    .catch(error => {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings');
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size
            </label>
            <select
              name="fontSize"
              value={settings.fontSize || 'Default'}
              onChange={handleSettingChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Default">Default</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contrast Mode
            </label>
            <select
              name="contrast"
              value={settings.contrast || 'None'}
              onChange={handleSettingChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="None">None</option>
              <option value="Dark Mode">Dark Mode</option>
              <option value="High Contrast">High Contrast</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Settings
          </button>

          {message && (
            <p className="text-green-600 font-medium text-center">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;