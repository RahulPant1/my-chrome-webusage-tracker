# Plan for Chrome Extension: Website Time Tracker

## **Overview**
This Chrome extension will track the time spent on each website throughout the day and provide summaries. It will generate daily, weekly, and monthly reports, detect idle time, allow users to set website usage limits, and support data export.

---
## **Features**

### **1. Time Tracking**
- Logs time spent on each website in real-time.
- Records total active time per site across a session.
- Supports tracking across browser restarts.

### **2. Idle Time Detection**
- Detects user inactivity (e.g., no mouse/keyboard input for a set duration).
- Pauses tracking when inactive.

### **3. Daily, Weekly, and Monthly Reports**
- Displays a breakdown of time spent on websites for the current day.
- Generates weekly and monthly summaries for analysis.

### **4. Custom Alerts & Limits**
- Allows users to set daily time limits per website.
- Shows alerts when nearing or exceeding limits.

### **5. Data Storage & Export**
- Stores tracking data locally (IndexedDB or Local Storage).
- Allows users to export data in CSV or JSON format.

### **6. User Interface**
- **Popup UI**: Quick view of current session stats and daily summary.
- **Options Page**: Configure tracking settings, limits, and export preferences.

---
## **Technical Stack**
- **Frontend**: React + Vite (for Popup and Options UI)
- **Storage**: IndexedDB or Local Storage
- **Background Processing**: Service Worker (background.ts)
- **Content Script**: Tracks active tab and website changes
- **Manifest Version**: MV3 (Chrome Extension API)

---
## **File Structure**
```
📦 time-tracker-extension  
 ┣ 📂 public  
 ┃ ┣ 📄 icon16.png  
 ┃ ┣ 📄 icon48.png  
 ┃ ┣ 📄 icon128.png  
 ┃ ┗ 📄 manifest.json  
 ┣ 📂 src  
 ┃ ┣ 📂 background  
 ┃ ┃ ┗ 📄 background.ts  
 ┃ ┣ 📂 content  
 ┃ ┃ ┗ 📄 content.ts  
 ┃ ┣ 📂 popup  
 ┃ ┃ ┣ 📄 Popup.tsx  
 ┃ ┃ ┣ 📄 Popup.css  
 ┃ ┃ ┗ 📄 index.tsx  
 ┃ ┣ 📂 options  
 ┃ ┃ ┣ 📄 Options.tsx  
 ┃ ┃ ┣ 📄 Options.css  
 ┃ ┃ ┗ 📄 index.tsx  
 ┃ ┣ 📂 hooks  
 ┃ ┃ ┗ 📄 useTimeTracker.ts  
 ┃ ┣ 📂 utils  
 ┃ ┃ ┗ 📄 storage.ts  
 ┃ ┣ 📄 main.tsx  
 ┃ ┗ 📄 style.css  
 ┣ 📄 package.json  
 ┣ 📄 tsconfig.json  
 ┣ 📄 vite.config.ts  
 ┣ 📄 README.md  
 ┗ 📄 .gitignore  
```


---
## **Next Steps**
1. Set up the project with Vite + React + TypeScript.
2. Implement time tracking in `background.ts`.
3. Create `content.ts` to detect active tab changes.
4. Develop UI for popup and options.
5. Add storage, export functionality, and settings.
6. Test idle detection and daily reports.
7. Package and test the extension in Chrome.

---

