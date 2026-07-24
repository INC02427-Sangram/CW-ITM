/**
 * Redux Usage Examples for ITM Application
 * 
 * This file demonstrates how to use the Redux slices in your components.
 * Copy these patterns into your actual components as needed.
 */

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  backToBackActions,
  userActions,
  dashboardActions,
  purchaseOrdersActions,
} from "../redux";

// ============================================================================
// EXAMPLE 1: Using Back-to-Back Trading slice in contract form
// ============================================================================
function ContractFormExample() {
  const dispatch = useDispatch();
  
  // Select state from store
  const { currentStep, headerDetails, contractItems, isDirty } = useSelector(
    (state) => state.backToBack.contractForm
  );
  const loading = useSelector((state) => state.backToBack.loading);

  // Handle step navigation
  const handleNextStep = () => {
    dispatch(backToBackActions.setCurrentStep(currentStep + 1));
  };

  const handleBackStep = () => {
    dispatch(backToBackActions.setCurrentStep(currentStep - 1));
  };

  // Handle form updates
  const handleHeaderChange = (fieldName, value) => {
    dispatch(backToBackActions.setHeaderDetails({
      [fieldName]: value
    }));
  };

  // Handle items
  const handleAddItem = (item) => {
    dispatch(backToBackActions.addContractItem(item));
  };

  const handleUpdateItem = (index, data) => {
    dispatch(backToBackActions.updateContractItem({ index, data }));
  };

  const handleRemoveItem = (index) => {
    dispatch(backToBackActions.removeContractItem(index));
  };

  // Handle form submission
  const handleSubmit = async () => {
    dispatch(backToBackActions.setLoading(true));
    try {
      // API call here
      const result = await api.createContract({
        headerDetails,
        contractItems,
      });
      
      dispatch(backToBackActions.resetContractForm());
      dispatch(backToBackActions.setLoading(false));
      // Navigate or show success
    } catch (error) {
      dispatch(backToBackActions.setError(error.message));
      dispatch(backToBackActions.setLoading(false));
    }
  };

  return (
    <div>
      {/* Your form UI here */}
      <button onClick={handleBackStep} disabled={currentStep === 0}>
        Back
      </button>
      <button onClick={handleNextStep}>Next</button>
      <button onClick={handleSubmit} disabled={!isDirty || loading}>
        Submit
      </button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Using User slice for authentication
// ============================================================================
function LoginExample() {
  const dispatch = useDispatch();
  const { isAuthenticated, userInfo, loading } = useSelector((state) => state.user);

  const handleLogin = async (credentials) => {
    dispatch(userActions.setLoading(true));
    try {
      const response = await api.login(credentials);
      
      dispatch(userActions.loginUser({
        userInfo: {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          role: response.user.role,
          permissions: response.user.permissions,
        },
        session: {
          token: response.token,
          expiresAt: response.expiresAt,
        },
      }));
    } catch (error) {
      dispatch(userActions.setError(error.message));
    } finally {
      dispatch(userActions.setLoading(false));
    }
  };

  const handleLogout = () => {
    dispatch(userActions.logoutUser());
    // Also reset other slices if needed
    dispatch(backToBackActions.resetBackToBack());
    dispatch(dashboardActions.resetDashboard());
  };

  const handleUpdatePreferences = (prefs) => {
    dispatch(userActions.setPreferences(prefs));
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {userInfo.firstName}!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <form onSubmit={handleLogin}>
          {/* Login form fields */}
        </form>
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Using Dashboard slice
// ============================================================================
function DashboardExample() {
  const dispatch = useDispatch();
  const { metrics, recentActivity, loading, filters } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const fetchDashboardData = async () => {
    dispatch(dashboardActions.setLoading(true));
    try {
      const data = await api.getDashboardData(filters);
      dispatch(dashboardActions.setMetrics(data.metrics));
      dispatch(dashboardActions.setRecentActivity(data.recentActivity));
    } catch (error) {
      dispatch(dashboardActions.setError(error.message));
    } finally {
      dispatch(dashboardActions.setLoading(false));
    }
  };

  const handleFilterChange = (newFilters) => {
    dispatch(dashboardActions.setFilters(newFilters));
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div>
            <h2>Total Contracts: {metrics.totalContracts}</h2>
            <h2>Active Contracts: {metrics.activeContracts}</h2>
          </div>
          <ul>
            {recentActivity.map((activity) => (
              <li key={activity.id}>{activity.description}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Using Purchase Orders slice with pagination
// ============================================================================
function PurchaseOrdersExample() {
  const dispatch = useDispatch();
  const { orders, loading, pagination, filters } = useSelector(
    (state) => state.purchaseOrders
  );

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, pagination.pageSize, filters]);

  const fetchOrders = async () => {
    dispatch(purchaseOrdersActions.setLoading(true));
    try {
      const response = await api.getPurchaseOrders({
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters,
      });
      
      dispatch(purchaseOrdersActions.setOrders(response.data));
      dispatch(purchaseOrdersActions.setPagination({
        totalCount: response.totalCount,
      }));
    } catch (error) {
      dispatch(purchaseOrdersActions.setError(error.message));
    } finally {
      dispatch(purchaseOrdersActions.setLoading(false));
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(purchaseOrdersActions.setPagination({ page: newPage }));
  };

  const handleFilterChange = (newFilters) => {
    dispatch(purchaseOrdersActions.setFilters(newFilters));
    // Reset to first page when filters change
    dispatch(purchaseOrdersActions.setPagination({ page: 0 }));
  };

  const handleSelectOrder = (order) => {
    dispatch(purchaseOrdersActions.setSelectedOrder(order));
  };

  return (
    <div>
      {/* Filters */}
      <input
        placeholder="Search..."
        value={filters.searchQuery}
        onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
      />

      {/* Orders List */}
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id} onClick={() => handleSelectOrder(order)}>
              {order.orderNumber} - {order.status}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <button
        onClick={() => handlePageChange(pagination.page - 1)}
        disabled={pagination.page === 0}
      >
        Previous
      </button>
      <span>
        Page {pagination.page + 1} of{" "}
        {Math.ceil(pagination.totalCount / pagination.pageSize)}
      </span>
      <button
        onClick={() => handlePageChange(pagination.page + 1)}
        disabled={(pagination.page + 1) * pagination.pageSize >= pagination.totalCount}
      >
        Next
      </button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Selecting multiple slices
// ============================================================================
function CombinedStateExample() {
  const dispatch = useDispatch();

  // Select from multiple slices
  const user = useSelector((state) => state.user.userInfo);
  const contracts = useSelector((state) => state.backToBack.contracts);
  const orders = useSelector((state) => state.purchaseOrders.orders);
  const dashboardMetrics = useSelector((state) => state.dashboard.metrics);

  // You can also use createSelector from reselect for memoized selectors
  const hasPermission = (permission) => {
    return user.permissions?.includes(permission);
  };

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      {hasPermission("view_contracts") && (
        <p>Total Contracts: {contracts.length}</p>
      )}
      {hasPermission("view_orders") && (
        <p>Total Orders: {orders.length}</p>
      )}
    </div>
  );
}

export {
  ContractFormExample,
  LoginExample,
  DashboardExample,
  PurchaseOrdersExample,
  CombinedStateExample,
};
