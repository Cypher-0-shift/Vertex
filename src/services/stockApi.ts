import { IndianSector } from '../store/portfolioStore';

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
}

export interface StockDetails {
  symbol: string;
  name: string;
  sector: IndianSector;
  industry: string;
  currentPrice: number;
  peRatio: number;
  debtEquity: number;
  roe: number;
  beta: number;
  marketCap: number;
  volume: number;
  change: number;
  changePercent: number;
}

// Using Twelve Data API (free tier: 800 requests/day)
const TWELVE_DATA_API_KEY = 'demo'; // Replace with actual key from twelvedata.com
const TWELVE_DATA_BASE_URL = 'https://api.twelvedata.com';

// Fallback: Using Yahoo Finance via RapidAPI alternative
const YAHOO_FINANCE_BASE_URL = 'https://query1.finance.yahoo.com/v1';

// Map common Indian stock symbols to Yahoo Finance format
const mapToYahooSymbol = (symbol: string): string => {
  // If already has exchange suffix, return as is
  if (symbol.includes('.NS') || symbol.includes('.BO')) return symbol;
  
  // Remove any whitespace
  const cleanSymbol = symbol.trim().toUpperCase();
  
  // Try NSE first (more liquid)
  return `${cleanSymbol}.NS`;
};

// Sector mapping based on industry keywords
const inferSector = (industry: string): IndianSector => {
  const industryLower = industry.toLowerCase();
  
  if (industryLower.includes('software') || industryLower.includes('technology') || industryLower.includes('it services')) {
    return 'IT';
  }
  if (industryLower.includes('bank') || industryLower.includes('financial')) {
    return 'Banking';
  }
  if (industryLower.includes('oil') || industryLower.includes('gas') || industryLower.includes('energy') || industryLower.includes('petroleum')) {
    return 'Energy';
  }
  if (industryLower.includes('consumer') || industryLower.includes('fmcg') || industryLower.includes('food') || industryLower.includes('beverage')) {
    return 'FMCG';
  }
  if (industryLower.includes('construction') || industryLower.includes('infrastructure') || industryLower.includes('engineering')) {
    return 'Infrastructure';
  }
  if (industryLower.includes('pharma') || industryLower.includes('healthcare') || industryLower.includes('drug')) {
    return 'Pharma';
  }
  if (industryLower.includes('auto') || industryLower.includes('vehicle') || industryLower.includes('motor')) {
    return 'Automobile';
  }
  if (industryLower.includes('steel') || industryLower.includes('metal') || industryLower.includes('mining')) {
    return 'Metals';
  }
  
  return 'IT'; // Default fallback
};

export const searchStocks = async (query: string): Promise<StockSearchResult[]> => {
  if (!query || query.length < 2) return [];

  try {
    // Using Twelve Data symbol search with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(
      `${TWELVE_DATA_BASE_URL}/symbol_search?symbol=${encodeURIComponent(query)}&outputsize=10&apikey=${TWELVE_DATA_API_KEY}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!response.ok) {
      console.warn('Search API failed, using fallback');
      return getFallbackSearchResults(query);
    }

    const data = await response.json();
    
    if (data.data && Array.isArray(data.data)) {
      // Filter for Indian exchanges (NSE, BSE)
      const results = data.data
        .filter((item: any) => 
          item.exchange === 'NSE' || 
          item.exchange === 'BSE' ||
          item.country === 'India'
        )
        .map((item: any) => ({
          symbol: item.symbol,
          name: item.instrument_name || item.symbol,
          exchange: item.exchange,
          type: item.instrument_type || 'Common Stock'
        }))
        .slice(0, 10);

      if (results.length > 0) return results;
    }

    // Fallback if no results
    return getFallbackSearchResults(query);
  } catch (error) {
    console.error('Stock search error:', error);
    return getFallbackSearchResults(query);
  }
};

// Fallback search with common Indian stocks
const getFallbackSearchResults = (query: string): StockSearchResult[] => {
  const commonStocks = [
    { symbol: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE', type: 'Common Stock' },
    { symbol: 'RELIANCE', name: 'Reliance Industries', exchange: 'NSE', type: 'Common Stock' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', exchange: 'NSE', type: 'Common Stock' },
    { symbol: 'INFY', name: 'Infosys', exchange: 'NSE', type: 'Common Stock' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', exchange: 'NSE', type: 'Common Stock' },
    { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE', type: 'Common Stock' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', exchange: 'NSE', type: 'Common Stock' },
    { symbol: 'ITC', name: 'ITC Limited', exchange: 'NSE', type: 'Common Stock' },
    { symbol: 'LT', name: 'Larsen & Toubro', exchange: 'NSE', type: 'Common Stock' },
    { symbol: 'AXISBANK', name: 'Axis Bank', exchange: 'NSE', type: 'Common Stock' }
  ];

  const queryLower = query.toLowerCase();
  return commonStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(queryLower) ||
    stock.name.toLowerCase().includes(queryLower)
  );
};

export const getStockQuote = async (symbol: string): Promise<StockQuote | null> => {
  try {
    const yahooSymbol = mapToYahooSymbol(symbol);
    
    // Using Yahoo Finance public API
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`
    );

    if (!response.ok) throw new Error('Quote fetch failed');

    const data = await response.json();
    const result = data.chart?.result?.[0];
    
    if (!result) throw new Error('No data');

    const meta = result.meta;
    const quote = result.indicators?.quote?.[0];

    return {
      symbol: symbol,
      name: meta.symbol,
      price: meta.regularMarketPrice || 0,
      change: meta.regularMarketPrice - meta.previousClose || 0,
      changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100) || 0,
      volume: quote?.volume?.[0] || 0,
      marketCap: meta.marketCap
    };
  } catch (error) {
    console.error('Quote fetch error:', error);
    return null;
  }
};

