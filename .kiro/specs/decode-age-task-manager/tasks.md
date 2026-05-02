# Implementation Plan: Decode Age Task Manager

## Overview

This implementation plan breaks down the Decode Age Task Manager into discrete coding tasks. The system uses TypeScript with React for the frontend, Node.js with Express for the backend, PostgreSQL for data persistence, and WebSocket for real-time updates. Tasks are organized to build incrementally, with testing integrated throughout to validate functionality early.

## Tasks

- [ ] 1. Project setup and configuration
  - [x] 1.1 Initialize monorepo structure with frontend and backend workspaces
    - Create root package.json with workspace configuration
    - Set up TypeScript configuration for both frontend and backend
    - Configure ESLint and Prettier for code quality
    - Create .gitignore and .env.example files
    - _Requirements: 12.1, 12.2_
  
  - [x] 1.2 Set up PostgreSQL database and migration system
    - Install and configure node-pg-migrate for database migrations
    - Create initial migration for users table with indexes
    - Create migration for tasks table with foreign keys and indexes
    - Create migration for sessions table
    - Write database connection module with connection pooling
    - _Requirements: 12.1, 12.2, 12.3_
  
  - [ ]* 1.3 Write property test for database connection resilience
    - **Property 33: Data Survives System Restart**
    - **Validates: Requirements 12.3**
  
  - [-] 1.4 Configure Microsoft Entra ID application registration
    - Document steps for creating Entra ID app registration (free tier)
    - Configure OAuth 2.0 redirect URIs for local development
    - Set up environment variables for client ID, tenant ID, and client secret
    - Create configuration module for Entra ID settings
    - _Requirements: 1.1, 1.4_

