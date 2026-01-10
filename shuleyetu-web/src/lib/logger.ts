export type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function shouldLog(level: LogLevel): boolean {
  const envLevel = (process.env.LOG_LEVEL ?? "info") as LogLevel;
  const order: Record<LogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
  };
  return order[level] >= order[envLevel];
}

export function log(level: LogLevel, message: string, context?: LogContext) {
  if (!shouldLog(level)) return;

  const payload = {
    level,
    message,
    ...(context ? { context } : {}),
    ts: new Date().toISOString(),
  };

  if (level === "error") {
    console.error(payload);
  } else if (level === "warn") {
    console.warn(payload);
  } else {
    console.log(payload);
  }
}

export function logError(message: string, err: unknown, context?: LogContext) {
  const errObj =
    err instanceof Error
      ? { name: err.name, message: err.message, stack: err.stack }
      : { value: err };

  log("error", message, { ...context, error: errObj });
}
