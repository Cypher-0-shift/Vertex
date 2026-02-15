import RiskPanel from '../components/portfolio/RiskPanel';
import RiskInsightsPanel from '../components/risk/RiskInsightsPanel';

export default function RiskPage() {
  return (
    <div className="min-h-screen pt-28 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Risk Analysis</h1>
          <p className="text-white/60">Comprehensive risk assessment and insights</p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />

        <RiskPanel />

        <div className="h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />

        <RiskInsightsPanel />
      </div>
    </div>
  );
}