- [ ] 2. Backend authentication implementation
  - [ ] 2.1 Implement AuthService for Microsoft Entra ID integration
    - Create AuthService class with OAuth 2.0 authorization code flow
    - Implement getAuthUrl method to generate Entra ID login URL
    - Implement exchangeCodeForToken method for token exchange
    - Implement validateToken method for token verification
    - Implement refreshAccessToken method for token refresh
    - _Requirements: 1.1, 1.2, 1.5_
  
  - [ ]* 2.2 Write property test for successful authentication
    - **Property 1: Successful Authentication Retrieves User Role**
    - **Validates: Requirements 1.2, 11.3**
  
  - [ ]* 2.3 Write property test for failed authentication
    - **Property 2: Failed Authentication Denies Access**
    - **Validates: Requirements 1.3**
  
  - [ ] 2.4 Implement authentication middleware
    - Create authMiddleware to verify JWT tokens
    - Implement extractUser middleware to attach user info to requests
    - Add error handling for invalid/expired tokens
    - _Requirements: 1.3, 1.5_
  
  - [ ]* 2.5 Write property test for session expiration
    - **Property 3: Expired Sessions Redirect to Login**
    - **Validates: Requirements 1.5**
  
  - [ ] 2.6 Implement authentication API endpoints
    - Create GET /api/auth/login endpoint returning Entra ID auth URL
    - Create GET /api/auth/callback endpoint for OAuth callback handling
    - Create POST /api/auth/refresh endpoint for token refresh
    - Create POST /api/auth/logout endpoint for session invalidation
    - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [ ] 3. Backend user management implementation
  - [ ] 3.1 Implement UserService for user operations
    - Create UserService class with database operations
    - Implement createUser method with role assignment
    - Implement deleteUser method with cascade handling
    - Implement getUserById and getAllUsers methods
    - Implement isLastAdmin method to prevent last admin removal
    - _Requirements: 7.1, 7.2, 7.3, 7.5_
  
  - [ ]* 3.2 Write property test for employee addition
    - **Property 21: Employee Addition Persists with Role**
    - **Validates: Requirements 7.1, 12.2**
  
  - [ ]* 3.3 Write property test for employee removal
    - **Property 22: Employee Removal Deletes from Store**
    - **Validates: Requirements 7.2**
  
  - [ ]* 3.4 Write property test for last admin protection
    - **Property 24: Last Admin Cannot Be Removed**
    - **Validates: Requirements 7.5**
  
  - [ ] 3.5 Implement RBAC middleware
    - Create rbacMiddleware with requireAdmin guard
    - Create requireAuth guard for authenticated routes
    - Implement logUnauthorized for security logging
    - _Requirements: 11.1, 11.2, 11.5_
  
  - [ ]* 3.6 Write property test for role-based access control
    - **Property 29: Employees Cannot Access Admin Features**
    - **Property 30: Admins Have Access to All Features**
    - **Validates: Requirements 11.1, 11.2**
  
  - [ ] 3.7 Implement user management API endpoints
    - Create GET /api/users endpoint (admin only) returning all users
    - Create POST /api/users endpoint (admin only) for adding employees
    - Create DELETE /api/users/:id endpoint (admin only) with last admin check
    - Create GET /api/users/me endpoint for current user info
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [ ] 4. Backend task management implementation
  - [ ] 4.1 Implement validation middleware for tasks
    - Create validateTaskCreation middleware checking description length (1-500 chars)
    - Implement deadline validation ensuring future dates
    - Create validateTaskUpdate middleware for update operations
    - Add error response formatting for validation failures
    - _Requirements: 2.2, 2.3, 2.5_
  
  - [ ]* 4.2 Write property test for task description validation
    - **Property 5: Task Description Length Validation**
    - **Validates: Requirements 2.2**
  
  - [ ]* 4.3 Write property test for deadline validation
    - **Property 6: Deadline Must Be Future Date**
    - **Validates: Requirements 2.3**
  
  - [ ] 4.4 Implement TaskService for task operations
    - Create TaskService class with database operations
    - Implement createTask method with validation and persistence
    - Implement updateTask method for task modifications
    - Implement deleteTask method
    - Implement getTasksForUser method with role-based filtering
    - Implement assignTask method for task assignment
    - Implement toggleCompletion method with timestamp handling
    - Implement unassignTasksForEmployee method for cascade operations
    - _Requirements: 2.1, 3.1, 3.4, 3.5, 4.1, 5.1, 5.2, 5.5, 6.1, 7.4_
  
  - [ ]* 4.5 Write property test for task creation
    - **Property 4: Task Creation Persists with Correct Fields**
    - **Validates: Requirements 2.1, 12.1**
  
  - [ ]* 4.6 Write property test for task assignment
    - **Property 9: Task Assignment Updates Store**
    - **Property 10: Task Reassignment Allowed**
    - **Validates: Requirements 3.1, 3.4**
  
  - [ ]* 4.7 Write property test for employee removal unassigns tasks
    - **Property 11: Employee Removal Unassigns Tasks**
    - **Validates: Requirements 3.5, 7.4**
  
  - [ ]* 4.8 Write property test for task completion
    - **Property 16: Task Completion Updates Status and Timestamp**
    - **Property 17: Marking Incomplete Removes Timestamp**
    - **Validates: Requirements 5.1, 5.2, 5.4, 5.5**
  
  - [ ] 4.9 Implement task API endpoints
    - Create GET /api/tasks endpoint with role-based filtering
    - Create POST /api/tasks endpoint (admin only) with validation
    - Create PUT /api/tasks/:id endpoint (admin only) for updates
    - Create DELETE /api/tasks/:id endpoint (admin only)
    - Create PATCH /api/tasks/:id/complete endpoint for status toggle
    - Create PATCH /api/tasks/:id/assign endpoint (admin only) for assignment
    - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.4, 4.1, 5.1, 6.1_

- [ ] 5. Checkpoint - Ensure backend API tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Backend real-time WebSocket implementation
  - [ ] 6.1 Implement WebSocketService for real-time updates
    - Set up WebSocket server with ws library
    - Implement handleConnection method with user authentication
    - Implement handleDisconnection method with cleanup
    - Create broadcastToAdmins method for admin-only broadcasts
    - Create sendToUser method for targeted user messages
    - Create broadcastToAll method for system-wide updates
    - Maintain connection map for user ID to socket mapping
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [ ] 6.2 Integrate WebSocket with task operations
    - Add WebSocket broadcast to task creation endpoint
    - Add WebSocket broadcast to task assignment endpoint
    - Add WebSocket broadcast to task completion endpoint
    - Add WebSocket broadcast to task update/delete endpoints
    - Ensure updates sent within 2 seconds of operation
    - _Requirements: 3.3, 4.5, 5.3, 6.5, 10.1, 10.2, 10.3_
  
  - [ ]* 6.3 Write property test for real-time update propagation
    - **Property 15: Real-Time Task Updates Propagate**
    - **Validates: Requirements 3.3, 4.5, 5.3, 6.5, 10.1, 10.2, 10.3**
  
  - [ ] 6.4 Implement WebSocket error handling and reconnection
    - Add connection health checks with ping/pong
    - Implement automatic reconnection logic with exponential backoff
    - Add message acknowledgment system
    - Implement message retry logic (up to 3 attempts)
    - Log connection failures and undeliverable messages
    - _Requirements: 10.4, 10.5_

