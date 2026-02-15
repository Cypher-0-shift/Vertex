import { useState, useRef, useEffect } from 'react';
import { searchStocks, StockSearchResult } from '../../services/stockApi';

interface LiveStockSearchProps {
  label?: string;
  onSelect: (symbol: string, name: string) => void;
  error?: string;
}

export default function LiveStockSearch({ 
  label, 
  onSelect, 
  error
}: LiveStockSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsOpen(true);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (term.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Debounce search
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const searchResults = await searchStocks(term);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const handleStockSelect = (result: StockSearchResult) => {
    setSearchTerm(`${result.name} (${result.symbol})`);
    setIsOpen(false);
    onSelect(result.symbol, result.name);
  };

  const handleFocus = () => {
    if (results.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-white/70">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder="Search Indian stocks (e.g., TCS, Reliance, HDFC)..."
          className={`
            w-full px-4 py-3 
            bg-white/[0.05] backdrop-blur-sm
            border border-white/10 rounded-xl
            text-white placeholder-white/40
            focus:outline-none focus:border-purple/50 focus:ring-2 focus:ring-purple/20
            transition-all duration-200
            ${error ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20' : ''}
          `}
        />

        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-purple/30 border-t-purple rounded-full animate-spin" />
          </div>
        )}

        {isOpen && !isLoading && results.length > 0 && (
          <div className="absolute z-50 w-full mt-2 max-h-80 overflow-y-auto bg-navy-dark/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl">
            {results.map((result, index) => (
              <button
                key={`${result.symbol}-${index}`}
                type="button"
                onClick={() => handleStockSelect(result)}
                className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-150 border-b border-white/5 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{result.name}</p>
                    <p className="text-xs text-white/60 mt-0.5">
                      {result.symbol} • {result.exchange}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2 py-1 bg-purple/20 text-purple-light rounded-md border border-purple/30">
                      {result.type}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {isOpen && !isLoading && searchTerm.length >= 2 && results.length === 0 && (
          <div className="absolute z-50 w-full mt-2 p-4 bg-navy-dark/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl">
            <p className="text-sm text-white/40 text-center">
              No stocks found. Try searching with stock symbol or company name.
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 mt-1.5">{error}</p>
      )}
    </div>
  );
}
