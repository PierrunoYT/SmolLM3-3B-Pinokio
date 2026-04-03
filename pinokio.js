const path = require('path')
module.exports = {
  version: "1.0.0",
  title: "SmolLM3-3B Chatbot",
  description: "Advanced 3B parameter language model with Gradio web interface, GPU acceleration, and complete privacy",
  icon: "icon.jpg",
  menu: async (kernel, info) => {
    let installed = info.exists("env") || info.exists("app/env")
    let installing = info.running("install.js")
    let running = info.running("start.js")
    let updating = info.running("update.js")
    let resetting = info.running("reset.js")
    if (installing) {
      return [{
        default: true,
        icon: "fa-solid fa-plug",
        text: "Installing",
        href: "install.js",
      }]
    } else if (installed) {
      if (running) {
        let local = kernel.memory.local[path.resolve(__dirname, "start.js")]
        if (local && local.url) {
          return [{
            default: true,
            icon: "fa-solid fa-rocket",
            text: "Open Web UI",
            href: local.url,
          }, {
            icon: 'fa-solid fa-terminal',
            text: "Terminal",
            href: "start.js",
          }]
        } else {
          return [{
            default: true,
            icon: 'fa-solid fa-terminal',
            text: "Terminal",
            href: "start.js",
          }]
        }
      } else if (updating) {
        return [{
          default: true,
          icon: 'fa-solid fa-arrows-rotate',
          text: "Updating",
          href: "update.js",
        }]
      } else if (resetting) {
        return [{
          default: true,
          icon: 'fa-solid fa-terminal',
          text: "Resetting",
          href: "reset.js",
        }]
      } else {
        return [{
          default: true,
          icon: "fa-solid fa-power-off",
          text: "Start",
          href: "start.js",
        }, {
          icon: "fa-solid fa-arrows-rotate",
          text: "Update",
          href: "update.js",
        }, {
          icon: "fa-solid fa-plug",
          text: "Install",
          href: "install.js",
        }, {
          icon: "fa-solid fa-file-zipper",
          text: "<div><strong>Save Disk Space</strong><div>Deduplicates redundant library files</div></div>",
          href: "link.js",
        }, {
          icon: "fa-regular fa-circle-xmark",
          text: "<div><strong>Reset</strong><div>Revert to pre-install state</div></div>",
          href: "reset.js",
          confirm: "Are you sure you wish to reset the app?"
        }]
      }
    } else {
      return [{
        default: true,
        icon: "fa-solid fa-plug",
        text: "Install",
        href: "install.js",
      }]
    }
  }
}