- [ ] 7. Frontend authentication implementation
  - [ ] 7.1 Create AuthContext and authentication state management
    - Create AuthContext with user, role, and authentication state
    - Implement login method initiating OAuth flow
    - Implement logout method clearing tokens and state
    - Implement refreshToken method for automatic token refresh
    - Add token storage in localStorage with secure practices
    - _Requirements: 1.1, 1.2, 1.5_
  
  - [ ] 7.2 Implement LoginPage component
    - Create LoginPage with Decode Age branding
    - Add login button triggering OAuth flow
    - Implement OAuth callback handling
    - Add error display for authentication failures
    - Implement redirect to dashboard on success
    - _Requirements: 1.1, 1.3, 8.1, 8.2, 8.3_
  
  - [ ] 7.3 Implement ProtectedRoute component
    - Create ProtectedRoute wrapper for authenticated routes
    - Add authentication check redirecting to login if needed
    - Implement role-based access control for admin routes
    - Add loading state during authentication check
    - _Requirements: 1.1, 11.1, 11.2_
  
  - [ ]* 7.4 Write unit tests for authentication components
    - Test LoginPage renders correctly
    - Test ProtectedRoute redirects unauthenticated users
    - Test AuthContext provides correct state
    - _Requirements: 1.1, 1.3_

- [ ] 8. Frontend WebSocket implementation
  - [ ] 8.1 Create WebSocketProvider and context
    - Create WebSocketContext with connection state
    - Implement WebSocket connection with authentication
    - Add subscribe/unsubscribe methods for event handling
    - Add emit method for sending messages
    - Implement automatic reconnection with exponential backoff
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [ ] 8.2 Implement ConnectionIndicator component
    - Create visual indicator for connection status
    - Display reconnection attempts and countdown
    - Show alert on connection loss
    - Add styling consistent with Decode Age branding
    - _Requirements: 10.5, 8.1, 8.3_
  
  - [ ]* 8.3 Write unit tests for WebSocket components
    - Test WebSocketProvider establishes connection
    - Test ConnectionIndicator displays correct status
    - Test reconnection logic triggers on disconnect
    - _Requirements: 10.4, 10.5_

- [ ] 9. Frontend task display components
  - [ ] 9.1 Implement TaskCard component
    - Create TaskCard displaying description, deadline, and status
    - Add completion toggle button for employees
    - Add edit/delete buttons for admins (conditional rendering)
    - Implement responsive design for mobile/tablet/desktop
    - Apply Decode Age branding and styling
    - Ensure touch targets are 44x44px minimum on mobile
    - _Requirements: 4.2, 5.1, 6.4, 8.1, 8.3, 8.4, 9.1, 9.2, 9.3, 9.5_
  
  - [ ] 9.2 Implement TaskList component
    - Create TaskList rendering array of TaskCard components
    - Implement task sorting by deadline (nearest first)
    - Add empty state message when no tasks available
    - Integrate real-time updates via WebSocket
    - Apply responsive grid/list layout
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 9.1, 9.2, 9.3_
  
  - [ ]* 9.3 Write property test for task sorting
    - **Property 14: Tasks Sorted By Deadline**
    - **Validates: Requirements 4.3**
  
  - [ ]* 9.4 Write unit tests for task display components
    - Test TaskCard renders all required fields
    - Test TaskList displays empty state correctly
    - Test TaskList sorts tasks by deadline
    - Test completion toggle works for employees
    - _Requirements: 4.2, 4.3, 4.4_

- [ ] 10. Frontend task management components
  - [ ] 10.1 Implement TaskCreationForm component (admin only)
    - Create form with description textarea (1-500 char validation)
    - Add date picker for deadline with future date validation
    - Add employee selector dropdown populated from API
    - Implement client-side validation with error display
    - Add submit handler calling task creation API
    - Display success confirmation on creation
    - Apply Decode Age branding and styling
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.2, 8.1, 8.3_
  
  - [ ]* 10.2 Write property test for form validation
    - **Property 5: Task Description Length Validation**
    - **Property 6: Deadline Must Be Future Date**
    - **Validates: Requirements 2.2, 2.3**
  
  - [ ] 10.3 Implement TaskFilterPanel component (admin only)
    - Create filter controls for employee selection
    - Add filter controls for status (complete/incomplete)
    - Add filter controls for deadline range
    - Implement clear filters button
    - Apply filters to task list in real-time
    - _Requirements: 6.3, 8.1, 8.3_
  
  - [ ]* 10.4 Write property test for task filtering
    - **Property 20: Task Filtering Works Correctly**
    - **Validates: Requirements 6.3**
  
  - [ ]* 10.5 Write unit tests for task management components
    - Test TaskCreationForm validates input correctly
    - Test TaskCreationForm displays success message
    - Test TaskFilterPanel filters tasks correctly
    - _Requirements: 2.2, 2.3, 2.4, 6.3_

