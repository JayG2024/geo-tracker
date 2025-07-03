// Simple in-memory cache service for API responses
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  // Get cached data if still valid
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.DEFAULT_TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  // Set cache data
  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Clear specific key
  clear(key: string): void {
    this.cache.delete(key);
  }

  // Clear all cache
  clearAll(): void {
    this.cache.clear();
  }

  // Check if key exists and is valid
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() - entry.timestamp > this.DEFAULT_TTL) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Get or fetch with caching
  async getOrFetch<T>(
    key: string, 
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Check cache first
    const cached = this.get<T>(key);
    if (cached !== null) {
      console.log(`Cache hit for ${key}`);
      return cached;
    }
    
    // Fetch new data
    console.log(`Cache miss for ${key}, fetching...`);
    const data = await fetchFn();
    
    // Store in cache
    this.set(key, data);
    
    return data;
  }
}

// Export singleton instance
export const cacheService = new CacheService();