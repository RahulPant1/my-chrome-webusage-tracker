// let lastActivity = Date.now();
// const IDLE_THRESHOLD = 60000; // 1 minute in milliseconds

// function updateActivity() {
//   lastActivity = Date.now();
//   chrome.runtime.sendMessage({ type: 'activity_update', timestamp: lastActivity });
// }

// // Track user activity
// document.addEventListener('mousemove', updateActivity);
// document.addEventListener('keydown', updateActivity);
// document.addEventListener('scroll', updateActivity);
// document.addEventListener('click', updateActivity);

// // Check for idle state periodically
// setInterval(() => {
//   const now = Date.now();
//   if (now - lastActivity >= IDLE_THRESHOLD) {
//     chrome.runtime.sendMessage({ type: 'idle_detected' });
//   }
// }, IDLE_THRESHOLD);

// // Send initial page info
// chrome.runtime.sendMessage({
//   type: 'page_info',
//   data: {
//     url: window.location.href,
//     title: document.title
//   }
// });

// // Listen for title changes
// const observer = new MutationObserver(() => {
//   chrome.runtime.sendMessage({
//     type: 'page_info',
//     data: {
//       url: window.location.href,
//       title: document.title
//     }
//   });
// });

// observer.observe(document.querySelector('title')!, {
//   subtree: true,
//   characterData: true,
//   childList: true
// }); 

interface Message {
  type: 'activity_update' | 'idle_detected' | 'page_info';
  timestamp?: number;
  data?: {
    url: string;
    title: string;
  };
}

let lastActivity = Date.now();
const IDLE_THRESHOLD = 60000; // 1 minute in milliseconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function waitForExtensionReady(retries = 0): Promise<boolean> {
  if (retries >= MAX_RETRIES) {
    return false;
  }

  if (chrome.runtime?.id) {
    return true;
  }

  await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
  return waitForExtensionReady(retries + 1);
}

async function sendMessage(message: Message): Promise<void> {
  try {
    // Wait for extension to be ready before sending message
    const isReady = await waitForExtensionReady();
    if (!isReady) {
      console.warn('Extension context not available after retries');
      return;
    }

    await chrome.runtime.sendMessage(message);
  } catch (error: unknown) {
    // Handle different types of errors
    if (error instanceof Error) {
      // Ignore "Receiving end does not exist" errors as they're expected
      if (!error.message.includes('Receiving end does not exist')) {
        console.error('Error sending message:', error.message);
      }
    }
  }
}

let isInitialized = false;

async function initialize() {
  if (isInitialized) return;
  
  try {
    const isReady = await waitForExtensionReady();
    if (!isReady) {
      console.warn('Failed to initialize extension context');
      return;
    }

    // Send initial page info
    await sendMessage({
      type: 'page_info',
      data: {
        url: window.location.href,
        title: document.title
      }
    });

    // Set up title observer
    const titleElement = document.querySelector('title');
    if (titleElement) {
      const observer = new MutationObserver(() => {
        sendMessage({
          type: 'page_info',
          data: {
            url: window.location.href,
            title: document.title
          }
        });
      });

      observer.observe(titleElement, {
        subtree: true,
        characterData: true,
        childList: true
      });
    }

    isInitialized = true;
  } catch (error) {
    console.error('Error during initialization:', error);
  }
}

// Debounce function to limit the rate of activity updates
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined = undefined;
  
  return (...args: Parameters<T>) => {
    if (timeout !== undefined) {
      window.clearTimeout(timeout);
    }
    
    timeout = window.setTimeout(() => {
      func(...args);
      timeout = undefined;
    }, wait);
  };
}

// Update activity with debouncing
const updateActivity = debounce(() => {
  lastActivity = Date.now();
  sendMessage({ type: 'activity_update', timestamp: lastActivity });
}, 1000); // Debounce for 1 second

// Track user activity
document.addEventListener('mousemove', updateActivity);
document.addEventListener('keydown', updateActivity);
document.addEventListener('scroll', updateActivity);
document.addEventListener('click', updateActivity);

// Check for idle state periodically
const idleCheck = setInterval(() => {
  const now = Date.now();
  if (now - lastActivity >= IDLE_THRESHOLD) {
    sendMessage({ type: 'idle_detected' });
  }
}, IDLE_THRESHOLD);

// Initialize the extension
initialize().catch(error => {
  console.error('Failed to initialize extension:', error);
});

// Cleanup on page unload
window.addEventListener('unload', () => {
  clearInterval(idleCheck);
});
