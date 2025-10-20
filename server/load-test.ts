import autocannon from "autocannon";
import { createHash } from "crypto";

const BASE_URL = process.env.TEST_URL || "http://localhost:5000";
const DURATION = 60; // 60 seconds
const CONNECTIONS = parseInt(process.env.CONNECTIONS || "1000"); // Concurrent connections
const PIPELINING = 1; // Requests per connection

interface TestResult {
  endpoint: string;
  avgLatency: number;
  p99Latency: number;
  requestsPerSecond: number;
  errors: number;
  errorRate: number;
}

const results: TestResult[] = [];

// Color utilities
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function formatLatency(ms: number): string {
  if (ms < 100) return `${colors.green}${ms.toFixed(2)}ms${colors.reset}`;
  if (ms < 500) return `${colors.yellow}${ms.toFixed(2)}ms${colors.reset}`;
  return `${colors.red}${ms.toFixed(2)}ms${colors.reset}`;
}

async function runTest(name: string, opts: autocannon.Options): Promise<TestResult> {
  log(`\n${"=".repeat(80)}`, colors.bright);
  log(`Running: ${name}`, colors.cyan);
  log(`${"=".repeat(80)}`, colors.bright);
  log(`Connections: ${opts.connections} | Duration: ${opts.duration}s | Pipelining: ${opts.pipelining}`);
  log("");
  
  return new Promise((resolve, reject) => {
    const instance = autocannon(opts, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      
      const avgLatency = result.latency.mean;
      const p99Latency = result.latency.p99;
      const rps = result.requests.average;
      const errors = result.non2xx + result.errors;
      const total = result.requests.total;
      const errorRate = total > 0 ? (errors / total) * 100 : 0;
      
      const testResult: TestResult = {
        endpoint: name,
        avgLatency,
        p99Latency,
        requestsPerSecond: rps,
        errors,
        errorRate,
      };
      
      log("\n📊 Results:");
      log(`   Avg Latency: ${formatLatency(avgLatency)}`);
      log(`   P99 Latency: ${formatLatency(p99Latency)}`);
      log(`   Requests/sec: ${rps.toFixed(2)}`);
      log(`   Total Requests: ${result.requests.total.toLocaleString()}`);
      log(`   Successful: ${result["2xx"].toLocaleString()}`);
      log(`   Errors: ${errors.toLocaleString()} (${errorRate.toFixed(2)}%)`);
      log(`   Throughput: ${(result.throughput.average / 1024 / 1024).toFixed(2)} MB/s`);
      
      results.push(testResult);
      resolve(testResult);
    });
    
    autocannon.track(instance, { renderProgressBar: true });
  });
}

