import Header from '../components/Header';
import MetricsGrid from '../components/MetricsGrid';

export default function DashboardPage() {
  return (
    <div className="min-h-screen pt-28 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <Header />
        
        <div className="h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
        
        <MetricsGrid />

        <div className="mt-16 text-center">
          <p className="text-white/50 text-sm">
            Navigate using the menu above to explore different sections
          </p>
        </div>
      </div>
    </div>
  );
}
