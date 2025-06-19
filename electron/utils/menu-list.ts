import { BrowserWindow, dialog } from "electron";
import fs from "fs";
import path from "path";

const menuTemplate: Electron.MenuItemConstructorOptions[] = [
  {
    label: "File",
    submenu: [
      {
        label: "Open Schedule File",
        accelerator: "CmdOrCtrl+O",
        click: async () => {
          const win = BrowserWindow.getFocusedWindow();
          if (!win) return;

          const result = await dialog.showOpenDialog(win, {
            properties: ["openFile"],
            filters: [
              { name: "Apoworship Schedule Files", extensions: ["aposch"] },
            ],
          });

          if (!result.canceled && result.filePaths.length > 0) {
            const filePath = result.filePaths[0];
            const content = fs.readFileSync(filePath, "utf-8");
            console.log("File content:", content);

            // Send to renderer via IPC if needed
            win.webContents.send("file-opened", {
              filePath: path.basename(filePath),
              content,
            });
          }
        },
      },
      {
        label: "Save File",
        accelerator: "CmdOrCtrl+S",
        enabled: false, // Start as disabled
        click: async () => {
          const win = BrowserWindow.getFocusedWindow();
          if (!win) return;

          //  customized extension to be aposch
          const { canceled, filePath } = await dialog.showSaveDialog(win, {
            title: "Save your file",
            defaultPath: "untitled.aposch",
            filters: [
              { name: "Apoworship Schedule Files", extensions: ["aposch"] },
            ],
          });

          if (!canceled && filePath) {
            // Ask renderer for content
            win.webContents.send("request-file-content", filePath);
          }
        },
      },
      { type: "separator" },
      { role: "quit" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "About",
        click: () => {
          console.log("About clicked");
        },
      },
    ],
  },
];

export default menuTemplate;
