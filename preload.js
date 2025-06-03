import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("api", {
  // Placeholder for future IPC handlers
});
