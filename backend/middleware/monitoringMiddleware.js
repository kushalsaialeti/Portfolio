let responseMetrics = {
  totalRequests: 0,
  avgResponseTime: 0,
  totalResponseTime: 0,
};

// Monitor middleware to track performance
const monitoringMiddleware = (req, res, next) => {
  const startTime = Date.now();

  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;
    
    responseMetrics.totalRequests++;
    responseMetrics.totalResponseTime += duration;
    responseMetrics.avgResponseTime = Math.round(
      responseMetrics.totalResponseTime / responseMetrics.totalRequests
    );

    res.set('X-Response-Time', `${duration}ms`);
    return originalSend.call(this, data);
  };

  next();
};

// Performance stats endpoint
const performanceStatsEndpoint = (req, res) => {
  const memUsage = process.memoryUsage();
  res.json({
    requests: responseMetrics.totalRequests,
    avgResponseTime: `${responseMetrics.avgResponseTime}ms`,
    memoryUsage: {
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
    },
  });
};

// Memory monitor to warn on high usage
const memoryMonitor = () => {
  setInterval(() => {
    const memUsage = process.memoryUsage();
    const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    
    if (heapUsedPercent > 80) {
      console.warn(`⚠️  High memory usage: ${heapUsedPercent.toFixed(2)}%`);
    }
  }, 60000); // Check every minute
};

module.exports = {
  monitoringMiddleware,
  performanceStatsEndpoint,
  memoryMonitor,
};
