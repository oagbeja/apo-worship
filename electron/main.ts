import { app, BrowserWindow, ipcMain, screen } from "electron";
import path from "path";
// import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { getBooks, getVerse } from "./db/services/bible-service";
import { getSongTitles, getSongWords } from "./db/services/song-service";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

dotenv.config();
console.log("Electron main running");
let controlWindow;
let presentationWindow: any;

app.whenReady().then(() => {
  const displays = screen.getAllDisplays();

  // Display 0: primary; Display 1: secondary
  // const primaryDisplay = displays[0];
  const secondaryDisplay = displays.length > 1 ? displays[1] : null;

  console.log({ __dirname });
  // Control window (on primary display)
  controlWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  // controlWindow.loadURL(process.env.VITE_DEV_SERVER_URL); // Vite dev server or built file
  console.log(path.join(__dirname, "../../dist/index.html"));
  controlWindow.loadFile(path.join(__dirname, "../../dist/index.html"), {
    hash: "/",
  });

  // Presentation window (on second display)
  if (secondaryDisplay) {
    const { x, y, width, height } = secondaryDisplay.bounds;
    presentationWindow = new BrowserWindow({
      x,
      y,
      width,
      height,
      fullscreen: true,
      frame: false,
      alwaysOnTop: true,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });
    console.log(`${displays.length} monitor detected`);

    presentationWindow.loadFile(path.join(__dirname, "../../dist/index.html"), {
      hash: "presentation",
    });
    // presentationWindow.loadURL(
    //   `${process.env.VITE_DEV_SERVER_URL}/presentation`
    // ); // Or use React Router to route
  } else {
    console.log("Only one monitor detected");
  }
});

ipcMain.handle("get-verse", (event, book, chapter) => {
  // console.log('Table "items" created or already exists.');
  return getVerse(book, chapter);
});

ipcMain.handle("get-books", (event) => {
  return getBooks();
});

ipcMain.handle("get-song-titles", (event, srch?: string) => {
  return getSongTitles(srch);
});

ipcMain.handle("get-song-words", (event, rowId) => {
  return getSongWords(rowId);
});
ipcMain.on("trigger-presentation", (event, payload) => {
  // Forward to the presentation window
  if (presentationWindow) {
    // console.log({ payload });
    presentationWindow.webContents.send("presentation-action", payload);
  }
});
