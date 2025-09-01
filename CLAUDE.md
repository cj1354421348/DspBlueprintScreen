# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a local blueprint screening and management tool for the game "Dyson Sphere Program", built with Vue 3 and Electron.

## High-Level Architecture

- **Frameworks**: The application uses Vue 3 for the frontend and Electron for the desktop wrapper.
- **Main Process**: The Electron main process is managed by `src/background.ts`, which handles window creation and application lifecycle events.
- **Renderer Process**: The frontend is a standard Vue application with its entry point at `src/main.ts`. It uses Vue Router for navigation and Vuex for state management.
- **File System Interaction**: All interactions with the local file system, such as reading blueprint files and handling configurations, are abstracted in the `src/AppIO/` directory.
- **Blueprint Logic**: The core logic for parsing and managing blueprints is located in the `src/blueprint/` directory.
- **Configuration**: Application paths are configured via a `config.json` file, which is managed through a settings dialog within the app.

## Common Development Commands

- **Install Dependencies**:
  ```bash
  yarn install
  ```

- **Run in Development Mode**:
  ```bash
  yarn electron:serve
  ```

- **Build for Production**:
  ```bash
  yarn electron:build
  ```
