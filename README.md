# AI-UI-GUI

**Visual Coding with AI** - A visual code builder powered by Anthropic's Claude AI

Build applications visually with an intuitive node-based interface and generate code with AI assistance. Features a real-time visual builder, AI-powered code generation, and integrated code editor.

## Features

- **Visual Node Builder** - Drag-and-drop interface powered by React Flow
- **AI Code Generation** - Generate code using Claude AI with natural language prompts
- **Real-time Code Editor** - View and edit generated code with Monaco Editor (VS Code's editor)
- **Three-panel Layout** - Visual builder, code editor, and AI chat in one interface

## Tech Stack

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, React Flow, Monaco Editor
- **Backend**: Express.js + TypeScript (API proxy)
- **AI**: Anthropic Claude API (claude-3-5-sonnet)

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Anthropic API key ([Get one here](https://console.anthropic.com/))

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create environment file for the backend:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```

Optionally, create `client/.env` (uses defaults if not created):

```bash
cp client/.env.example client/.env
```

### 3. Start Development Servers

Run both frontend and backend:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Frontend (port 5173)
npm run dev:client

# Terminal 2 - Backend (port 3001)
npm run dev:server
```

### 4. Open the Application

Navigate to [http://localhost:5173](http://localhost:5173)

## Usage

1. **Visual Builder** (left panel) - Create and connect nodes for your application structure
2. **AI Chat** (right panel) - Ask Claude to generate code
   - Example: "Create a React button component with hover effects"
3. **Code Editor** (center panel) - View and edit the generated code

## Development Commands

```bash
npm run dev          # Run both client and server
npm run dev:client   # Run frontend only
npm run dev:server   # Run backend only
npm run build        # Build both for production
npm run type-check   # TypeScript type checking
npm run clean        # Remove node_modules and build outputs
```

## Project Structure

```
AI-UI-GUI/
├── client/          # React frontend application
├── server/          # Express backend API
├── shared/          # Shared TypeScript types
└── package.json     # Root workspace configuration
```

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation.

## Contributing

This is an early-stage project. Contributions, ideas, and feedback are welcome!

## License

MIT
