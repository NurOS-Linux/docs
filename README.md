# NurOS Documentation

[![License](https://img.shields.io/badge/License-CC0-blue.svg)](LICENSE-CC0)
[![License](https://img.shields.io/badge/License-CCBYSA4-blue.svg)](LICENSE-CC-BY-SA-4.0)
[![Language](https://img.shields.io/badge/Languages-en%20%7C%20ru%20%7C%20kk-brightgreen.svg)](#translations)

Official documentation for NurOS Linux distribution.

## 🌐 Translations

- **English** (current file)
- [Русский (Russian)](README_ru.md)
- [Қазақша (Kazakh)](README_kk.md)

## 📖 About

This repository contains comprehensive documentation for NurOS, an independent Linux distribution. The documentation covers all major components of the system:

- **APG Package System** - Advanced Package format and ecosystem
- **Tulpar** - Package manager and libapg library
- **Tulpar Server** - Package repository server
- **AetherDE** - Desktop environment
- **System Utilities** - Essential tools like switch
- **Installation Guides** - System installation and porting

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/NurOS-Linux/docs.git
cd docs

# Install dependencies
npm install

# Start development server
npm start
```

The documentation site will open at `http://localhost:3000`.

### Building

```bash
# Build static site
npm run build

# Serve built site
npm run serve
```

## 📁 Project Structure

```
docs/
├── docs/           # Documentation files
│   ├── apg/       # APG package system
│   ├── aether/    # AetherDE desktop environment
│   ├── utils/     # System utilities
│   └── installing/# Installation guides
├── blog/          # Blog posts
├── src/           # Custom components
└── static/        # Static assets
```

## 🛠️ Technology Stack

- **Framework**: [Docusaurus](https://docusaurus.io/) 3.x
- **Language**: JavaScript, Markdown
- **Deployment**: GitHub Pages / Vercel

## 📝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit with descriptive messages (`git commit -m 'Add: feature description'`)
5. Push to your fork (`git push origin feature/improvement`)
6. Open a Pull Request

### Writing Guidelines

- Use clear, concise language
- Follow the existing structure
- Test local build before submitting
- Include code examples where appropriate

## 📄 License

- **Documentation Content**: Licensed under [CC BY-SA 4.0](LICENSE-CC-BY-SA-4.0)
- **Code Examples**: Licensed under [CC0](LICENSE-CC0)
- **NurOS Components**: Various licenses (see individual projects)

## 🔗 Links

- **NurOS Website**: https://nuros.org
- **GitHub Organization**: https://github.com/NurOS-Linux
- **Issue Tracker**: https://github.com/NurOS-Linux/docs/issues
- **Discussions**: https://github.com/NurOS-Linux/docs/discussions

## 👥 Community

- **Discord**: [Join our server](https://discord.gg/nuros)
- **Telegram**: [@nuros_linux](https://t.me/nuros_linux)
- **Matrix**: #nuros:matrix.org

## 📮 Contact

- **Email**: contact@nuros.org
- **GitHub Issues**: For documentation bugs and improvements

---

Copyright © 2025 NurOS Project
