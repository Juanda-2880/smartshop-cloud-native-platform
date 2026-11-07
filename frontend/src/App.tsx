import { PlatformHeader } from './components/organisms/PlatformHeader';
import { FoundationOverview } from './features/foundation/FoundationOverview';

export function App() {
  return (
    <div className="foundation-container">
      <PlatformHeader />
      <FoundationOverview />
    </div>
  );
}

export default App;
