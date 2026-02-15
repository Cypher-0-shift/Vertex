import SimulationPanel from '../components/simulation/SimulationPanel';

export default function SimulationPage() {
  return (
    <div className="min-h-screen pt-28 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Portfolio Simulation</h1>
          <p className="text-white/60">Test portfolio adjustments and optimize risk</p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />

        <SimulationPanel />
      </div>
    </div>
  );
}