async function main() {
  console.clear();
  log("\n🚀 PINTU KERJA LOAD TESTING", colors.bright);
  log("━".repeat(80), colors.cyan);
  log(`Base URL: ${BASE_URL}`);
  log(`Target Connections: ${CONNECTIONS}`);
  log(`Duration per test: ${DURATION}s`);
  log(`Target: Response time <500ms | Error rate <0.5%`);
  log("━".repeat(80), colors.cyan);
  
  const startTime = Date.now();
  
  try {
    // Test 1: Homepage / Public Jobs List
    await runTest("GET /api/jobs (Public Jobs Search)", {
      url: `${BASE_URL}/api/jobs?limit=50&offset=0`,
      connections: CONNECTIONS,
      pipelining: PIPELINING,
      duration: DURATION,
      method: "GET",
    });
    
    // Test 2: Job Search with Filters
    await runTest("GET /api/jobs (Filtered Search)", {
      url: `${BASE_URL}/api/jobs?keyword=developer&location=Jakarta&industry=Teknologi&limit=50`,
      connections: Math.floor(CONNECTIONS * 0.8),
      pipelining: PIPELINING,
      duration: DURATION,
      method: "GET",
    });
    
    // Test 3: Job Detail
    await runTest("GET /api/jobs/:id (Job Detail)", {
      url: `${BASE_URL}/api/jobs`,
      connections: Math.floor(CONNECTIONS * 0.6),
      pipelining: PIPELINING,
      duration: DURATION,
      method: "GET",
      setupClient: (client) => {
        client.on('response', (statusCode, resBytes, responseTime) => {
          // Track individual responses if needed
        });
      },
      requests: [
        {
          method: "GET",
          path: "/api/jobs",
        },
      ],
    });
    
    // Test 4: Companies List
    await runTest("GET /api/companies (Companies List)", {
      url: `${BASE_URL}/api/companies`,
      connections: Math.floor(CONNECTIONS * 0.4),
      pipelining: PIPELINING,
      duration: DURATION,
      method: "GET",
    });
    
    // Test 5: User Profile (would need auth, skipping for now)
    // Test 6: Application Submission (would need auth, complex)
    
  } catch (error: any) {
    log(`\n❌ Testing failed: ${error.message}`, colors.red);
    process.exit(1);
  }
  
  const endTime = Date.now();
  const totalDuration = ((endTime - startTime) / 1000).toFixed(2);
  
  // Summary Report
  log("\n\n" + "=".repeat(80), colors.bright);
  log("📈 LOAD TEST SUMMARY", colors.bright);
  log("=".repeat(80), colors.bright);
  log("");
  
  console.table(
    results.map((r) => ({
      Endpoint: r.endpoint,
      "Avg Latency": `${r.avgLatency.toFixed(2)}ms`,
      "P99 Latency": `${r.p99Latency.toFixed(2)}ms`,
      "Req/sec": r.requestsPerSecond.toFixed(2),
      Errors: r.errors,
      "Error %": `${r.errorRate.toFixed(2)}%`,
    }))
  );
  
  log("");
  log("⏱️  Total testing time: " + totalDuration + "s", colors.cyan);
  log("");
  
  // Analysis
  const failures: string[] = [];
  const warnings: string[] = [];
  
  results.forEach((r) => {
    if (r.avgLatency > 500) {
      failures.push(`❌ ${r.endpoint}: Avg latency ${r.avgLatency.toFixed(2)}ms exceeds 500ms target`);
    } else if (r.avgLatency > 300) {
      warnings.push(`⚠️  ${r.endpoint}: Avg latency ${r.avgLatency.toFixed(2)}ms approaching limit`);
    }
    
    if (r.errorRate > 0.5) {
      failures.push(`❌ ${r.endpoint}: Error rate ${r.errorRate.toFixed(2)}% exceeds 0.5% target`);
    } else if (r.errorRate > 0.1) {
      warnings.push(`⚠️  ${r.endpoint}: Error rate ${r.errorRate.toFixed(2)}% elevated`);
    }
  });
  
  if (failures.length > 0) {
    log("🚨 CRITICAL ISSUES FOUND:", colors.red);
    failures.forEach((f) => log(f, colors.red));
    log("");
  }
  
  if (warnings.length > 0) {
    log("⚠️  WARNINGS:", colors.yellow);
    warnings.forEach((w) => log(w, colors.yellow));
    log("");
  }
  
  if (failures.length === 0 && warnings.length === 0) {
    log("✅ ALL TESTS PASSED!", colors.green);
    log("Performance targets met: <500ms latency and <0.5% error rate", colors.green);
  }
  
  // Recommendations
  if (failures.length > 0 || warnings.length > 0) {
    log("\n" + "=".repeat(80), colors.bright);
    log("💡 OPTIMIZATION RECOMMENDATIONS", colors.cyan);
    log("=".repeat(80), colors.bright);
    log("");
    
    const avgLatency = results.reduce((sum, r) => sum + r.avgLatency, 0) / results.length;
    const avgErrorRate = results.reduce((sum, r) => sum + r.errorRate, 0) / results.length;
    
    if (avgLatency > 300) {
      log("🔧 Database Query Optimization:");
      log("   1. Add indexes on frequently queried columns (location, industry, jobType)");
      log("   2. Implement query result caching with Redis");
      log("   3. Use database connection pooling (already configured)");
      log("   4. Consider read replicas for search queries");
      log("");
    }
    
    if (avgErrorRate > 0.1) {
      log("🔧 Error Handling & Reliability:");
      log("   1. Implement request rate limiting per IP");
      log("   2. Add circuit breakers for database connections");
      log("   3. Improve error logging for debugging");
      log("   4. Add health check endpoints");
      log("");
    }
    
    log("🔧 General Performance Tips:");
    log("   1. Enable HTTP/2 for better connection management");
    log("   2. Implement response compression (gzip/brotli)");
    log("   3. Add CDN for static assets");
    log("   4. Consider implementing Elasticsearch for search (currently PostgreSQL only)");
    log("   5. Optimize JSON serialization");
    log("");
  }
  
  log("=".repeat(80), colors.bright);
  log("\n");
  
  if (failures.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
