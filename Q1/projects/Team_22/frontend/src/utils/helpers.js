/**
 * Format timestamp to readable string
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} - Formatted time string
 */
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Get relative time string (e.g., "2 minutes ago")
 * @param {string|Date} timestamp - Timestamp to compare
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
};

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;

  return (...args) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func.apply(null, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

/**
 * Generate a random color from a predefined set
 * @returns {string} - Hex color string
 */
export const getRandomColor = () => {
  const colors = [
    "#FFEB3B",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#03A9F4",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#8BC34A",
    "#CDDC39",
    "#FFC107",
    "#FF9800",
    "#FF5722",
    "#795548",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Check if device is mobile
 * @returns {boolean} - True if mobile device
 */
export const isMobile = () => {
  return window.innerWidth <= 768;
};

/**
 * Scroll to element smoothly
 * @param {string} elementId - ID of element to scroll to
 * @param {number} offset - Additional offset from top (default: 0)
 */
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const topPosition = element.offsetTop - offset;
    window.scrollTo({
      top: topPosition,
      behavior: "smooth",
    });
  }
};

/**
 * Generate initials from name
 * @param {string} name - Full name
 * @returns {string} - Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return "";

  const names = name.trim().split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/**
 * Check if string contains only whitespace
 * @param {string} str - String to check
 * @returns {boolean} - True if only whitespace
 */
export const isWhitespace = (str) => {
  return !str || !str.trim();
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength, suffix = "...") => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} - Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Group array of objects by a key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} - Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
};
