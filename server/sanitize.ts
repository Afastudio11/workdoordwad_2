import DOMPurify from 'isomorphic-dompurify';

export interface SanitizeOptions {
  allowHtml?: boolean;
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
}

const defaultAllowedTags = ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'];
const defaultAllowedAttributes = {
  'a': ['href', 'title', 'target'],
  '*': ['class']
};

export function sanitizeHtml(input: string, options: SanitizeOptions = {}): string {
  if (!input) return '';

  const config: any = {
    ALLOWED_TAGS: options.allowedTags || defaultAllowedTags,
    ALLOWED_ATTR: options.allowedAttributes || defaultAllowedAttributes,
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    RETURN_TRUSTED_TYPE: false,
  };

  return DOMPurify.sanitize(input, config) as unknown as string;
}

export function sanitizePlainText(input: string): string {
  if (!input) return '';
  
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    RETURN_TRUSTED_TYPE: false,
  }) as unknown as string;
}

export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  htmlFields: string[] = [],
  plainTextFields: string[] = []
): T {
  const sanitized = { ...obj } as Record<string, any>;

  for (const field of htmlFields) {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeHtml(sanitized[field]);
    }
  }

  for (const field of plainTextFields) {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizePlainText(sanitized[field]);
    }
  }

  return sanitized as T;
}
