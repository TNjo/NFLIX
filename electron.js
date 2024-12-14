const { app, BrowserWindow } = require('electron');
const express = require('express');
const path = require('path');
const { exec } = require('child_process');  // This will allow us to run the Python server

let mainWindow;
const server = express();
const PORT = 3001;
const FLASK_SERVER_PATH = path.join(__dirname, 'main.exe');  // Path to your Flask server (main.exe)

// Function to start the Flask server
function startFlaskServer() {
  exec(`${FLASK_SERVER_PATH}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error starting Flask server: ${stderr}`);
    } else {
      console.log(`Flask server started: ${stdout}`);
    }
  });
}

app.on('ready', () => {
  // Start the Flask server (API backend)
  startFlaskServer();

  // Serve the React build folder
  const buildPath = path.join(__dirname, 'build');
  server.use(express.static(buildPath));
  server.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });

  // Start Express server for React frontend
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);

    // Create the Electron window
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    // Load React app in Electron window
    mainWindow.loadURL(`http://localhost:${PORT}`);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
