# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-UI-GUI is a visual code builder powered by Anthropic's Claude AI. Users can design applications visually and generate code with AI assistance. The application features a node-based visual builder, real-time code generation, and an integrated code editor.

## Architecture

### Stack
- **Frontend**: React 18 + TypeScript with Vite
- **Backend**: Express.js + TypeScript (API proxy for Claude)
- **UI Libraries**:
  - React Flow (visual node-based builder)
  - Monaco Editor (code display)
  - Tailwind CSS (styling)
  - Zustand (state management)
- **AI**: Anthropic Claude API (claude-3-5-sonnet model)

### Project Structure
```
AI-UI-GUI/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── VisualBuilder/Canvas.tsx    # React Flow canvas
│   │   │   ├── AIChat/ChatInterface.tsx    # Claude chat UI
│   │   │   ├── CodeEditor/Editor.tsx       # Monaco editor wrapper
│   │   │   └── ui/                         # Reusable UI components
│   │   ├── stores/                         # Zustand state stores
│   │   ├── hooks/                          # Custom React hooks
│   │   └── App.tsx                         # Main app component
│   └── vite.config.ts                      # Vite configuration
│
├── server/                 # Backend Express server
│   └── src/
│       ├── routes/chat.ts              # Chat API endpoint
│       ├── services/claude.ts          # Claude API integration
│       └── index.ts                    # Express server setup
│
└── shared/types/           # Shared TypeScript types
```

### Data Flow
1. User interacts with Visual Builder (React Flow) to create nodes
2. User sends prompts to AI Chat Interface
3. Frontend sends chat messages to backend `/api/chat` endpoint
4. Backend proxies request to Claude API (keeps API key secure)
5. Claude's response is parsed for code blocks
6. Generated code appears in Monaco Editor
7. Visual builder state can be used as context for code generation

## Development Commands

### Setup
```bash
npm install              # Install all dependencies (root + workspaces)
cp server/.env.example server/.env  # Create server environment file
# Add your ANTHROPIC_API_KEY to server/.env
```

### Development
```bash
npm run dev             # Run both client and server concurrently
npm run dev:client      # Run frontend only (port 5173)
npm run dev:server      # Run backend only (port 3001)
```

### Build
```bash
npm run build           # Build both client and server
npm run type-check      # TypeScript type checking for entire project
```

### Clean
```bash
npm run clean           # Remove all node_modules and build outputs
```

## Environment Variables

### Backend (server/.env)
- `ANTHROPIC_API_KEY` - Your Anthropic API key (required)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `ALLOWED_ORIGINS` - CORS allowed origins (default: http://localhost:5173)

### Frontend (client/.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3001)

## Key Files

### Frontend Components
- `client/src/App.tsx` - Main app layout with 3-panel design
- `client/src/components/VisualBuilder/Canvas.tsx` - React Flow canvas for visual node editing
- `client/src/components/AIChat/ChatInterface.tsx` - Chat UI that sends messages to Claude
- `client/src/components/CodeEditor/Editor.tsx` - Monaco editor for code display

### Backend
- `server/src/index.ts` - Express server with CORS, rate limiting, error handling
- `server/src/routes/chat.ts` - POST `/api/chat` endpoint for chat messages
- `server/src/services/claude.ts` - Claude API client using @anthropic-ai/sdk

### Configuration
- `client/vite.config.ts` - Vite config with path aliases and API proxy
- `client/tailwind.config.js` - Tailwind CSS configuration
- TypeScript configs: `client/tsconfig.json`, `server/tsconfig.json`

## Monorepo Workspace

This project uses npm workspaces to manage the client and server as separate packages. When running `npm install` in the root, it installs dependencies for all workspaces. Scripts in the root package.json use `--workspace` flags to run commands in specific workspaces.
