import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import {BrowserRouter} from 'react-router-dom'
import {ApolloClient,InMemoryCache,ApolloProvider} from   '@apollo/client'
import { ToastContainer } from 'react-toastify';


const client = new ApolloClient({
  uri : "http://localhost:4000/",
  cache:new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
      <ToastContainer/>
    </ApolloProvider>
    </BrowserRouter>
  </StrictMode>,
)
