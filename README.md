Next Japan is a full-stack demo app that exists in an imaginary world inspired by Japanese Anime, allowing
imaginary users to register for special events hosted at various locales in Japan.
Built as a portfolio project, it demonstrates modern front-end architecture, full REST API design, OpenAI
integration, and cloud deployment — all wrapped in a playful, visually engaging concept.

Goals
- Demonstrate Angular v20 component-driven development
- Learn 'modern' reactive angular programming techniques: signals, computed() and effect()
- Implement a real-world REST API with Express
- Deploy both frontend and backend to the cloud (Render)
- Integrate OpenAI API to enhance interactivity
- SSR for optimized performance and SEO

Tech Stack

Layer Tools Used
- Frontend Angular v20, Angular Router, Angular Material
- Backend Node.js, Express, serverless-style API design
- MongoDB for persistent event storage and dynamic content management
- Hosting Render (static + web service)
- Integration OpenAI and xAI APIs (text and image generation, assistant logic)
- Data Source Simulated API with local JSON file mock data
- Environment .env variables, prod/staging configs, CORS, rate limiting

### AI-Generated Events
Events can be generated using OpenAI/xAI integration. The backend ensures all events, including AI-generated ones, are saved to MongoDB.
