# 📂 Folder Structure

Here’s a quick overview of the Tohfey Dekho platform folder structure:

```
tohfeydekho/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/                # Images and static assets
│       ├── components/            # Reusable UI components
│       │   ├── browse/            # Browse page components (header, grid, etc.)
│       │   ├── cards/             # ProductCard, ExpertCTACard, QuizCTACard
│       │   ├── filters/           # Filters & Search components
│       │   ├── grids/             # Product grids
│       │   ├── headers/           # Page headers
│       │   ├── sections/          # Home/trending/feature sections
│       │   └── ui/                # Modal, buttons, etc.
│       ├── hooks/                 # Custom React hooks
│       ├── pages/                 # Main pages (Home, Browse, Cart, etc.)
│       ├── redux/                 # Redux store, slices, and thunks
│       ├── services/              # API service layer
│       ├── utils/                 # Constants and helpers
│       ├── App.jsx                # App root
│       └── main.jsx               # Entry point
│
├── server/
│   ├── src/
│   │   ├── config/                # Config files (DB, Cloudinary)
│   │   ├── controllers/           # Route controllers
│   │   ├── middleware/            # Auth, error handling, etc.
│   │   ├── models/                # Mongoose models
│   │   ├── routes/                # Express routes
│   │   ├── services/              # Business logic (matching engine, etc.)
│   │   └── utils/                 # Utilities
│   ├── .env.example               # Backend env example
│   └── package.json
│
├── README.md
├── SETUP_GUIDE.md
└── FOLDER_STRUCTURE.md
```

---
