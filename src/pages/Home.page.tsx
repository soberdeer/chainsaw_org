// import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { OrgChart } from '@/components/OrgChart/OrgChart';
import { mock } from '@/mock';
import { Shell } from '@/components/Shell/Shell';

export function HomePage() {
  return (
    <Shell>
      <OrgChart tree={mock} />
    </Shell>
  );
}
