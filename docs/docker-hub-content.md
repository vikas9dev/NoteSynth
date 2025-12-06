# Docker Hub Content Guide

This document contains the content you need to add to your Docker Hub repository.

---

## 1. Repository Description

**Short Description (for the main description field - max 100 characters):**

```
Generate AI-powered markdown notes from Udemy course captions using Gemini API
```

**Character count: 80 characters** ✅

---

## 2. Category

**Recommended Category:**
- **Education** or **Developer Tools**

---

## 3. Repository Overview

**Copy this entire section into the "Repository overview" field on Docker Hub:**

```markdown
# NoteSynth

Generate AI-powered markdown notes from Udemy course captions using Google's Gemini API. Transform lecture transcripts into well-structured, readable notes organized by chapters and lectures.

## 🚀 Quick Start

```bash
docker run -p 3000:3000 -e GEMINI_API_KEY=your_api_key_here vikas9dev/notesynth
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Prerequisites

- **Gemini API Key**: Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey)
- **Udemy Account**: You'll need to be enrolled in Udemy courses to generate notes

## 🔧 Environment Variables

### Required

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey). This is required for AI-powered note generation. |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port to run the application on | `3000` |
| `NODE_ENV` | Environment mode | `production` |

## 💻 Usage Examples

### Basic Run

```bash
docker run -p 3000:3000 -e GEMINI_API_KEY=AIzaSy... vikas9dev/notesynth
```

### Using Environment File

Create a `.env` file:
```env
GEMINI_API_KEY=your_api_key_here
```

Then run:
```bash
docker run -p 3000:3000 --env-file .env vikas9dev/notesynth
```

### Using Docker Compose

Create a `docker-compose.yml`:
```yaml
services:
  notesynth:
    image: vikas9dev/notesynth
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=your_api_key_here
```

Run with:
```bash
docker-compose up
```

### Run in Background (Detached Mode)

```bash
docker run -d -p 3000:3000 -e GEMINI_API_KEY=your_api_key_here --name notesynth-app vikas9dev/notesynth
```

View logs:
```bash
docker logs notesynth-app
```

Stop the container:
```bash
docker stop notesynth-app
docker rm notesynth-app
```

## 📖 How to Use

1. **Get Your Udemy Cookie**:
   - Log in to [Udemy.com](https://www.udemy.com)
   - Open Developer Tools (F12)
   - Go to the Network tab
   - Make any request (like clicking on a course)
   - Find the request headers and copy the entire cookie value

2. **Use the Application**:
   - Open http://localhost:3000
   - Paste your Udemy cookie in the input field
   - Click "Save & Load Courses" to fetch your courses
   - Select a course from the grid
   - Click "Select Lectures" to go to the curriculum page
   - Select the chapters/lectures you want notes for
   - Click "Generate Notes" to start the process
   - Monitor the progress in the modal
   - The ZIP file will download automatically when complete

## ✨ Features

- 🤖 **AI-Powered**: Uses Google's Gemini API to transform captions into well-structured notes
- 📚 **Organized Output**: Notes are organized by chapters and lectures in a ZIP file
- 🎨 **Clean Markdown**: Generates clean, readable markdown with proper formatting
- 🔍 **Smart Formatting**: Automatically detects and styles tips, warnings, examples, and notes
- 📦 **Easy Export**: Downloads all notes as a single ZIP file

## 🏷️ Available Tags

- `latest` - Latest stable release
- `1.0.0` - Specific version tag

## 📚 Example

See NoteSynth in action! This repository was created using NoteSynth to generate notes from an AWS certification course:

- **[AWS_SAA-C03](https://github.com/vikas9dev/AWS_SAA-C03)** - AWS Certified Solutions Architect Associate Certification notes generated with NoteSynth

This is a real-world example of how NoteSynth can transform Udemy course captions into well-structured, study-ready markdown notes organized by chapters and lectures.

## 🔗 Links

- **GitHub**: [vikas9dev/NoteSynth](https://github.com/vikas9dev/NoteSynth)
- **Live Demo**: [https://clever-liger-2e7c60.netlify.app/](https://clever-liger-2e7c60.netlify.app/)

## 📝 Notes

- The application requires a valid Gemini API key to function
- You must be enrolled in Udemy courses to generate notes
- The cookie is stored locally in your browser and never sent to external servers
- For best performance when downloading multiple lectures, run locally or use Docker

## 🐛 Troubleshooting

### Container won't start

Check logs:
```bash
docker logs notesynth-app
```

Common issue: Missing `GEMINI_API_KEY`
Solution: Ensure you pass the environment variable:
```bash
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key vikas9dev/notesynth
```

### Port already in use

Use a different port:
```bash
docker run -p 3001:3000 -e GEMINI_API_KEY=your_key vikas9dev/notesynth
```

## 📄 License

[Add your license information here]
```

---

## 📝 Step-by-Step Instructions

### Adding Description

1. Go to your Docker Hub repository: `https://hub.docker.com/r/vikas9dev/notesynth`
2. Click the **"Add a description"** button (or edit icon) next to the repository name
3. Paste the short description from section 1 above
4. Click **Save**

### Adding Category

1. On the same page, click **"Add a category"** button (or edit icon)
2. Select **"Education"** or **"Developer Tools"** from the dropdown
3. Click **Save**

### Adding Overview

1. Scroll down to the **"Repository overview"** section on the left panel
2. Click the **"Add overview"** button
3. Paste the entire content from section 3 above (the markdown content)
4. Click **Save** or **Update**

---

## ✅ Verification

After adding all content, verify:

1. **Description** appears next to the repository name
2. **Category** is visible in the repository metadata
3. **Overview** displays in the public view of your repository
4. All code blocks and formatting render correctly

---

**Note**: The overview will be visible to anyone viewing your repository, so make sure all information is accurate and up-to-date.

