// AccessFlow Content Script
// This script applies accessibility settings to web pages

console.log('AccessFlow content script loaded');

// Function to apply accessibility fixes based on user settings
function applyFixes(settings) {
  let cssToInject = '';

  // Check contrast settings
  if (settings.contrast === 'Dark Mode') {
    cssToInject += `
      html {
        filter: invert(1) hue-rotate(180deg);
      }
      img, video, iframe {
        filter: invert(1) hue-rotate(180deg);
      }
    `;
  }

  if (settings.contrast === 'High Contrast') {
    cssToInject += `
      html {
        filter: contrast(175%);
      }
    `;
  }

  // Check font size settings
  if (settings.fontSize === 'Large') {
    cssToInject += `
      body {
        font-size: 20px !important;
      }
    `;
  }

  if (settings.fontSize === 'Medium') {
    cssToInject += `
      body {
        font-size: 18px !important;
      }
    `;
  }

  // Create and inject the style element
  const styleElement = document.createElement('style');
  styleElement.id = 'accessflow-styles';
  styleElement.innerHTML = cssToInject;
  document.head.appendChild(styleElement);

  console.log('AccessFlow settings applied:', settings);
}

// Retrieve settings from Chrome storage and apply them
chrome.storage.local.get(['settings'], (result) => {
  if (result.settings) {
    console.log('Settings retrieved from storage:', result.settings);
    applyFixes(result.settings);
  } else {
    console.log('No settings found in storage');
  }
});