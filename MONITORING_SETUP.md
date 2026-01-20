# Monitoring Setup Guide

## Overview

This guide covers setting up monitoring for Shuleyetu using industry-standard tools for error tracking, performance monitoring, and uptime tracking.

## Error Tracking with Sentry

### Setup

1. Create Sentry account at https://sentry.io
2. Create new project for Shuleyetu
3. Add DSN to environment variables

### Configuration

Sentry is already integrated in `next.config.mjs` and `sentry.config.ts`.

### Monitoring

- **Error Dashboard**: https://sentry.io/organizations/your-org/issues/
- **Performance**: Monitor transaction traces
- **Releases**: Track errors by version
- **Alerts**: Set up notifications for critical errors

### Key Metrics to Monitor

- Error rate (target: < 0.1%)
- Response time (target: < 200ms p95)
- Failed transactions
- User impact

## Uptime Monitoring

### Health Check Endpoint

The application provides a health check endpoint at `/api/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2026-01-21T12:00:00Z",
  "uptime": 3600,
  "responseTime": "45ms",
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": "ok",
    "api": "ok"
  }
}
```

### Setup Uptime Monitoring

Use services like:
- **UptimeRobot**: https://uptimerobot.com
- **Pingdom**: https://www.pingdom.com
- **StatusPage.io**: https://www.statuspage.io

Configure to check `/api/health` every 5 minutes.

## Performance Monitoring

### Metrics to Track

1. **API Response Times**
   - Target: < 200ms (p95)
   - Monitor by endpoint
   - Track database query times

2. **Page Load Times**
   - Target: < 3s
   - Monitor Core Web Vitals
   - Track by page

3. **Database Performance**
   - Query execution time
   - Index usage
   - Connection pool status

### Tools

- **Vercel Analytics**: Built-in for Vercel deployments
- **New Relic**: https://newrelic.com
- **Datadog**: https://www.datadoghq.com
- **Grafana**: https://grafana.com

## Application Monitoring

### Logs

Monitor application logs for:
- Errors and exceptions
- Rate limiting events
- CSRF validation failures
- Database connection issues

### Alerts

Set up alerts for:
- Error rate > 1%
- Response time > 500ms
- Database connection failures
- Rate limit exceeded (> 10 times/min)
- Sentry critical errors

## Database Monitoring

### Supabase Dashboard

Monitor at https://app.supabase.com:

- Query performance
- Connection count
- Storage usage
- Backup status

### Key Metrics

- Active connections
- Query execution time
- Slow queries
- Index usage

## Rate Limiting Monitoring

Monitor rate limiting events:

```bash
# Check rate limit headers
curl -i https://your-domain.com/api/health | grep X-RateLimit
```

Expected headers:
- `X-RateLimit-Limit`: 100
- `X-RateLimit-Remaining`: 99
- `X-RateLimit-Reset`: 1234567890

## Notification Setup

### Slack Integration

1. Create Slack workspace
2. Set up webhooks for alerts
3. Configure in monitoring tools

### Email Alerts

Configure email notifications for:
- Critical errors
- Uptime issues
- Performance degradation
- Security alerts

## Dashboard Setup

### Recommended Dashboards

1. **Overview Dashboard**
   - Uptime status
   - Error rate
   - Response times
   - Active users

2. **Performance Dashboard**
   - API response times by endpoint
   - Database query times
   - Page load times
   - Core Web Vitals

3. **Error Dashboard**
   - Error rate trend
   - Top errors
   - Error by page
   - User impact

4. **Business Dashboard**
   - Order count
   - Revenue
   - Active vendors
   - Customer satisfaction

## Incident Response

### Alert Severity Levels

- **Critical**: Service down, data loss risk
- **High**: Significant performance degradation
- **Medium**: Minor issues, user impact
- **Low**: Informational alerts

### Response Procedures

1. **Critical Alert**
   - Immediate notification
   - Page on-call engineer
   - Start incident response
   - Communicate with users

2. **High Alert**
   - Notify team
   - Investigate within 15 minutes
   - Implement fix or workaround
   - Monitor resolution

3. **Medium Alert**
   - Log issue
   - Investigate within 1 hour
   - Plan fix
   - Schedule for next release

4. **Low Alert**
   - Log for review
   - Batch fixes for next release

## Monitoring Checklist

- [ ] Sentry configured and receiving errors
- [ ] Uptime monitoring set up
- [ ] Health check endpoint verified
- [ ] Performance monitoring active
- [ ] Database monitoring enabled
- [ ] Alerts configured
- [ ] Slack/Email notifications working
- [ ] Dashboards created
- [ ] On-call rotation established
- [ ] Incident response plan documented
