import BehaviorPanel from '../components/behavior/BehaviorPanel';
import BehaviorInsightsPanel from '../components/behavior/BehaviorInsightsPanel';

export default function BehaviorPage() {
  return (
    <div className="min-h-screen pt-28 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Behavioral Intelligence</h1>
          <p className="text-white/60">Trading pattern analysis and recommendations</p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />

        <BehaviorPanel />

        <div className="h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />

        <BehaviorInsightsPanel />
      </div>
    </div>
  );
}
