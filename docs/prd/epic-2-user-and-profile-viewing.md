# Epic 2: User and Profile Viewing

**Epic Goal**: This epic builds on the foundation of Epic 1 by allowing a developer to select one of their projects and view the associated users and profiles. This provides crucial, read-only insights for community management, user support, and understanding player data. It transforms the dashboard from a simple project lister into a valuable monitoring tool.

## Story 2.1: Project Navigation
**As a** user, **I want** to click on a project from my project list and be taken to a dedicated project detail page, **so that** I can access management features for that specific project.

**Acceptance Criteria:**
1.  Each project in the list (from Story 1.3) is a clickable link.
2.  Clicking a project link navigates the user to a new view/page (e.g., `/project/{projectAddress}`).
3.  The new page clearly displays the name of the selected project as a title.
4.  The page contains a designated area for displaying the list of users and profiles.

---
## Story 2.2: Display User and Profile List
**As a** user, **I want** to see a list of all users and their profiles for the selected project, **so that** I can see who is playing my game.

**Acceptance Criteria:**
1.  When the project detail page loads, a GraphQL query is made to the Honeycomb API's `profile` endpoint, filtering by the `project` address from the URL.
2.  The returned data is displayed in a table or list format.
3.  The table displays key profile information, such as User ID, a truncated Profile Address, and any available `info` (name, pfp).
4.  If a project has no user profiles, a message like "No profiles found for this project" is displayed.
5.  If the API call fails, a user-friendly error message is shown.
