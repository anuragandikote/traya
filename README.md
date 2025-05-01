## Getting Started

# Traya Form

A multi-step, session-persistent, and interactive form built with React, Redux, and Next.js. The form collects user information, tracks progress, and supports webcam/photo uploads for scalp assessment. User progress and answers are saved in the browser, so data is not lost on reload.

---

## Features

- Multi-step form with progress tracking
- Session persistence (answers saved in localStorage)
- Step navigation and visual progress bar
- Webcam and file upload support for image questions
- Responsive and modern UI with Tailwind CSS
- Redux for state management

---

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Folder Structure
├── Questions.tsx
│   ├── StepLocation.tsx
│   ├── Stepnavigator.tsx
├── features/
│   └── step/
│       └── stepSlice.ts
├── public/
│   └── assets/
│       └── bald_man.jpeg
├── src/
│   └── app/
│       └── page.tsx
├── store/
│   └── index.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
