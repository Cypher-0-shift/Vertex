export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated light blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue/8 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan/6 rounded-full blur-3xl animate-blob animation-delay-4000" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-grid-pattern animate-grid-move" />
      </div>
      
      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-cyan/40 rounded-full animate-float-slow" />
      <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue/40 rounded-full animate-float-slow animation-delay-3000" />
      <div className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-cyan/30 rounded-full animate-float-slow animation-delay-5000" />
      <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-blue/30 rounded-full animate-float-slow animation-delay-7000" />
    </div>
  );
}
