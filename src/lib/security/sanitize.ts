const TAG_REGEX = /<[^>]*>?/gm;

export function sanitizeTextInput(value: string) {
  return value.replace(TAG_REGEX, "").trim();
}

export function sanitizeOptionalText(value?: string | null) {
  if (!value) {
    return null;
  }
  const sanitized = sanitizeTextInput(value);
  return sanitized.length ? sanitized : null;
}

