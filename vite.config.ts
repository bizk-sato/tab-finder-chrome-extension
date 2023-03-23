import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx, defineManifest } from "@crxjs/vite-plugin";

const manifest = defineManifest({
  manifest_version: 3,
  name: "TabFinder",
  version: "0.0.0.1",
  permissions: ["tabs"],
  action: {
    default_popup: "index.html",
  },
  commands: {
    "_execute_action": {
      "suggested_key": {
        "windows": "Ctrl+Shift+Y",
        "mac": "MacCtrl+Shift+Y",
        "chromeos": "Ctrl+Shift+U",
        "linux": "Ctrl+Shift+J"
      }
    }
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })]
})
