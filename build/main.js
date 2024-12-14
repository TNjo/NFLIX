const { app, BrowserWindow } = require('electron');
const path = require('path');
require('@electron/remote/main').initialize(); // Optional, if you need remote module functionality

let mainWindow;

function createWindow() {
    // Create a new Electron window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,  // Disable Node.js integration (for security reasons)
            contextIsolation: true,  // Enable context isolation
            // preload: path.join(__dirname, 'preload.js')  // Optional: preload script if needed
        },
    });

    // Load the React app from the production build (for packaged app)
    const startURL = path.join(__dirname, 'build', 'index.html');
    mainWindow.loadFile(startURL);  // Loads the static files after building React app

    // Optional: Open Developer Tools (useful for debugging)
    // mainWindow.webContents.openDevTools();

    // Handle window close
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Create window once the app is ready
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit the app when all windows are closed (for non-macOS platforms)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
