import { usePortfolioStore } from '../store/portfolioStore';
import AddStockForm from '../components/AddStockForm';
import PortfolioTable from '../components/portfolio/PortfolioTable';
import SectorChart from '../components/portfolio/SectorChart';
import ActivityOverview from '../components/portfolio/ActivityOverview';
import StockPriceChart from '../components/portfolio/StockPriceChart';

export default function PortfolioPage() {
  const portfolioItems = usePortfolioStore(state => state.portfolioItems);

  const stocksForChart = portfolioItems.map(item => ({
    symbol: item.symbol,
    name: item.name,
    currentPrice: item.currentPrice
  }));

  return (
    <div className="min-h-screen pt-28 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1200px] mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Portfolio Management</h1>
          <p className="text-white/60">Manage your holdings and track performance</p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />

        {/* Top Section: Sector Chart + Add Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <SectorChart />
          </div>
          <div className="lg:col-span-2">
            <AddStockForm />
          </div>
        </div>

        {/* Price Chart Section */}
        {portfolioItems.length > 0 && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
            <StockPriceChart stocks={stocksForChart} />
          </>
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />

        {/* Portfolio Table + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
