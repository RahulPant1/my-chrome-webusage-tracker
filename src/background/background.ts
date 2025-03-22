import { addTimeEntry } from '../utils/db';

interface ActiveTab {
  id: number;
  url: string;
  domain: string;
  title: string;
  startTime: Date;
}

interface MessageResponse {
  status: 'ok' | 'error';
  error?: string;
}

let activeTab: ActiveTab | null = null;
let isUserActive = true;
const IDLE_TIMEOUT = 60; // seconds

// Initialize idle detection
chrome.idle.setDetectionInterval(IDLE_TIMEOUT);

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

async function saveTimeEntry() {
  if (activeTab) {
    const endTime = new Date();
    const duration = endTime.getTime() - activeTab.startTime.getTime();
    
    try {
      await addTimeEntry({
        url: activeTab.url,
        domain: activeTab.domain,
        startTime: activeTab.startTime,
        endTime,
        duration,
        title: activeTab.title
      });
    } catch (error) {
      console.error('Error saving time entry:', error);
    }
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse: (response: MessageResponse) => void) => {
  try {
    if (!sender.tab?.id) {
      sendResponse({ status: 'error', error: 'Invalid sender tab' });
      return true;
    }

    switch (message.type) {
      case 'activity_update':
        isUserActive = true;
        break;

      case 'idle_detected':
        if (isUserActive) {
          isUserActive = false;
          saveTimeEntry();
          activeTab = null;
        }
        break;

      case 'page_info':
        const { url, title } = message.data;
        if (url && title) {
          if (activeTab?.id !== sender.tab.id || activeTab?.url !== url) {
            saveTimeEntry();
            activeTab = {
              id: sender.tab.id,
              url,
              domain: getDomain(url),
              title,
              startTime: new Date()
            };
          }
        }
        break;
    }

    // Always send a response to prevent "Receiving end does not exist" errors
    sendResponse({ status: 'ok' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing message:', error);
    sendResponse({ status: 'error', error: errorMessage });
  }

  // Return true to indicate we will send a response asynchronously
  return true;
});

// Track active tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url && tab.title && tab.id) {
      await saveTimeEntry();
      activeTab = {
        id: tab.id,
        url: tab.url,
        domain: getDomain(tab.url),
        title: tab.title,
        startTime: new Date()
      };
    }
  } catch (error) {
    console.error('Error handling tab activation:', error);
  }
});

// Track URL changes in the active tab
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    if (activeTab && tabId === activeTab.id && changeInfo.url) {
      await saveTimeEntry();
      activeTab = {
        id: tabId,
        url: changeInfo.url,
        domain: getDomain(changeInfo.url),
        title: tab.title || '',
        startTime: new Date()
      };
    }
  } catch (error) {
    console.error('Error handling tab update:', error);
  }
});

// Handle idle state changes
chrome.idle.onStateChanged.addListener(async (state) => {
  try {
    const wasActive = isUserActive;
    isUserActive = state === 'active';

    if (wasActive && !isUserActive) {
      await saveTimeEntry();
      activeTab = null;
    } else if (!isUserActive && isUserActive && activeTab) {
      activeTab.startTime = new Date();
    }
  } catch (error) {
    console.error('Error handling idle state change:', error);
  }
});

// Setup daily summary alarm
chrome.alarms.create('dailySummary', {
  periodInMinutes: 1440 // 24 hours
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailySummary') {
    // TODO: Generate and store daily summary
    console.log('Daily summary alarm triggered');
  }
}); 