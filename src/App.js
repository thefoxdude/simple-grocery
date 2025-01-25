import { AuthProvider } from './components/AuthProvider';
import MainRouter from './components/MainRouter';
import './index.css'

function App() {
  return (
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  );
}

export default App;