import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {QueryClient} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

import {Providers} from "./Providers.tsx";
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <Providers client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
      </Providers>
  </React.StrictMode>,
)
