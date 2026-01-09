# Threat Guard - React Application

A React-based security monitoring system with a professional bottom navigation bar.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Application**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Bottom Navigation Bar** with 5 tabs:
  - Home
  - Documents
  - Executables
  - URLs
  - Portal

- **Color Palette**:
  - Background: `#1a1a1a`
  - Active Color: `#E97583` (Coral/Pink)
  - Inactive Color: `#6b7280` (Gray)
  - Text Color: Matching icon states

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Active State**: Circular coral background for the active tab
- **Smooth Transitions**: All interactions have smooth animations

## Project Structure

```
src/
├── components/
│   ├── BottomNavigation.js    # Main navigation component
│   └── BottomNavigation.css   # Navigation styles
├── App.js                      # Main app component
├── App.css                     # App styles
├── index.js                    # Entry point
└── index.css                   # Global styles
```

## Customization

To change the active tab, modify the `activeTab` state in the `BottomNavigation` component.

## Technologies Used

- React 18
- CSS3
- SVG Icons