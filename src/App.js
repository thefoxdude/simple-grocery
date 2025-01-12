import MealPlanner from "./MealPlanner";
import { AuthProvider } from './components/AuthProvider';
import './index.css'

function App() {
  return (
    <AuthProvider>
      <MealPlanner/>
    </AuthProvider>
  );
}

export default App;