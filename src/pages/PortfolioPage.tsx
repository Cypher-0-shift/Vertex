import AddStockForm from '../components/AddStockForm';
import PortfolioTable from '../components/portfolio/PortfolioTable';
import SectorChart from '../components/portfolio/SectorChart';
import ActivityOverview from '../components/portfolio/ActivityOverview';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen pt-28 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Portfolio Management</h1>
          <p className="text-white/60">Manage your holdings and track performance</p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectorChart />
          <AddStockForm />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PortfolioTable />
          </div>
          <div>
            <ActivityOverview />
          </div>
        </div>
      </div>
    </div>
  );
}
