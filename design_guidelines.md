# Kerala LT Line Break Detection System - Design Guidelines

## Design Approach

**Selected Approach**: Design System + Professional Monitoring References
**Justification**: This is a mission-critical infrastructure monitoring system requiring maximum clarity, efficiency, and reliability. Drawing from Carbon Design System principles and professional monitoring dashboards (Grafana, AWS CloudWatch, Datadog).

**Core Principles**:
- **Clarity First**: Every element serves operational efficiency
- **Status-Driven Design**: Color and hierarchy communicate system health instantly
- **Dark Mode Default**: Reduce operator eye strain during extended monitoring
- **Information Density**: Maximize data visibility without clutter

---

## Color Palette

### Dark Mode (Primary)
- **Background**: 220 15% 8% (Deep navy-black)
- **Surface**: 220 12% 12% (Elevated panels)
- **Surface Elevated**: 220 10% 16% (Cards, modals)
- **Text Primary**: 220 10% 95%
- **Text Secondary**: 220 8% 70%
- **Border**: 220 10% 22%

### Status Colors (High Contrast)
- **Critical**: 0 80% 55% (Bright red for line breaks)
- **High Severity**: 25 95% 52% (Orange for warnings)
- **Medium**: 45 95% 55% (Amber for attention)
- **Normal/Success**: 142 70% 45% (Green for healthy status)
- **Info**: 210 85% 55% (Blue for notifications)

### Brand/Accent
- **Primary**: 210 100% 50% (Kerala grid blue - actionable elements)
- **Primary Hover**: 210 100% 45%

### Light Mode (Secondary)
- **Background**: 220 15% 98%
- **Surface**: 0 0% 100%
- **Text Primary**: 220 15% 15%
- **Text Secondary**: 220 10% 45%

---

## Typography

**Font Stack**: 
- **Primary**: 'Inter' (Google Fonts) - excellent for data displays
- **Monospace**: 'JetBrains Mono' - for technical values, IDs, timestamps

**Scale**:
- **Display**: text-4xl (36px) font-bold - Dashboard titles
- **Heading 1**: text-2xl (24px) font-semibold - Section headers
- **Heading 2**: text-xl (20px) font-semibold - Card titles
- **Body Large**: text-base (16px) font-medium - Primary content
- **Body**: text-sm (14px) font-normal - Standard text
- **Caption**: text-xs (12px) font-normal - Metadata, timestamps
- **Mono Data**: text-sm font-mono - Metrics, IDs, codes

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistency
- Component padding: p-4, p-6
- Section gaps: gap-6, gap-8
- Page margins: px-6, px-8
- Vertical rhythm: space-y-6, space-y-8

**Grid Structure**:
- **Dashboard**: 12-column grid with 24px gutters
- **Sidebar**: Fixed 280px (lg screens), collapsible on mobile
- **Content Area**: Fluid with max-w-screen-2xl
- **Cards**: Minimum 320px width, responsive grid

---

## Component Library

### Navigation
**Top Bar**: Fixed header with breadcrumbs, user menu, notification bell
- Height: h-16
- Alert indicator: Pulsing red dot for active events
- Real-time clock display

**Sidebar**: 
- Collapsible navigation (hamburger on mobile)
- Icons + labels for main sections
- Active state: Blue left border + background tint
- Substations/Feeders expandable tree

### Dashboard Components

**Stats Cards**:
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Height: Variable content, min-h-32
- Layout: Icon (top-left) + Value (large, center) + Label (bottom) + Trend indicator
- Border-left: 4px colored by status

**Real-Time Event Feed**:
- Vertical timeline layout
- Each event: Timestamp + Icon + Feeder + Status badge + Quick actions
- Color-coded left border by severity
- Auto-scroll to latest (with pause button)

**Map View**:
- Interactive Kerala map with substation pins
- Color-coded by health status
- Clustering for dense areas
- Click for feeder details popup

**Waveform Charts**:
- Dark background with grid lines
- Three-phase color coding: R (red), Y (yellow), B (blue)
- Hover: Crosshair with exact values
- Zoom controls and time range selector

**Data Tables**:
- Sticky header with sorting
- Alternating row backgrounds (subtle)
- Status pills in columns
- Row actions: View, Assign, Resolve
- Pagination: 25/50/100 per page

### Forms & Inputs

**Text Inputs**: 
- Dark background with lighter border
- Focus: Blue border glow
- Labels above, helper text below
- Icons for validation states

**Dropdowns/Select**:
- Searchable for long lists (feeders, substations)
- Multi-select for filters
- Custom styling matching dark theme

**Action Buttons**:
- **Primary**: Solid blue (assignments, submissions)
- **Secondary**: Outlined white (cancel, back)
- **Danger**: Solid red (trip breaker, delete)
- **Icon Buttons**: For compact actions in tables

### Alerts & Notifications

**Toast Notifications**:
- Top-right corner
- Auto-dismiss after 5s (except critical)
- Color-coded by type
- Close button

**Modal Dialogs**:
- Overlay: backdrop-blur-sm with dark overlay
- Card: Centered, max-w-2xl
- Header: Title + Close button
- Footer: Action buttons (right-aligned)

**Alert Banner**:
- Full-width at top (for system-wide alerts)
- Dismissible
- Icon + Message + Action link

---

## Page-Specific Layouts

### Login Page
- Split screen: Left (branding/imagery), Right (form)
- Kerala power grid illustration or substation photo
- Clean, minimal form with logo

### Main Dashboard
- **Top Section**: 4 stat cards (Total Events, Active Alerts, Healthy Feeders, Response Time)
- **Middle**: 2-column (Event feed left, Map right)
- **Bottom**: Recent waveform chart

### Feeder Detail View
- **Header**: Breadcrumb + Feeder name + Status badge
- **Grid**: 3-column (Stats, Location map, Recent events)
- **Tabs**: Overview, Historical Data, Waveform Analysis, Consumers

### Event Management
- **Filters**: Top bar with multi-select (status, severity, feeder, date range)
- **Table**: Full-width with pagination
- **Side Panel**: Event details drawer (slide from right)

---

## Images

**Hero/Marketing** (if needed for public-facing landing):
- Kerala power grid infrastructure photo (transmission towers, substations)
- Technical but approachable

**Dashboard Icons**: Use **Heroicons** (outline for navigation, solid for status indicators)

**Illustrations**: None required - focus on real data visualization

---

## Animations

**Minimal & Purposeful**:
- Fade-in for toast notifications (300ms)
- Slide transition for drawers (250ms ease-out)
- Pulse animation for critical alerts
- Smooth hover states on interactive elements
- NO decorative animations

---

## Accessibility & Performance

- WCAG AA contrast ratios maintained
- Keyboard navigation for all interactive elements
- Screen reader labels for status indicators
- Lazy load waveform data
- Virtualized tables for large datasets
- Optimistic UI updates for better perceived performance