## Tasks Generator

A simple web app that converts a feature idea into structured user stories and engineering tasks using an LLM.

### Features
- Generate tasks from goal, users, and constraints  
- Team size and timeframe planning inputs  
- Editable results with copy or Markdown download  
- Shows last 5 generated specs  
- System status visible on the home page  

### Tech Stack
- Next.js (App Router)  
- TypeScript  
- Prisma + SQLite  
- OpenRouter (LLM)  


### Run Locally

```bash
git clone <repo-url>
cd <repo-name>
npm install
```
Create .env file:

DATABASE_URL="file:./dev.db"
OPENROUTER_API_KEY="your_api_key_here"
Run database migration:

npx prisma migrate dev
Start development server:

npm run dev
Open:

http://localhost:3000




## Status

#  Done

Task generation workflow  
Team size + timeframe planning  
Editable and exportable results  
History (last 5 specs)  
Basic validation  

# Not done

No authentication  
No drag-and-drop ordering  
Basic UI styling  
Basic backend  


## Image

![Tasks Generator Main](public/S1.png)
![Tasks Generator Form](public/S2.png)
![Tasks Generator Results](public/S3.png)