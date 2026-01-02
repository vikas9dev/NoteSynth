#!/bin/bash
#
# Build and optionally push NoteSynth Docker image with versioning.
#
# Usage:
#   ./docker-build.sh                    # Build only
#   ./docker-build.sh --push USERNAME    # Build and push to Docker Hub
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Parse arguments
PUSH=false
REGISTRY=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --push)
            PUSH=true
            REGISTRY="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Get script directory and move to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")

echo -e "${CYAN}📦 NoteSynth Docker Build${NC}"
echo -e "${CYAN}=========================${NC}"
echo -e "${GREEN}Version: $VERSION${NC}"

# Set image name
if [ -n "$REGISTRY" ]; then
    IMAGE_NAME="$REGISTRY/notesynth"
else
    IMAGE_NAME="notesynth"
fi

# Build the image
echo -e "\n${YELLOW}🔨 Building Docker image...${NC}"

docker build \
    --build-arg VERSION="$VERSION" \
    -t "${IMAGE_NAME}:latest" \
    -t "${IMAGE_NAME}:${VERSION}" \
    .

echo -e "\n${GREEN}✅ Build successful!${NC}"
echo -e "   Tagged: ${IMAGE_NAME}:latest"
echo -e "   Tagged: ${IMAGE_NAME}:${VERSION}"

# Push if requested
if [ "$PUSH" = true ]; then
    if [ -z "$REGISTRY" ]; then
        echo -e "${RED}Error: Registry username required for push${NC}"
        echo "Usage: ./docker-build.sh --push USERNAME"
        exit 1
    fi

    echo -e "\n${YELLOW}🚀 Pushing to Docker Hub...${NC}"
    
    docker push "${IMAGE_NAME}:latest"
    docker push "${IMAGE_NAME}:${VERSION}"

    echo -e "\n${GREEN}✅ Push successful!${NC}"
    echo -e "${CYAN}   https://hub.docker.com/r/${IMAGE_NAME}${NC}"
fi

# Show usage
echo -e "\n${YELLOW}📋 To run the container:${NC}"
echo -e "   docker run -p 3000:3000 -e GEMINI_API_KEY=your_key ${IMAGE_NAME}:${VERSION}"

