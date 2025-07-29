const path = require('path')

module.exports = {
  version: "1.0.0",
  title: "SmolLM3-3B Chatbot",
  description: "Local SmolLM3-3B model with Gradio interface for conversational AI, featuring extended thinking mode and GPU acceleration",
  icon: "icon.png",
  menu: async (kernel, info) => {
    let installed = info.exists("app/env")
    let running = {
      install: info.running("install.js"),
      start: info.running("start.js"),
      update: info.running("update.js"),
      reset: info.running("reset.js")
    }
    
    // Show different menus based on state
    if (running.install) {
      return [{
        default: true,
        icon: "fa-solid fa-download",
        text: "Installing SmolLM3-3B...",
        href: "install.js",
      }]
    } else if (installed) {
      if (running.start) {
        let local = info.local("start.js")
        if (local && local.url) {
          return [{
            default: true,
            icon: "fa-solid fa-comments",
            text: "Open SmolLM3 Chat",
            href: local.url,
          }, {
            icon: 'fa-solid fa-terminal',
            text: "View Terminal",
            href: "start.js",
          }, {
            icon: "fa-solid fa-stop",
            text: "Stop Application",
            href: "start.js",
            params: { action: "stop" }
          }]
        } else {
          return [{
            default: true,
            icon: "fa-solid fa-spinner fa-spin",
            text: "Starting SmolLM3...",
            href: "start.js",
          }]
        }
      } else {
        // Main menu when installed but not running
        return [{
          default: true,
          icon: "fa-solid fa-play",
          text: "Start SmolLM3-3B",
          href: "start.js"
        }, {
          icon: "fa-solid fa-sync",
          text: "Update",
          href: "update.js",
        }, {
          icon: "fa-solid fa-download",
          text: "Reinstall",
          href: "install.js",
        }, {
          icon: "fa-solid fa-trash",
          text: "Reset",
          href: "reset.js",
        }]
      }
    } else {
      // Not installed - show install option
      return [{
        default: true,
        icon: "fa-solid fa-download",
        text: "Install SmolLM3-3B",
        href: "install.js",
      }]
    }
  }
}