# Building and Publishing Docker Image

This guide covers how to build, test, and publish the NoteSynth Docker image.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Hub](https://hub.docker.com/) account (for publishing)
- Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

---

## Versioning Strategy

The version is managed in `package.json` and passed to Docker during build.

### Current Version

Check the current version:
```bash
node -p "require('./package.json').version"
```

### Bumping Version

Before a new release, update the version in `package.json`:

```json
{
  "name": "udemy-notes",
  "version": "1.1.0",  // ← Update this
  ...
}
```

**Versioning convention (Semantic Versioning):**
- `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)
- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes

---

## Building the Image

### Using Build Script (Recommended)

```bash
cd scripts
chmod +x docker-build.sh
./docker-build.sh
```

The script automatically:
- Read version from `package.json`
- Tag image with both `latest` and version number
- Pass version to Docker build

### Manual Build

**Basic build:**
```bash
docker build -t notesynth .
```

**Build with version from package.json:**
```bash
# Get version
VERSION=$(node -p "require('./package.json').version")

# Build with version tag
docker build --build-arg VERSION=$VERSION -t notesynth:latest -t notesynth:$VERSION .
```

---

## Testing Locally

### Run the Container

```bash
docker run -p 3000:3000 -e GEMINI_API_KEY=your_api_key_here notesynth
```

### Run in Detached Mode (Background)

```bash
docker run -d -p 3000:3000 -e GEMINI_API_KEY=your_api_key_here --name notesynth-app notesynth
```

### View Logs

```bash
docker logs notesynth-app
```

### Stop the Container

```bash
docker stop notesynth-app
docker rm notesynth-app
```

---

## Publishing to Docker Hub

### Using Build Script (Recommended)

```bash
cd scripts
./docker-build.sh --push YOUR_DOCKERHUB_USERNAME
```

### Manual Publishing

#### Step 1: Login to Docker Hub

```bash
docker login
```

Enter your Docker Hub username and password/token.

#### Step 2: Tag the Image

```bash
# Get current version
VERSION=$(node -p "require('./package.json').version")

docker tag notesynth:latest YOUR_DOCKERHUB_USERNAME/notesynth:latest
docker tag notesynth:$VERSION YOUR_DOCKERHUB_USERNAME/notesynth:$VERSION
```

#### Step 3: Push to Docker Hub

```bash
docker push YOUR_DOCKERHUB_USERNAME/notesynth:latest
docker push YOUR_DOCKERHUB_USERNAME/notesynth:$VERSION
```

#### Step 4: Update Docker Hub Description

1. Go to https://hub.docker.com/repository/docker/YOUR_USERNAME/notesynth
2. Click **"Repository Overview"** tab
3. Copy content from `README.md` (especially the Docker section)
4. Save

### Verify Published Version

```bash
# Check available tags on Docker Hub
docker manifest inspect YOUR_DOCKERHUB_USERNAME/notesynth:latest

# Or pull and check
docker pull YOUR_DOCKERHUB_USERNAME/notesynth:latest
docker inspect YOUR_DOCKERHUB_USERNAME/notesynth:latest | grep version
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

For easier local development, use `docker-compose.yml`:

```bash
# Set your API key
export GEMINI_API_KEY=your_api_key_here

# Build and run
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop
docker-compose down
```

---

## CI/CD: GitHub Actions

To automate building and pushing on every release, create `.github/workflows/docker-publish.yml`:

```yaml
name: Build and Push Docker Image

on:
  push:
    tags:
      - 'v*'

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Extract version from tag
        id: version
        run: echo "VERSION=${GITHUB_REF#refs/tags/v}" >> $GITHUB_OUTPUT

      - name: Build and Push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.DOCKERHUB_USERNAME }}/notesynth:latest
            ${{ secrets.DOCKERHUB_USERNAME }}/notesynth:${{ steps.version.outputs.VERSION }}
```

### Required GitHub Secrets

Add these in your repo → Settings → Secrets → Actions:

- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token (create at https://hub.docker.com/settings/security)

---

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs notesynth-app

# Common issue: Missing GEMINI_API_KEY
# Solution: Pass -e GEMINI_API_KEY=your_key
```

### Port already in use

```bash
# Use a different port
docker run -p 3001:3000 -e GEMINI_API_KEY=your_key notesynth
```

### Image size too large

The multi-stage Dockerfile keeps the image small (~200MB). If it's larger:
- Ensure `.dockerignore` exists and includes `node_modules`
- Verify `output: "standalone"` is in `next.config.ts`

---

## Image Details

- **Base Image**: `node:20-alpine`
- **Build Type**: Multi-stage (builder + runner)
- **User**: Non-root `nextjs` user
- **Exposed Port**: 3000

---

## Release Checklist

When releasing a new version:

1. **Update version** in `package.json`
   ```json
   "version": "1.2.0"
   ```

2. **Commit the change**
   ```bash
   git add package.json
   git commit -m "Bump version to 1.2.0"
   ```

3. **Create a git tag**
   ```bash
   git tag v1.2.0
   git push origin main --tags
   ```

4. **Build and push Docker image**
   ```bash
   cd scripts
   ./docker-build.sh --push YOUR_USERNAME
   ```

5. **Verify on Docker Hub**
   - Check https://hub.docker.com/r/YOUR_USERNAME/notesynth/tags
   - Both `latest` and `1.2.0` should appear

