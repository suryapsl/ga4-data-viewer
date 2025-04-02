module.exports = {
    apps: [{
      name: "vite-app",
      script: "npx",
      args: "vite preview --port 9996 --host",
      interpreter: "node",
      env: {
        "NODE_VERSION": "18"
      }
    }]
  };