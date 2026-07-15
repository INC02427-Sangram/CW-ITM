# React Router Configuration

This project uses a scalable and configurable routing system with React Router v6.

## Architecture

### 1. Routes Configuration (`config/routes.config.jsx`)
The central configuration file that defines all application routes. Each route contains:
- `id`: Unique identifier
- `path`: URL path
- `label`: Display label (used as translation key)
- `icon`: Material-UI icon component
- `component`: Lazy-loaded page component
- `showInNav`: Boolean to show/hide in navigation
- `index`: Sort order in navigation

**Example:**
```javascript
{
  id: "dashboard",
  path: "/",
  label: "Dashboard",
  icon: DashboardIcon,
  component: Dashboard,
  showInNav: true,
  index: 0,
}
```

### 2. Helper Functions
- `getRouteById(id)`: Find route by ID
- `getRouteByPath(path)`: Find route by path
- `getNavigationRoutes()`: Get all routes that should appear in navigation

## Usage

### Adding a New Route

1. **Create the page component** in `src/pages/`:
```javascript
// src/pages/MyNewPage.jsx
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function MyNewPage() {
  const { t } = useTranslation();
  
  return (
    <Box sx={{ padding: "16px" }}>
      <Typography variant="h5">{t("My New Page")}</Typography>
    </Box>
  );
}
```

2. **Add the route** to `config/routes.config.jsx`:
```javascript
import MyNewPage from "../pages/MyNewPage";
import MyIcon from "@mui/icons-material/MyIcon";

// Add to routesConfig array:
{
  id: "my-new-page",
  path: "/my-new-page",
  label: "My New Page",
  icon: MyIcon,
  component: MyNewPage,
  showInNav: true,
  index: 7, // Next available index
}
```

3. **Add translations** to `i18n/locales/*/translation.json`:
```json
{
  "My New Page": "My New Page"  // English
}
```

```json
{
  "My New Page": "मेरा नया पेज"  // Hindi
}
```

That's it! The route will automatically appear in the navigation and be available for routing.

### Programmatic Navigation

Use React Router hooks in any component:

```javascript
import { useNavigate } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/dashboard");
  };
  
  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

### Get Current Route

```javascript
import { useLocation } from "react-router-dom";

function MyComponent() {
  const location = useLocation();
  console.log(location.pathname); // e.g., "/dashboard"
}
```

## File Structure

```
src/
├── config/
│   └── routes.config.jsx     # Central route configuration
├── pages/                     # Page components (lazy loaded)
│   ├── Dashboard.jsx
│   ├── BackToBacktrading.jsx
│   └── ...
├── components/
│   └── MainContainer/
│       ├── SideNav.jsx        # Navigation component
│       └── MainContainer.jsx  # Layout with <Outlet />
├── App.jsx                    # Router setup
└── i18n/                      # Translations
```

## Benefits

1. **Single Source of Truth**: All routes defined in one place
2. **Easy to Maintain**: Add/remove routes by editing config only
3. **Type Safety**: Can be extended with TypeScript
4. **Lazy Loading**: Pages load on-demand for better performance
5. **i18n Ready**: Labels use translation keys automatically
6. **Configurable**: Easy to show/hide routes or reorder navigation
7. **Scalable**: Add unlimited routes without changing core logic

## Best Practices

- Keep route paths lowercase with hyphens (e.g., `/my-route`)
- Use semantic IDs that match the route purpose
- Always provide translations for labels
- Lazy load page components for better performance
- Wrap page content in Material-UI Box for consistent styling
- Use the same Box styling pattern across all pages for consistency