- [ ] 11. Frontend dashboard implementation
  - [ ] 11.1 Implement EmployeeDashboard component
    - Create dashboard layout with Decode Age branding
    - Integrate TaskList showing only assigned tasks
    - Add real-time updates via WebSocket subscription
    - Display user info and logout button
    - Implement responsive layout for all screen sizes
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 8.1, 8.2, 8.3, 9.1, 9.2, 9.3_
  
  - [ ]* 11.2 Write property test for employee task filtering
    - **Property 12: Employees See Only Their Tasks**
    - **Validates: Requirements 4.1**
  
  - [ ] 11.3 Implement AdminDashboard component
    - Create dashboard layout with Decode Age branding
    - Integrate TaskList showing all tasks with assignee info
    - Add TaskCreationForm for creating new tasks
    - Add TaskFilterPanel for filtering tasks
    - Display completion percentage calculation
    - Add real-time updates via WebSocket subscription
    - Display user info and logout button
    - Implement responsive layout for all screen sizes
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 8.1, 8.2, 8.3, 9.1, 9.2, 9.3_
  
  - [ ]* 11.4 Write property test for completion percentage
    - **Property 19: Completion Percentage Calculation**
    - **Validates: Requirements 6.2**
  
  - [ ]* 11.5 Write property test for admin visibility
    - **Property 18: Admins See All Tasks**
    - **Validates: Requirements 6.1**
  
  - [ ]* 11.6 Write unit tests for dashboard components
    - Test EmployeeDashboard displays only assigned tasks
    - Test AdminDashboard displays all tasks
    - Test completion percentage displays correctly
    - Test real-time updates reflect in dashboard
    - _Requirements: 4.1, 6.1, 6.2, 6.5_

- [ ] 12. Checkpoint - Ensure frontend component tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Frontend user management implementation
  - [ ] 13.1 Implement UserManagementPanel component (admin only)
    - Create panel displaying list of all employees with emails
    - Add form for adding new employees with email input
    - Add remove button for each employee with confirmation dialog
    - Implement last admin protection preventing removal
    - Display error messages for failed operations
    - Apply Decode Age branding and styling
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.3_
  
  - [ ]* 13.2 Write property test for employee list display
    - **Property 23: Employee List Displays All with Emails**
    - **Validates: Requirements 7.3**
  
  - [ ]* 13.3 Write unit tests for user management
    - Test UserManagementPanel displays all employees
    - Test add employee form works correctly
    - Test remove employee button shows confirmation
    - Test last admin cannot be removed
    - _Requirements: 7.1, 7.2, 7.3, 7.5_
  
  - [ ] 13.2 Integrate UserManagementPanel into AdminDashboard
    - Add user management tab or section to AdminDashboard
    - Ensure proper routing and navigation
    - Apply consistent styling and layout
    - _Requirements: 7.1, 7.2, 7.3_

- [ ] 14. Decode Age branding and styling implementation
  - [ ] 14.1 Extract and implement Decode Age color scheme
    - Analyze image.png for primary brand colors
    - Create CSS variables or theme configuration with color palette
    - Apply colors consistently across all components
    - Ensure WCAG AA color contrast compliance
    - _Requirements: 8.1, 8.4_
  
  - [ ] 14.2 Implement logo and typography
    - Integrate Decode Age logo from image.png in header
    - Research and implement typography matching Decode Age website
    - Create typography scale for headings and body text
    - Apply consistent font usage across application
    - _Requirements: 8.2, 8.3_
  
  - [ ] 14.3 Implement responsive design system
    - Create breakpoint system (mobile <768px, tablet 768-1024px, desktop >1024px)
    - Implement responsive layouts for all components
    - Ensure touch targets meet 44x44px minimum on mobile
    - Test layouts at all breakpoints
    - Maintain readability and usability across screen sizes
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 14.4 Write property test for responsive layout
    - **Property 25: Responsive Layout Adapts to Screen Width**
    - **Validates: Requirements 9.1, 9.2, 9.3**
  
  - [ ]* 14.5 Write property test for touch target sizes
    - **Property 26: Touch Targets Meet Minimum Size on Mobile**
    - **Validates: Requirements 9.5**
  
  - [ ]* 14.6 Write unit tests for branding
    - Test logo displays correctly
    - Test color scheme applied consistently
    - Test typography matches design
    - _Requirements: 8.1, 8.2, 8.3_

