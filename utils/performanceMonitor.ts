// Performance monitoring utilities for lazy loading
import React from 'react';

export interface RouteLoadTime {
  route: string;
  loadTime: number;
  timestamp: number;
}

class PerformanceMonitor {
  private routeLoadTimes: RouteLoadTime[] = [];
  private startTimes: Map<string, number> = new Map();

  // Start timing a route load
  startRouteLoad(route: string): void {
    this.startTimes.set(route, performance.now());
  }

  // End timing a route load
  endRouteLoad(route: string): void {
    const startTime = this.startTimes.get(route);
    if (startTime) {
      const loadTime = performance.now() - startTime;
      this.routeLoadTimes.push({
        route,
        loadTime,
        timestamp: Date.now()
      });
      this.startTimes.delete(route);
      
      // Log performance in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 Route "${route}" loaded in ${loadTime.toFixed(2)}ms`);
      }
    }
  }

  // Get average load time for a route
  getAverageLoadTime(route: string): number {
    const routeLoads = this.routeLoadTimes.filter(r => r.route === route);
    if (routeLoads.length === 0) return 0;
    
    const totalTime = routeLoads.reduce((sum, load) => sum + load.loadTime, 0);
    return totalTime / routeLoads.length;
  }

  // Get all route performance data
  getPerformanceReport(): { [route: string]: { average: number; count: number } } {
    const report: { [route: string]: { average: number; count: number } } = {};
    
    const routeGroups = this.routeLoadTimes.reduce((groups, load) => {
      if (!groups[load.route]) {
        groups[load.route] = [];
      }
      groups[load.route].push(load);
      return groups;
    }, {} as { [route: string]: RouteLoadTime[] });

    Object.keys(routeGroups).forEach(route => {
      const loads = routeGroups[route];
      const totalTime = loads.reduce((sum, load) => sum + load.loadTime, 0);
      report[route] = {
        average: totalTime / loads.length,
        count: loads.length
      };
    });

    return report;
  }

  // Clear performance data
  clearData(): void {
    this.routeLoadTimes = [];
    this.startTimes.clear();
  }

  // Log performance report to console
  logPerformanceReport(): void {
    const report = this.getPerformanceReport();
    console.table(report);
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Hook for measuring component load time
export const useRoutePerformance = (routeName: string) => {
  React.useEffect(() => {
    performanceMonitor.startRouteLoad(routeName);
    return () => {
      performanceMonitor.endRouteLoad(routeName);
    };
  }, [routeName]);
};

// Web Vitals monitoring (sessiz mod - sadece ölçüm yapar, console'a yazmaz)
export const measureWebVitals = () => {
  // Metrikleri saklamak için
  const metrics = {
    lcp: 0,
    fid: 0,
    cls: 0
  };
  
  // Measure Largest Contentful Paint (LCP)
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    metrics.lcp = lastEntry.startTime;
    // Sessiz mod - console'a yazmıyoruz
  });
  
  try {
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // LCP not supported
  }

  // Measure First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      const fid = entry.processingStart - entry.startTime;
      metrics.fid = fid;
      // Sessiz mod - console'a yazmıyoruz
    });
  });

  try {
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    // FID not supported
  }

  // Measure Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
    metrics.cls = clsValue;
    // Sessiz mod - console'a yazmıyoruz
  });

  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    // CLS not supported
  }
  
  // Metrikleri window objesine ekle (isteyen erişebilir)
  if (typeof window !== 'undefined') {
    (window as any).__webVitals = metrics;
  }
};

// Initialize performance monitoring (sessiz mod)
measureWebVitals();
