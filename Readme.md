# Property Data Extractor (Propa)
A browser extension and server solution for real-time property market analysis and data extraction.

## Features
- Browser extension for property data capture
- AI-powered analysis of property listings
- Market trends and updated property details
- Comparable sales analysis
- Rental yield estimates

## Tech Stack

### Extension:

- React + TypeScript
- Bedframe Framework (https://bedframe.dev)
- Shadcn UI Components

### Server:

- ElysiaJS (Bun runtime)
- Drizzle ORM
- PostgreSQL
- Redis


## Setup Instructions
```
# Clone repository
git clone https://github.com/yourusername/data-extractor.git
cd data-extractor

# Install dependencies for both projects
bun install
cd bedframe && bun install
cd ../server && bun install

# Set up database
brew install postgresql@16 redis
brew services start postgresql@16
brew services start redis

# Create and migrate database
cd server
bunx drizzle-kit push
bunx drizzle-kit migrate

```


## Running the Project

### Start Server:
```
cd server
bun run dev
```

### Build Extension:
```
cd bedframe
bun run build
```


### Load Extension in Browser:

- Open Chrome/Edge and go to chrome://extensions
- Enable "Developer mode"
- Click "Load unpacked"  
- select data-extractor/bedframe/dist/chrome


## Environment Variables

duplicate the .env.example files in both server and  directories:

### Server .env

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3000)
- `GOOGLE_API_KEY`: Redis host (default: localhost)
- `KLAVIS_API_KEY`: Klavis API key from klavis registry


### bedframe .env


- - `VITE_API_URL`: url of the server
- `PROMPT_API_KEY`: Prompt API key from chrome trials