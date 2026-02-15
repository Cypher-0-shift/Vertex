import { useState, useRef, useEffect } from 'react';
import { Stock } from '../../data/stocks';

interface StockSearchInputProps {
  label?: string;
  value: string;
  onSelect: (symbol: string) => void;
  error?: string;
  stocks: Stock[];
}

export default function StockSearchInput({ 
  label, 
  value, 
  onSelect, 
  error,
  stocks 
}: StockSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      const stock = stocks.find(s => s.symbol === value);
      if (stock) {
        setSearchTerm(`${stock.name} (${stock.symbol})`);
      }
    } else {
      setSearchTerm('');
    }
  }, [value, stocks]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsOpen(true);

    if (term.trim() === '') {
      setFilteredStocks(stocks);
    } else {
      const filtered = stocks.filter(stock => 
        stock.name.toLowerCase().includes(term.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(term.toLowerCase()) ||
        stock.sector.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredStocks(filtered);
    }
  };

  const handleStockSelect = (stock: Stock) => {
    onSelect(stock.symbol);
    setSearchTerm(`${stock.name} (${stock.symbol})`);
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
    setFilteredStocks(stocks);
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
          placeholder="Search by name, symbol, or sector..."
          className={`
            w-full px-4 py-3 
            bg-white/[0.06] backdrop-blur-sm
            border border-white/10 rounded-xl
            text-white placeholder-white/30
            focus:outline-none focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20
            transition-all duration-200
            ${error ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20' : ''}
          `}
        />

        {isOpen && filteredStocks.length > 0 && (
          <div className="absolute z-50 w-full mt-2 max-h-64 overflow-y-auto bg-navy-dark/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl">
            {filteredStocks.map(stock => (
              <button
                key={stock.symbol}
                type="button"
                onClick={() => handleStockSelect(stock)}
                className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-150 border-b border-white/5 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{stock.name}</p>
                    <p className="text-xs text-white/60 mt-0.5">
                      {stock.symbol} • {stock.sector}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-cyan">₹{stock.currentPrice.toFixed(2)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {isOpen && searchTerm && filteredStocks.length === 0 && (
          <div className="absolute z-50 w-full mt-2 p-4 bg-navy-dark/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl">
            <p className="text-sm text-white/40 text-center">No stocks found</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 mt-1.5">{error}</p>
      )}
    </div>
  );
}
