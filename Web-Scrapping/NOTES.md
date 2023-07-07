# Project Initialization
```bash
npm init -y
npm install --save-dev typescript ts-node @types/node nodemon
npx tsc --init
```

## in tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "./src",
    "esModuleInterop": true
  }
}

```

## in nodemon.json
```json
{
  "ignore": [".git", "node_modules", "dist"],
  "watch": ["./src"], 
  "exec": "npm start", 
  "ext": "ts" 
}

```

## in .gitignore
```
# compiled output
/dist
# dependencies
/node_modules
```

## in package.json
```json
"scripts": {
      "start": "ts-node ./src/server.ts",
      "dev": "nodemon",
      "build": "npx tsc"
  }

```

# Install Dependencies
```bash
npm install --save puppeteer
npm install --save-dev @types/puppeteer

npm install --save pino pino-pretty dayjs
```