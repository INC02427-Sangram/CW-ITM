import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store'
import './index.css'
import './i18n/index.js'
import App from './App.jsx'
import "../node_modules/@cw/quickadduser/dist/assets/style.css";
import "../node_modules/@cw/usersummary/dist/assets/style.css";
import "../node_modules/@cw/adduser/dist/assets/style.css";
import "../node_modules/@cw/viewuser/dist/assets/style.css";
import "../node_modules/@cw/edituser/dist/assets/style.css";
import "../node_modules/@cw/rolesummary/dist/assets/style.css";
import "../node_modules/@cw/createrole/dist/assets/style.css";
import "../node_modules/@cw/viewandeditrole/dist/assets/style.css";
import "../node_modules/@cw/mfviewandedit/dist/assets/style.css";
import "../node_modules/@cw/groupsummary/dist/assets/style.css";
import "../node_modules/@cw/creategroup/dist/assets/style.css";
import "../node_modules/@cw/applicationsummary/dist/assets/style.css";
import "../node_modules/@cw/createapplication/dist/assets/style.css";
import "../node_modules/@cw/viewapplication/dist/assets/style.css";
import "../node_modules/@cw/editapplication/dist/assets/style.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
