import { ZodError } from 'zod';

interface ZodErrorHandlerOptions {
  logLevel?: 'error' | 'warn' | 'info';
  rethrow?: boolean;
  format?: 'detailed' | 'simple';
  customMessage?: string;
}

export const HandleZodError = (options: ZodErrorHandlerOptions = {}) => {
    const {
    logLevel = 'error',
    rethrow = true,
    format = 'detailed',
    customMessage
  } = options;

  return (target: any, propertName: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      try {
        return originalMethod.apply(this, args);
      } catch (error) {
        if (error instanceof ZodError) {
          const messagePrefix = customMessage ? `${customMessage}\n` : 'Zod Validation Error:\n';

          let formattedMessage = '';
          if (format === 'detailed') {
            formattedMessage = error.issues.map(issue =>
              `[${issue.code}] => ${issue.path.join('.')} : ${issue.message}`
            ).join('\n');
          } else {
            formattedMessage = error.issues.map(issue => issue.message).join('; ');
          }

          const finalMessage = messagePrefix + formattedMessage;

          switch (logLevel) {
            case 'warn':
              console.warn(finalMessage);
              break;
            case 'info':
              console.info(finalMessage);
              break;
            case 'error':
            default:
              console.error(finalMessage);
              break;
          }

          if (rethrow) {
            throw error;
          }
        } else {
          throw error;
        }
      }
    };

    return descriptor;
  }
}