export const getStockDetails = async (symbol: string): Promise<StockDetails | null> => {
  try {
    const yahooSymbol = mapToYahooSymbol(symbol);
    
    // Fetch quote data with timeout
    const quoteController = new AbortController();
    const quoteTimeout = setTimeout(() => quoteController.abort(), 10000);
    
    const quoteResponse = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`,
      { signal: quoteController.signal }
    );
    clearTimeout(quoteTimeout);

    if (!quoteResponse.ok) {
      console.error('Quote fetch failed:', quoteResponse.status);
      return getFallbackStockDetails(symbol);
    }

    const quoteData = await quoteResponse.json();
    const result = quoteData.chart?.result?.[0];
    const meta = result?.meta;

    if (!meta || !meta.regularMarketPrice) {
      console.error('No quote data available');
      return getFallbackStockDetails(symbol);
    }

    // Fetch fundamental data (with fallback if fails)
    let fundamentals: any = {};
    try {
      const fundamentalsController = new AbortController();
      const fundamentalsTimeout = setTimeout(() => fundamentalsController.abort(), 10000);
      
      const fundamentalsResponse = await fetch(
        `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${yahooSymbol}?modules=defaultKeyStatistics,financialData,summaryProfile`,
        { signal: fundamentalsController.signal }
      );
      clearTimeout(fundamentalsTimeout);

      if (fundamentalsResponse.ok) {
        const fundamentalsData = await fundamentalsResponse.json();
        fundamentals = fundamentalsData.quoteSummary?.result?.[0] || {};
      }
    } catch (error) {
      console.warn('Fundamentals fetch failed, using defaults:', error);
    }

    const keyStats = fundamentals.defaultKeyStatistics || {};
    const financialData = fundamentals.financialData || {};
    const profile = fundamentals.summaryProfile || {};

    const sector = inferSector(profile.industry || profile.sector || '');

    return {
      symbol: symbol,
      name: meta.longName || meta.symbol || symbol,
      sector: sector,
      industry: profile.industry || profile.sector || 'Unknown',
      currentPrice: meta.regularMarketPrice || 0,
      peRatio: keyStats.trailingPE?.raw || keyStats.forwardPE?.raw || 20,
      debtEquity: financialData.debtToEquity?.raw || 0.5,
      roe: (financialData.returnOnEquity?.raw || 0.15) * 100,
      beta: keyStats.beta?.raw || 1.0,
      marketCap: meta.marketCap || 0,
      volume: meta.regularMarketVolume || 0,
      change: (meta.regularMarketPrice - meta.previousClose) || 0,
      changePercent: (((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100) || 0
    };
  } catch (error) {
    console.error('Stock details fetch error:', error);
    return getFallbackStockDetails(symbol);
  }
};

// Fallback stock details with reasonable defaults
const getFallbackStockDetails = (symbol: string): StockDetails => {
  return {
    symbol: symbol,
    name: symbol,
    sector: 'IT',
    industry: 'Unknown',
    currentPrice: 100,
    peRatio: 20,
    debtEquity: 0.5,
    roe: 15,
    beta: 1.0,
    marketCap: 0,
    volume: 0,
    change: 0,
    changePercent: 0
  };
};

// Cache for stock data (5 minutes)
const stockCache = new Map<string, { data: StockDetails; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getStockDetailsWithCache = async (symbol: string): Promise<StockDetails | null> => {
  const cached = stockCache.get(symbol);
  const now = Date.now();

  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }

  const data = await getStockDetails(symbol);
  if (data && data.currentPrice > 0) {
    stockCache.set(symbol, { data, timestamp: now });
  }

  return data;
};

// Batch update prices for portfolio
export const updatePortfolioPrices = async (symbols: string[]): Promise<Map<string, number>> => {
  const priceMap = new Map<string, number>();

  try {
    // Fetch all quotes in parallel
    const quotes = await Promise.all(
      symbols.map(symbol => getStockQuote(symbol))
    );

    quotes.forEach((quote, index) => {
      if (quote) {
        priceMap.set(symbols[index], quote.price);
      }
    });
  } catch (error) {
    console.error('Batch price update error:', error);
  }

  return priceMap;
};
