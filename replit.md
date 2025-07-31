# ShedBuilder Pro

## Overview

ShedBuilder Pro is a full-stack web application for designing and pricing custom sheds. It features blueprint-style architectural visualizations with detailed material calculations, cost estimates, and local store availability. The application helps users design sheds with different configurations and generates comprehensive material lists for construction.

## Recent Changes (January 2025)

- Removed isometric 3D view in favor of blueprint-only visualizations (4 architectural views: Plan, Front Elevation, Side Elevation, Cross Section)
- Implemented full navigation system with Templates and Designer pages (Materials tab removed per user preference)
- Removed Help tab and all help content per user preference for cleaner interface
- Fixed navigation routing and component interface issues
- Enhanced blueprint visualizations with construction details (studs, joists, dimensions)
- Expanded roof options to 6 types: gable, gambrel, hip, shed, lean-to, and saltbox roofs
- Updated blueprint visualizations to properly render all new roof types with construction details
- Updated templates with the new roof styles showcasing diverse architectural options
- Implemented comprehensive 3-page printing system with professional styling and detailed cut lists
- Added store selection feature allowing users to choose between Home Depot, Lowe's, and Menards for pricing and ordering
- Enhanced print output to include actual blueprint drawings and store-specific information
- **Shopping List Revolution**: Completely integrated shopping list into main designer page with automatic updates, removed separate Materials tab, embedded price comparison tools with store filtering table, and eliminated all manual "Generate" buttons for seamless user experience
- **Template Integration (Latest)**: Moved templates section from separate navigation tab to be positioned under blueprints section in main designer page, consolidating all functionality into single interface and removing redundant Templates tab from navigation

## User Preferences

Preferred communication style: Simple, everyday language.
Interface preference: Clean, focused interface without help content or construction guides.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for development and building
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **UI Components**: Radix UI primitives wrapped in custom components following Material Design principles
- **State Management**: React Query for server state management and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **3D Visualization**: Three.js for interactive 3D shed visualization with orbit controls
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Data Storage**: In-memory storage with interface for future database integration
- **API Design**: RESTful API endpoints for shed designs, materials, and pricing data
- **Database ORM**: Drizzle ORM configured for PostgreSQL (ready for database integration)
- **Session Management**: Express sessions with PostgreSQL store configuration

### Development Environment
- **Build Tool**: Vite with hot module replacement for development
- **Package Manager**: npm with lockfile version 3
- **TypeScript**: Strict mode enabled with path mapping for clean imports
- **Development Server**: Express server with Vite middleware integration

## Key Components

### Blueprint Shed Designer
- Blueprint-style architectural visualizations showing 4 views (Plan, Front Elevation, Side Elevation, Cross Section)
- Real-time updates based on configuration changes
- Support for 6 different roof types (gable, gambrel, hip, shed, lean-to, saltbox)
- Construction details including wall studs, floor joists, and dimensional annotations
- Professional architectural drawing style for construction planning

### Configuration System
- Tabbed interface for different shed aspects (foundation, walls, roofing, openings)
- Real-time calculation of materials and costs
- Support for various foundation types and lumber grades
- Customizable dimensions, door/window counts, and siding options

### Material Calculator
- Automatic material list generation based on shed configuration
- Detailed quantity calculations for lumber, hardware, roofing, and siding
- Price estimation with local store availability
- Export capabilities for shopping lists

### Store Integration Framework
- API structure for fetching local pricing data
- Store availability tracking (Home Depot, Lowe's, Menards)
- Distance calculation and inventory status
- Price comparison across different retailers

## Data Flow

### Design Configuration Flow
1. User modifies shed parameters through configuration tabs
2. React state updates trigger recalculation of materials
3. 3D viewer updates geometry based on new dimensions
4. Cost summary recalculates with new material requirements
5. Store availability updates with current pricing data

### Material Calculation Flow
1. Configuration changes trigger material recalculation
2. Calculation functions determine lumber requirements, hardware needs, and quantities
3. Pricing data fetched based on user's zip code
4. Results displayed in categorized format with totals
5. Shopping list generated with retailer-specific information

### Data Persistence Flow
- Shed designs stored with full configuration details
- Template system for common shed configurations
- User locations stored for pricing optimization
- Material items linked to specific shed designs
- Pricing data cached with timestamp for freshness

## External Dependencies

### Core Framework Dependencies
- React 18 ecosystem (React Query, React Hook Form, React DOM)
- Express.js with TypeScript support
- Vite build system with React plugin
- Three.js for 3D graphics rendering

### UI and Styling
- Tailwind CSS for utility-first styling
- Radix UI primitives for accessible components
- Lucide React for consistent iconography
- Class Variance Authority for component variants

### Database and Validation
- Drizzle ORM for type-safe database operations
- Zod for runtime validation and type inference
- PostgreSQL driver (@neondatabase/serverless)
- Connect-pg-simple for session storage

### Development Tools
- TypeScript for type safety
- ESBuild for production bundling
- PostCSS with Autoprefixer
- Replit-specific development plugins

## Deployment Strategy

### Development Mode
- Vite development server with hot module replacement
- Express server running on Node.js with tsx for TypeScript execution
- Database schema managed through Drizzle migrations
- Environment variables for database connection and API keys

### Production Build
- Vite builds optimized React bundle to `dist/public`
- ESBuild bundles server code to `dist/index.js` with external packages
- Static file serving through Express in production
- Database connections through environment variable configuration

### Database Strategy
- Drizzle ORM configured for PostgreSQL with migration support
- Schema defined in shared directory for frontend/backend consistency
- In-memory storage interface allows for easy database integration
- Session storage configured for PostgreSQL but can fallback to memory

### Environment Configuration
- Development and production environment detection
- Database URL required for production deployment
- Replit-specific configurations for development environment
- Build scripts optimized for both local development and cloud deployment