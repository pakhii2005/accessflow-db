// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login-button');
  const loginForm = document.getElementById('login-form');
  const messageDiv = document.getElementById('message');

  // Add click event listener to the login button
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      // Step 1: Login and get token
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: email,
        password: password
      });

      const token = loginResponse.data.token;

      // Save token to Chrome storage
      await chrome.storage.local.set({ token: token });

      // Step 2: Fetch profile/settings using the token
      const profileResponse = await axios.get('http://localhost:5000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Save settings to Chrome storage
      await chrome.storage.local.set({ settings: profileResponse.data.settings });

      // Show success message
      messageDiv.textContent = 'Logged In & Settings Synced!';
      messageDiv.className = 'success';
      messageDiv.style.display = 'block';

      // Clear the form
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';

    } catch (error) {
      console.error('Login error:', error);
      
      // Show error message
      messageDiv.textContent = 'Login Failed';
      messageDiv.className = 'error';
      messageDiv.style.display = 'block';
    }
  });
});