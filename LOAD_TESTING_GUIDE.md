# Load Testing Guide

## Overview

Load testing ensures Shuleyetu can handle production traffic and identify performance bottlenecks before launch.

## Tools

### k6 (Recommended)

Modern load testing tool with JavaScript scripting.

**Installation**:
```bash
brew install k6  # macOS
choco install k6  # Windows
apt-get install k6  # Linux
```

### Apache JMeter

GUI-based load testing tool.

**Installation**:
```bash
# Download from https://jmeter.apache.org/download_jmeter.cgi
```

## Load Testing Scenarios

### Scenario 1: Normal Load

- 100 concurrent users
- 5 requests per user
- 30-second ramp-up

**Expected Results**:
- Response time: < 200ms (p95)
- Error rate: 0%
- Throughput: > 50 req/s

### Scenario 2: Peak Load

- 500 concurrent users
- 10 requests per user
- 60-second ramp-up

**Expected Results**:
- Response time: < 500ms (p95)
- Error rate: < 0.1%
- Throughput: > 100 req/s

### Scenario 3: Stress Test

- 1000 concurrent users
- 20 requests per user
- 120-second ramp-up

**Expected Results**:
- System should remain stable
- Error rate: < 1%
- Identify breaking point

## k6 Test Scripts

### Basic Health Check

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  const res = http.get('https://your-domain.com/api/health');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  
  sleep(1);
}
```

### Order Creation Load Test

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 0 },
  ],
};

export default function () {
  const payload = JSON.stringify({
    vendor_id: 'vendor-1',
    customer_name: 'Test Customer',
    customer_phone: '0712345678',
    items: [{ id: 'item-1', quantity: 2 }],
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(
    'https://your-domain.com/api/orders',
    payload,
    params
  );

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(2);
}
```

### Rate Limiting Test

```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 20,
  duration: '30s',
};

export default function () {
  const res = http.get('https://your-domain.com/api/health');
  
  check(res, {
    'status is 200 or 429': (r) => r.status === 200 || r.status === 429,
    'rate limit headers present': (r) => 
      r.headers['x-ratelimit-limit'] && 
      r.headers['x-ratelimit-remaining'],
  });
}
```

## Running Tests

### Local Testing

```bash
# Run basic health check
k6 run tests/load/health-check.js

# Run with results output
k6 run tests/load/health-check.js --out json=results.json

# Run with custom options
k6 run tests/load/health-check.js --vus 50 --duration 5m
```

### Cloud Testing

```bash
# Run on k6 Cloud
k6 cloud tests/load/health-check.js

# View results at https://app.k6.io
```

## Performance Targets

### API Endpoints

| Endpoint | Target (p95) | Target (p99) |
|----------|-------------|-------------|
| GET /api/health | 50ms | 100ms |
| GET /api/orders | 200ms | 500ms |
| POST /api/orders | 300ms | 1000ms |
| GET /api/vendors | 200ms | 500ms |

### Database Queries

| Query | Target |
|-------|--------|
| Simple SELECT | < 50ms |
| JOIN query | < 100ms |
| Aggregation | < 200ms |

### Page Load Times

| Page | Target |
|------|--------|
| Home | < 2s |
| Vendors List | < 3s |
| Order Tracking | < 2s |
| Dashboard | < 3s |

## Analysis

### Metrics to Review

1. **Response Time**
   - Mean
   - Median (p50)
   - p95
   - p99
   - Max

2. **Throughput**
   - Requests per second
   - Bytes per second

3. **Error Rate**
   - HTTP errors (4xx, 5xx)
   - Timeouts
   - Connection errors

4. **Resource Usage**
   - CPU
   - Memory
   - Network bandwidth
   - Database connections

## Bottleneck Identification

### Common Issues

1. **Slow Database Queries**
   - Check query execution plans
   - Add missing indexes
   - Optimize N+1 queries

2. **Rate Limiting**
   - Adjust rate limit thresholds
   - Implement caching
   - Use CDN for static assets

3. **Memory Leaks**
   - Monitor memory usage
   - Check for connection leaks
   - Profile application

4. **CPU Bottlenecks**
   - Optimize algorithms
   - Use caching
   - Implement load balancing

## Load Testing Checklist

- [ ] k6 installed
- [ ] Test scripts created
- [ ] Local testing completed
- [ ] Performance targets met
- [ ] Bottlenecks identified
- [ ] Fixes implemented
- [ ] Cloud testing completed
- [ ] Results documented
- [ ] Team reviewed results
- [ ] Ready for production

## Continuous Load Testing

### Scheduled Tests

Run load tests:
- Before each release
- Weekly in production
- After major changes
- During peak hours

### Monitoring

- Track performance trends
- Alert on degradation
- Compare with baseline
- Document changes
