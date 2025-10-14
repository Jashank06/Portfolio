#!/bin/bash

echo "🔍 Verifying Portfolio Setup..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js installed:${NC} $NODE_VERSION"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✅ npm installed:${NC} $NPM_VERSION"
else
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi

echo ""

# Check client dependencies
if [ -d "client/node_modules" ]; then
    echo -e "${GREEN}✅ Client dependencies installed${NC}"
else
    echo -e "${RED}❌ Client dependencies missing${NC}"
    echo -e "${BLUE}   Run: cd client && npm install${NC}"
fi

# Check server dependencies
if [ -d "server/node_modules" ]; then
    echo -e "${GREEN}✅ Server dependencies installed${NC}"
else
    echo -e "${RED}❌ Server dependencies missing${NC}"
    echo -e "${BLUE}   Run: cd server && npm install${NC}"
fi

echo ""

# Check important files
FILES=(
    "client/src/App.js"
    "client/src/components/Navbar.jsx"
    "client/src/components/Hero.jsx"
    "client/src/components/About.jsx"
    "client/src/components/Skills.jsx"
    "client/src/components/Projects.jsx"
    "client/src/components/Contact.jsx"
    "client/src/components/Footer.jsx"
    "client/tailwind.config.js"
    "client/postcss.config.js"
    "server/server.js"
    "server/.env"
)

MISSING=0
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
    else
        echo -e "${RED}❌${NC} $file ${RED}(missing)${NC}"
        MISSING=$((MISSING + 1))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}🎉 All files present! Setup is complete!${NC}"
    echo ""
    echo -e "${BLUE}To start the project:${NC}"
    echo "  ./start.sh"
    echo ""
    echo -e "${BLUE}Or manually:${NC}"
    echo "  Terminal 1: cd client && npm start"
    echo "  Terminal 2: cd server && npm run dev"
else
    echo -e "${RED}⚠️  $MISSING file(s) missing${NC}"
    echo "Please check the setup"
fi

echo ""
