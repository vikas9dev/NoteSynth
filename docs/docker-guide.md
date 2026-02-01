# Building and Publishing Docker Image

This guide covers how to build, test, and publish the NoteSynth Docker image.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Hub](https://hub.docker.com/) account (for publishing)
- Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

---

## CI/CD: GitHub Actions with Release Please

We use **[release-please](https://github.com/googleapis/release-please)** for automated versioning and **GitHub Actions** for Docker builds.


### How It Works

1. **Push commits to main** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add history page"    # → bumps MINOR
   git commit -m "fix: correct LLM status"   # → bumps PATCH
   git commit -m "feat!: breaking change"    # → bumps MAJOR
   ```

2. **Release Please creates a Release PR** automatically with:
   - Version bump in `package.json`
   - Generated CHANGELOG

3. **Merge the Release PR** when ready → triggers Docker build with version tag

### Workflows

| Workflow | File | Trigger | Action |
|----------|------|---------|--------|
| Release Please | `release-please.yml` | Push to main | Creates/updates Release PR |
| Docker Build | `docker-publish.yml` | Push to main | Builds `:latest` |
| Docker Release | `docker-publish.yml` | Release published | Builds `:latest` + `:v1.2.0` |

### Docker Tags Created

| Event | Tags |
|-------|------|
| Push to main | `vikas9dev/notesynth:latest` |
| Release published | `vikas9dev/notesynth:latest`, `:1.2.0`, `:1.2` |

### Required GitHub Secrets

**Option 1: Per-Repository** (Settings → Secrets → Actions)

**Option 2: Organization-wide** (Recommended if you have multiple repos)
- Go to `github.com/[your-username]/settings/secrets/actions`
- Add secrets and select which repos can access them

Secrets needed:
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token (create at https://hub.docker.com/settings/security)

---

## Release Checklist

With release-please, releasing is simple:

1. **Write commits** using conventional commit format
   ```bash
   git commit -m "feat: add new feature"
   git push origin main
   ```

2. **Review the Release PR** created by release-please

3. **Merge the Release PR** → automatically creates tag, GitHub Release, and Docker image

4. **Verify on Docker Hub** at https://hub.docker.com/r/vikas9dev/notesynth/tags

---

## Manual Build & Publish (Alternative)

If you prefer not to use CI/CD, here's how to build and publish manually.

### Building the Image

```bash
# Basic build
docker build -t notesynth .

# Build with version from package.json
VERSION=$(node -p "require('./package.json').version")
docker build --build-arg VERSION=$VERSION -t notesynth:latest -t notesynth:$VERSION .
```

### Testing Locally

```bash
# Run the container
docker run -p 3000:3000 -e GEMINI_API_KEY=your_api_key_here notesynth

# Run in detached mode
docker run -d -p 3000:3000 -e GEMINI_API_KEY=your_key --name notesynth-app notesynth

# View logs
docker logs notesynth-app

# Stop
docker stop notesynth-app && docker rm notesynth-app
```

### Publishing to Docker Hub

```bash
# Login
docker login

# Tag and push
VERSION=$(node -p "require('./package.json').version")
docker tag notesynth:latest YOUR_USERNAME/notesynth:latest
docker tag notesynth:$VERSION YOUR_USERNAME/notesynth:$VERSION
docker push YOUR_USERNAME/notesynth:latest
docker push YOUR_USERNAME/notesynth:$VERSION
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Gemini API key for AI-powered note generation |
| `PORT` | No | Port to run on (default: 3000) |
| `NODE_ENV` | No | Environment mode (default: production) |

---

## Docker Compose

For easier local development:

```bash
export GEMINI_API_KEY=your_api_key_here
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop
docker-compose down
```
