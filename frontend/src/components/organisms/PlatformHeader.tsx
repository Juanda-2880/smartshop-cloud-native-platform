import { StatusBadge } from '../atoms/StatusBadge';

export function PlatformHeader() {
  return (
    <header className="platform-header">
      <div className="platform-brand">
        <span>SmartShop Cloud-Native Platform</span>
      </div>
      <StatusBadge label="Foundation Ready • React 19 + Spring Boot 3.5" />
    </header>
  );
}
