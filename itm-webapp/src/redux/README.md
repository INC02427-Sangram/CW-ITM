# Redux State Management Structure

## Overview
This directory contains the Redux store configuration and all state slices for the ITM application.

## Directory Structure

```
redux/
├── slices/                    # Individual feature slices
│   ├── dashboardSlice.js      # Dashboard metrics and data
│   ├── backToBackSlice.js     # Back-to-back trading contracts
│   ├── purchaseTradingSlice.js # Purchase trading operations
│   ├── salesTradingSlice.js   # Sales trading operations
│   ├── purchaseOrdersSlice.js # Purchase order management
│   ├── salesOrdersSlice.js    # Sales order management
│   ├── outboundDeliverySlice.js # Delivery tracking
│   ├── invoicesSlice.js       # Invoice management
│   ├── adminConsoleSlice.js   # Admin settings and users
│   └── userSlice.js           # User authentication and preferences
├── reducers/
│   └── index.js               # Root reducer combining all slices
├── store.js                   # Redux store configuration
├── index.js                   # Central export file
└── README.md                  # This file
```

## Usage

### Accessing State

```javascript
import { useSelector } from "react-redux";

// Access dashboard state
const dashboardData = useSelector((state) => state.dashboard);
const metrics = useSelector((state) => state.dashboard.metrics);

// Access user state
const userInfo = useSelector((state) => state.user.userInfo);
const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

// Access back-to-back trading state
const contracts = useSelector((state) => state.backToBack.contracts);
const currentStep = useSelector((state) => state.backToBack.contractForm.currentStep);
```

### Dispatching Actions

```javascript
import { useDispatch } from "react-redux";
import { backToBackActions, userActions } from "../redux";

function MyComponent() {
  const dispatch = useDispatch();

  // Update contract form
  const handleHeaderChange = (data) => {
    dispatch(backToBackActions.setHeaderDetails(data));
  };

  // Login user
  const handleLogin = (userData) => {
    dispatch(userActions.loginUser({
      userInfo: userData.user,
      session: { token: userData.token, expiresAt: userData.expiresAt }
    }));
  };

  // Set loading state
  const fetchContracts = async () => {
    dispatch(backToBackActions.setLoading(true));
    try {
      const data = await api.getContracts();
      dispatch(backToBackActions.setContracts(data));
    } catch (error) {
      dispatch(backToBackActions.setError(error.message));
    } finally {
      dispatch(backToBackActions.setLoading(false));
    }
  };
}
```

### Alternative Import Pattern

```javascript
// Import specific actions from individual slices
import { setContracts, setCurrentStep } from "../redux/slices/backToBackSlice";
import { loginUser, logoutUser } from "../redux/slices/userSlice";

dispatch(setContracts(data));
dispatch(loginUser(userData));
```

## State Structure

### Dashboard State
```javascript
{
  loading: false,
  error: null,
  dashboardData: null,
  metrics: { totalContracts, activeContracts, pendingOrders, completedOrders },
  recentActivity: [],
  filters: { dateRange }
}
```

### Back-to-Back Trading State
```javascript
{
  loading: false,
  error: null,
  contracts: [],
  contractDetails: null,
  contractForm: {
    currentStep: 0,
    headerDetails: {},
    contractItems: [],
    isDirty: false
  },
  pagination: { page, pageSize, totalCount },
  filters: { status, dateRange, supplier, searchQuery },
  selectedContract: null
}
```

### User State
```javascript
{
  loading: false,
  error: null,
  isAuthenticated: false,
  userInfo: {
    id, username, email, firstName, lastName, role, permissions[], avatar
  },
  preferences: { theme, language, dateFormat, timezone },
  session: { token, expiresAt }
}
```

## Common Actions

All slices include these common actions:
- `setLoading(boolean)` - Set loading state
- `setError(string|null)` - Set error message
- `setFilters(object)` - Update filters
- `setPagination(object)` - Update pagination
- `reset[SliceName]()` - Reset slice to initial state

## Best Practices

1. **Keep state normalized** - Store data in flat structures, reference by ID
2. **Use selectors** - Create reusable selectors for complex state queries
3. **Handle loading states** - Always set loading before async operations
4. **Error handling** - Clear errors when retrying operations
5. **Reset on logout** - Dispatch reset actions when user logs out
6. **Immutable updates** - Redux Toolkit handles this automatically with Immer

## Adding New Slices

1. Create new slice file in `slices/` directory
2. Export slice and actions
3. Import and add to `reducers/index.js`
4. Export from `redux/index.js` for easy imports
5. Update this README with state structure

## Example: Adding a New Feature

```javascript
// 1. Create slices/myFeatureSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = { data: [], loading: false, error: null };

const myFeatureSlice = createSlice({
  name: "myFeature",
  initialState,
  reducers: {
    setData: (state, action) => { state.data = action.payload; },
    // ... other reducers
  },
});

export const { setData } = myFeatureSlice.actions;
export default myFeatureSlice.reducer;

// 2. Add to reducers/index.js
import myFeatureReducer from "../slices/myFeatureSlice";

const rootReducer = combineReducers({
  // ... existing reducers
  myFeature: myFeatureReducer,
});

// 3. Export from redux/index.js
export * as myFeatureActions from "./slices/myFeatureSlice";
```
