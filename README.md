# NoteSynth

Generate AI-powered markdown notes from Udemy course captions using Google's Gemini API. Transform lecture transcripts into well-structured, readable notes organized by chapters and lectures.

---

## 🌐 Live Site

**[https://clever-liger-2e7c60.netlify.app/](https://clever-liger-2e7c60.netlify.app/)**

> ⚠️ **Important Notes:**
>
> - This Netlify deployment runs on a free tier with limited resources (4 GB RAM). As a result, downloading **multiple lectures at once** may cause the app to freeze.
> - The live site uses a **free version of Gemini API**, so API credits may be exhausted at any time.
> - ✅ **Limited usage:** You can download **one lecture at a time** via the live site.
> - 🚀 **For best experience:** Use **Docker** or run locally with your own Gemini API key to download **multiple lectures** without limitations.

---

## 📥 Setup & Download Notes

Choose one of the following methods to set up NoteSynth and download notes from your Udemy courses.

### Prerequisites

- **Gemini API Key**: Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey)
- **Udemy Account**: You need to be enrolled in Udemy courses to generate notes
- **Udemy Cookie**: Required to access course content (instructions below)

### Option 1: Docker (Recommended)

**Docker Hub:** [vikas9dev/notesynth](https://hub.docker.com/r/vikas9dev/notesynth)

#### Quick Start

```bash
docker run -p 3000:3000 -e GEMINI_API_KEY=your_api_key_here vikas9dev/notesynth
```

Then open http://localhost:3000

#### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Your Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey) |

#### Docker Examples

**Using inline environment variable:**
```bash
docker run -p 3000:3000 -e GEMINI_API_KEY=AIzaSy... vikas9dev/notesynth
```

**Using an env file:**
```bash
# Create a file named .env with:
# GEMINI_API_KEY=your_api_key_here

docker run -p 3000:3000 --env-file .env vikas9dev/notesynth
```

**Using Docker Compose:**
```yaml
services:
  notesynth:
    image: vikas9dev/notesynth
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=your_api_key_here
```

Then run:
```bash
docker-compose up
```

### Option 2: Local Development

#### Requirements

- **Node.js** (v20 or higher)
- Built with **[Next.js](https://nextjs.org)**

#### Installation

```bash
npm install
```

#### Configuration

Create a `.env.local` file in the root directory with your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual Gemini API key.

#### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000

---

## 📖 How to Download Notes

Once you have NoteSynth running (via Docker or local setup), follow these steps to download notes:

### Step 1: Get Your Udemy Cookie

1. Go to [Udemy.com](https://www.udemy.com) and log in
2. Open Developer Tools (F12 or right-click > Inspect)
3. Go to the **Network** tab
4. Make any request (like clicking on a course)
5. Find the request headers and copy the entire **cookie** value

### Step 2: Use the Application

1. Open your browser and go to **http://localhost:3000** (or the live site)
2. **Paste your Udemy cookie** in the input field
3. Click **"Save & Load Courses"** to fetch your courses
4. **Select a course** from the grid
5. Click **"Select Lectures"** to go to the curriculum page
6. **Select the chapters/lectures** you want notes for
7. Click **"Generate Notes"** to start the process
8. **Monitor the progress** in the modal
9. The **ZIP file will download automatically** when complete

### Features

- 🤖 **AI-Powered**: Uses Google's Gemini API to transform captions into well-structured notes
- 📚 **Organized Output**: Notes are organized by chapters and lectures in a ZIP file
- 🎨 **Clean Markdown**: Generates clean, readable markdown with proper formatting
- 🔍 **Smart Formatting**: Automatically detects and styles tips, warnings, examples, and notes
- 📦 **Easy Export**: Downloads all notes as a single ZIP file
- 💾 **Caching**: Caches your cookie and courses in localStorage
- 🔎 **Search & Sort**: Search and sort through your courses
- 📊 **Progress Tracking**: Shows completion progress for each course

---

## 📚 Example

See NoteSynth in action! This repository was created using NoteSynth to generate notes from an AWS certification course:

**[AWS_SAA-C03](https://github.com/vikas9dev/AWS_SAA-C03)** - AWS Certified Solutions Architect Associate Certification notes generated with NoteSynth.

This is a real-world example of how NoteSynth can transform Udemy course captions into well-structured, study-ready markdown notes organized by chapters and lectures.

---

## 🛠️ Development

### Linting & Building

To check ESLint issues and build the application:

```bash
npm run lint
npm run build
```

---