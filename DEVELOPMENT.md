# CodeCanvas Development Guide

## Quick Start

### Prerequisites
- Node.js 18+ 
- PHP 8.2+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd CodeCanvas

# Install dependencies
npm install

# Start development servers
npm run dev    # Frontend (port 3000)
npm run backend # Backend (port 8000)
```

### Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Development Commands

### Frontend
```bash
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run preview     # Preview production build
npm run test        # Run Jest tests
```

### Backend
```bash
npm run backend     # Start PHP dev server
php -S localhost:8000 -t public/  # Alternative backend start
```

## Project Structure

```
CodeCanvas/
├── src/
│   ├── frontend/           # React application
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── main.jsx        # App entry point
│   │   └── index.css       # Global styles
│   ├── backend/            # PHP backend
│   │   ├── index.php       # API router
│   │   ├── CodeGenerator.php
│   │   ├── ShapeRecognizer.php
│   │   └── FlowchartAnalyzer.php
│   ├── docs/               # Documentation
│   └── tests/              # Test files
├── public/                 # Static assets
├── package.json
├── vite.config.js
└── README.md
```

## Development Workflow

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Write tests first (TDD approach)
3. Implement feature
4. Update documentation
5. Create pull request

### Testing
```bash
# Frontend tests
npm test

# Backend tests (requires PHPUnit)
./vendor/bin/phpunit src/tests/

# Run all tests
npm run test:all
```

### Code Quality
```bash
# Format code
npm run format

# Lint code
npm run lint

# Type checking
npm run type-check
```

## API Endpoints

### POST /generate-code
Generate code from flowchart shapes.

**Request:**
```json
{
  "shapes": [
    {
      "id": "shape1",
      "type": "process",
      "text": "Calculate sum",
      "x": 100,
      "y": 100
    }
  ],
  "connections": [
    {
      "id": "conn1",
      "fromId": "shape1",
      "toId": "shape2"
    }
  ],
  "language": "javascript"
}
```

**Response:**
```json
{
  "code": "// Generated code",
  "language": "javascript",
  "timestamp": "2023-12-07T10:30:00Z"
}
```

### POST /recognize-shapes
Recognize shapes from SVG data.

**Request:**
```json
{
  "svgData": "<svg>...</svg>"
}
```

**Response:**
```json
{
  "shapes": [
    {
      "type": "process",
      "x": 100,
      "y": 100,
      "width": 120,
      "height": 80,
      "confidence": 0.95
    }
  ]
}
```

### POST /analyze-flowchart
Analyze flowchart structure and validation.

**Request:**
```json
{
  "shapes": [...],
  "connections": [...]
}
```

**Response:**
```json
{
  "isValid": true,
  "errors": [],
  "warnings": [],
  "suggestions": [],
  "metrics": {
    "totalShapes": 5,
    "totalConnections": 4,
    "complexity": 2,
    "depth": 3
  }
}
```

## Component Architecture

### Key Components

#### Canvas
- Main drawing surface
- Handles shape creation and manipulation
- Manages Konva.js stage and layers

#### ShapePalette
- Displays available shape types
- Handles shape selection

#### CodePanel
- Shows generated code
- Provides Monaco Editor integration
- Handles code export

#### Toolbar
- Main application controls
- Tool selection (select, draw, connect)
- Action buttons (clear, generate)

### State Management

#### ShapeContext
- Manages flowchart shapes
- Handles shape CRUD operations
- Tracks selections

#### CodeContext
- Manages generated code
- Handles code generation API calls
- Provides code export functionality

## Styling Guidelines

### CSS Variables
```css
--primary-color: #007acc;
--secondary-color: #1e1e1e;
--accent-color: #4fc3f7;
--background-dark: #0d1117;
--text-primary: #f0f6fc;
```

### Component Styles
- Use CSS modules for component-specific styles
- Follow BEM naming convention
- Maintain consistent spacing (8px grid)

## Debugging

### Frontend Debugging
```bash
# Enable React DevTools
npm install -g react-devtools

# Enable Redux DevTools (if using Redux)
# Install browser extension
```

### Backend Debugging
```php
// Enable PHP error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Add debug logging
error_log("Debug message");
```

### Common Issues

#### CORS Errors
Ensure backend CORS headers are properly configured:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

#### Canvas Performance
- Limit number of shapes rendered
- Use shape virtualization for large flowcharts
- Throttle mouse events during drawing

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Lazy load Monaco Editor
- Bundle splitting with dynamic imports

### Backend
- Implement response caching
- Use output buffering for large responses
- Optimize database queries (when DB is added)
- Add compression for API responses

## Deployment

### Development
```bash
# Start both servers
npm run dev &
npm run backend &
```

### Production
```bash
# Build frontend
npm run build

# Deploy to Apache/Nginx
# Configure .htaccess for API routing
# Set up HTTPS
```

### Docker (Optional)
```dockerfile
FROM php:8.2-apache
COPY . /var/www/html
RUN npm install && npm run build
```

## Contributing

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Write descriptive commit messages
- Add JSDoc comments for functions

### Pull Request Process
1. Create feature branch
2. Write tests
3. Ensure all tests pass
4. Update documentation
5. Submit PR with detailed description

### Issue Reporting
- Use GitHub issue templates
- Include reproduction steps
- Provide browser/PHP version info
- Add relevant screenshots

## Troubleshooting

### Common Problems

#### Port Already in Use
```bash
# Kill processes using ports
lsof -ti:3000 | xargs kill
lsof -ti:8000 | xargs kill
```

#### Permission Errors
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

#### PHP Extensions Missing
```bash
# Install required extensions
sudo apt-get install php-xml php-mbstring
```

### Getting Help
- Check GitHub issues
- Read documentation
- Ask in discussions
- Contact maintainers

## Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [Konva.js Documentation](https://konvajs.org/docs/)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/docs.html)
- [PHP Documentation](https://www.php.net/docs.php)

### Tools
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Vite DevTools](https://github.com/webfansplz/vite-plugin-vue-devtools)
- [PHP Debug](https://xdebug.org/)

### Community
- [GitHub Repository](https://github.com/your-username/codecanvas)
- [Discord Server](https://discord.gg/codecanvas)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/codecanvas)