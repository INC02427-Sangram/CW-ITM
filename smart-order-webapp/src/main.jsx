import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./i18n"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <HashRouter hashType="noslash">
      <Provider store={store}>
        <App />
      </Provider>
    </HashRouter> 
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
  </QueryClientProvider>
);