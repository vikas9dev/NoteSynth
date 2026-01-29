# NoteSynth

Generate AI-powered markdown notes from Udemy course captions using **Google's Gemini API** or **Groq Cloud**. Transform lecture transcripts into well-structured, readable notes organized by chapters and lectures.

---

## 🌐 Live Site

**[https://clever-liger-2e7c60.netlify.app/](https://clever-liger-2e7c60.netlify.app/)**

> ⚠️ **Important Notes:**
>
> - This Netlify deployment runs on a free tier with limited resources (4 GB RAM). As a result, downloading **multiple lectures at once** may cause the app to freeze.
> - The live site uses **free-tier AI models**, so API quotas may be exhausted at any time.
> - ✅ **Limited usage:** You can download **one lecture at a time** via the live site.
> - 🚀 **For best experience:** Use **Docker** or run locally with your own API keys to download **multiple lectures** without limitations.

---

## 📥 Setup & Download Notes

Choose one of the following methods to set up NoteSynth and download notes from your Udemy courses.

### Prerequisites

- **AI API Keys**: 
  - **Groq (Recommended for Speed)**: Get a free key from [Groq Console](https://console.groq.com/keys)
  - **Gemini (Stable)**: Get a free key from [Google AI Studio](https://aistudio.google.com/apikey)
- **Udemy Account**: You need to be enrolled in Udemy courses to generate notes
- **Udemy Cookie**: Required to access course content (instructions below)

### Option 1: Docker (Recommended)

**Docker Hub:** [vikas9dev/notesynth](https://hub.docker.com/r/vikas9dev/notesynth)

#### Quick Start

```bash
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_gemini_key \
  -e GROQ_API_KEY=your_groq_key \
  vikas9dev/notesynth
```

#### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ⚠️ Optional* | Your Groq key (Recommended Primary) |
| `GEMINI_API_KEY` | ⚠️ Optional* | Your Gemini key (Fallback) |

*\*At least one AI key must be provided. If both are provided, NoteSynth will use Groq primarily and fall back to Gemini if rate limits are hit.*

---

### Option 2: Local Development

#### Installation

```bash
npm install
```

#### Configuration

Create a `.env.local` file in the root directory:

```env
GROQ_API_KEY=your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here
```

#### Running the Application

```bash
npm run dev
```

The application will be available at http://localhost:3000

---

## 🛡️ AI Stability & Rate Limiting

NoteSynth is built to handle the aggressive rate limits of free-tier AI providers:

- ⏳ **Intelligent Throttling**: The app automatically waits 4 seconds between requests to stay within free-tier limits (RPM).
- 🔄 **Auto-Fallback**: If one provider (e.g., Groq) is busy, the app automatically switches to the next available provider (e.g., Gemini).
- 🚀 **Efficiency**: Udemy course data is fetched once and reused across all lectures, reducing unnecessary network overhead.

---

## 📖 How to Download Notes

1. **Step 1: Get Your Udemy Cookie**
   - Log in to [Udemy.com](https://www.udemy.com)
   - Open Developer Tools (F12) > Network Tab
   - Click on any course to trigger a request
   - Copy the value of the `cookie` header.

2. **Step 2: Generate**
   - Click **"Save & Load Courses"**
   - Select your course and use the **"Select Lectures"** screen.
   - Click **"Generate Notes"**. 
   - A ZIP file will download automatically when completed.

### Features

- 🤖 **Multi-AI Support**: Integrated with Groq (Llama 3.3) and Google Gemini (1.5 Flash).
- 🔄 **Resilient Processing**: Built-in exponential backoff and provider fallback system.
- 📚 **Organized Output**: ZIP files structured by chapters and lecture indices.
- 🎨 **Smart Markdown**: Detects **Tips**, **Warnings**, and **Examples** with emojis and bolding.
- 📦 **One-Click Export**: Batch download entire chapters as a single ZIP.
- 💾 **Local Cache**: Securely stores your cookie and course list in browser storage.

---

## 📚 Example

See NoteSynth in action! This repository was created using NoteSynth to generate notes from an AWS certification course:

**[AWS_SAA-C03](https://github.com/vikas9dev/AWS_SAA-C03)** - AWS Certified Solutions Architect Associate Certification notes generated with NoteSynth.

---

## 🛠️ Development

```bash
npm run lint
npm run build
```