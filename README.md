// File: README.md
# Thai Typing Trainer

An interactive web application to help you learn Thai typing with word practice, sentence completion, and conversation exercises.

## Features

- 📝 Word typing practice with pronunciation guides
- 🔤 Sentence completion exercises
- 💬 Conversation practice scenarios
- 🎯 Progress tracking and scoring
- 👁️ Show/hide answer functionality
- ⬅️➡️ Easy navigation between exercises

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

Build for production: `npm run build`

The `build` folder can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

## Built With

- React 18
- TypeScript
- Tailwind CSS
- Lucide React (for icons)

## Project Structure

```
thai-typing-trainer/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── ThaiTypingTrainer.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── package.json
├── tsconfig.json
└── README.md
```

## Quick Deploy to Vercel

1. Build the project: `npm run build`
2. Upload the `build` folder to Vercel
3. Or connect your GitHub repo to Vercel for automatic deployment
