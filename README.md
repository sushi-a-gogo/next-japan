# Next Japan

Next Japan is a full-stack demo app built with **Angular v20** and **Node.js/Express**, deployed on **Render** as two web services (SSR-enabled Angular frontend + REST API backend).  

Inspired by Japanese Anime, the app simulates a Japanese travel planning web site, allowing imaginary users to register for imaginary special events hosted at various locales in Japan. It was designed as a portfolio project to showcase modern front-end architecture, real-world API design, AI integration, and cloud deployment — all wrapped in a playful, visually engaging concept.  

👉 **Live site:** [https://nextjapan.jotek.dev](https://nextjapan.jotek.dev)  

---

## Goals
- Demonstrate Angular v20 component-driven development  
- Explore modern reactive Angular programming with **signals, `computed()`, and `effect()`**  
- Implement a **zoneless architecture** (removed Zone.js in favor of `provideZonelessChangeDetection()` for performance)  
- Build and expose a real-world **REST API** with Node.js/Express  
- Deploy both **SSR-enabled Angular frontend** and **Node.js/Express backend** as separate web services on Render  
- Integrate **OpenAI and xAI APIs** for interactive features  
- Use **Cloudflare Images** for optimized, globally cached delivery  
- Enable **Server-Side Rendering (SSR)** for performance and SEO  

---

## Tech Stack

| Layer        | Tools & Details |
|--------------|-----------------|
| Frontend     | Angular v20 (SSR-enabled), Angular Material |
| Backend API  | Node.js, Express, MongoDB |
| Hosting      | Render (two web services: Angular SSR frontend + Node.js/Express backend) |
| Database     | MongoDB Atlas (event storage & dynamic content) |
| Images       | Cloudflare Image Hosting |
| Integration  | OpenAI & xAI APIs (text + image generation, assistant logic) |
| Environment  | .env configs, CORS, prod/dev configs, AI endpoint rate limiting |

---

## AI-Generated Events
Events can be dynamically generated using **OpenAI** and **xAI** integrations. The backend ensures all events — including AI-generated ones — can be saved to MongoDB for persistence.  

---

## Screenshots
*(Optional – add one or two clean screenshots or GIFs here to show off the UI)*  
