import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 1. THIS VARIABLE LETS YOUR CODE WORK IN DEV AND PRODUCTION
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

    // =========================================================
    // 2. THIS IS THE CORRECTED AXIOS GET CALL
    // =========================================================
    axios.get(`${API_URL}/api/profile`, {
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
      // Optional: Clear token if invalid
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
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
    if (!token) {
        setMessage('Error: Not logged in.');
        navigate('/login'); // Redirect if no token
        return;
    }

    // =========================================================
    // 3. THIS IS THE CORRECTED AXIOS PUT CALL
    // =========================================================
    axios.put(`${API_URL}/api/profile`,
      { settings }, // Send settings directly in the body
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(() => {
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    })
    .catch(error => {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings');
      // Optional: Handle specific errors like 401
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20"> {/* Added pt-20 to account for navbar */}
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 pt-28"> {/* Increased pt for navbar */}
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fontSize" className="block text-lg font-medium text-gray-700 mb-2">
              Font Size
            </label>
            <select
              id="fontSize"
              name="fontSize"
              value={settings.fontSize || 'Default'}
              onChange={handleSettingChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <option value="Default">Default</option>
              <option value="Medium">Medium (18px)</option>
              <option value="Large">Large (20px)</option>
            </select>
          </div>

          <div>
            <label htmlFor="contrast" className="block text-lg font-medium text-gray-700 mb-2">
              Contrast Mode
            </label>
            <select
              id="contrast"
              name="contrast"
              value={settings.contrast || 'None'}
              onChange={handleSettingChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <option value="None">None</option>
              <option value="Dark Mode">Dark Mode</option>
              <option value="High Contrast">High Contrast</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Save Settings
          </button>

          {message && (
            <p className={`font-medium text-center text-lg ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;