# Website Time Tracker Chrome Extension

A Chrome extension that tracks and analyzes your time spent on different websites throughout the day.

## Features

- **Real-time Tracking**: Automatically tracks the time you spend on each website
- **Daily, Weekly, and Monthly Reports**: View your browsing habits over different time periods
- **Top Sites Analysis**: See which websites consume most of your time
- **Visual Statistics**: Progress bars show relative time spent on each site
- **Data Management**: Delete tracking data for specific websites

## Installation

### For Development

1. Clone this repository:
```bash
git clone https://github.com/RahulPant1/my-chrome-webusage-tracker.git
cd chrome-extension-mytracker
```
2. Install dependencies:
```bash
npm install
 ```

3. Build the extension:
```bash
npm run build
 ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to chrome://extensions/
   - Enable "Developer mode" in the top-right corner
   - Click "Load unpacked" and select the dist folder from this project

### For End Users
1. Download the extension from the Chrome Web Store (coming soon)
2. Click "Add to Chrome" to install the extension
## Usage
1. After installation, the extension will automatically start tracking your browsing activity
2. Click on the extension icon in your browser toolbar to open the popup
3. View your browsing statistics:
   - Select "Today", "This Week", or "This Month" from the dropdown to change the time period
   - See your total browsing time at the top
   - Browse the list of your most visited websites with time spent on each
4. To delete tracking data for a specific website, click the "×" button next to the site

## Privacy
- All data is stored locally on your device
- No data is sent to any external servers
- You can delete any tracking data at any time
## Technologies Used
- TypeScript
- React
- Vite
- Chrome Extension API
- IndexedDB (Dexie.js)
- Date-fns