- [ ] 15. Error handling and edge cases
  - [ ] 15.1 Implement comprehensive error handling in backend
    - Add retry logic with exponential backoff for Entra ID calls
    - Implement transaction rollback for database operations
    - Add detailed error logging for debugging
    - Return user-friendly error messages in API responses
    - Implement rate limiting (100 req/min, 1000 req/hour per user)
    - _Requirements: 2.5, 12.4, 12.5_
  
  - [ ]* 15.2 Write property test for database error handling
    - **Property 35: Database Failures Display Errors and Maintain Integrity**
    - **Validates: Requirements 12.5**
  
  - [ ]* 15.3 Write property test for concurrent updates
    - **Property 34: Concurrent Updates Maintain Consistency**
    - **Validates: Requirements 12.4**
  
  - [ ] 15.4 Implement error handling in frontend
    - Add error boundaries for React components
    - Display user-friendly error messages for API failures
    - Implement retry logic for failed API calls
    - Add loading states for async operations
    - Handle network errors gracefully
    - _Requirements: 1.3, 2.5_
  
  - [ ]* 15.5 Write unit tests for error handling
    - Test API error responses display correctly
    - Test retry logic works for failed requests
    - Test error boundaries catch component errors
    - _Requirements: 1.3, 2.5_

- [ ] 16. Security and logging implementation
  - [ ] 16.1 Implement security measures
    - Add input sanitization to prevent XSS attacks
    - Implement CSRF protection for state-changing operations
    - Add SQL injection prevention via parameterized queries
    - Implement secure token storage practices
    - Add security headers (CORS, CSP, etc.)
    - _Requirements: 11.5_
  
  - [ ] 16.2 Implement logging and monitoring
    - Add structured logging for all API requests
    - Log unauthorized access attempts with details
    - Log authentication failures and security events
    - Log database operation failures
    - Create log rotation and retention policy
    - _Requirements: 11.5_
  
  - [ ]* 16.3 Write property test for unauthorized access logging
    - **Property 32: Unauthorized Access Attempts Are Logged**
    - **Validates: Requirements 11.5**
  
  - [ ]* 16.4 Write unit tests for security measures
    - Test input sanitization prevents XSS
    - Test CSRF protection works correctly
    - Test unauthorized access is logged
    - _Requirements: 11.5_

- [ ] 17. Integration and end-to-end wiring
  - [ ] 17.1 Wire frontend and backend together
    - Configure API base URL and environment variables
    - Set up CORS configuration for frontend-backend communication
    - Test authentication flow end-to-end
    - Test task CRUD operations end-to-end
    - Test user management operations end-to-end
    - Test real-time updates across multiple browser instances
    - _Requirements: All requirements_
  
  - [ ] 17.2 Implement application routing
    - Set up React Router with protected routes
    - Configure route guards based on authentication and role
    - Implement navigation between dashboard sections
    - Add 404 page for invalid routes
    - _Requirements: 1.1, 11.1, 11.2_
  
  - [ ]* 17.3 Write integration tests for complete workflows
    - Test admin creates task and assigns to employee
    - Test employee views and completes assigned task
    - Test real-time updates propagate correctly
    - Test admin manages users successfully
    - _Requirements: All requirements_

- [ ] 18. Deployment preparation
  - [ ] 18.1 Create production build configuration
    - Configure production environment variables
    - Set up build scripts for frontend and backend
    - Optimize frontend bundle size
    - Configure production database connection
    - Set up production Entra ID configuration
    - _Requirements: 12.1, 12.2, 12.3_
  
  - [ ] 18.2 Create deployment documentation
    - Document environment variable requirements
    - Document database setup and migration steps
    - Document Entra ID configuration steps
    - Create deployment checklist
    - Document monitoring and logging setup
    - _Requirements: All requirements_
  
  - [ ] 18.3 Create Docker configuration (optional)
    - Create Dockerfile for backend service
    - Create Dockerfile for frontend service
    - Create docker-compose.yml for local development
    - Document Docker deployment process
    - _Requirements: 12.1, 12.2, 12.3_

- [ ] 19. Final checkpoint - Ensure all tests pass and system is ready
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples, edge cases, and component behavior
- The implementation uses TypeScript throughout for type safety
- Real-time updates are critical and integrated throughout the task flow
- Decode Age branding should be consistently applied across all UI components
- Security and error handling are integrated throughout rather than as afterthoughts
