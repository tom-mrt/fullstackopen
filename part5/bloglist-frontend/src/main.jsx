import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotifyContextProvider } from './NotifyContext';
import { LoginContextProvider } from './LoginContext';

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotifyContextProvider>
      <LoginContextProvider>
        <App />
      </LoginContextProvider>
    </NotifyContextProvider>
  </QueryClientProvider>
)

