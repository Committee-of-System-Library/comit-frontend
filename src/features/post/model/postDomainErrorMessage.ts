import {
  normalizePostDomainError,
  type PostDomainError,
} from "./postDomainError";

interface PostDomainErrorMessagePreset {
  auth?: string;
  conflict?: string | ((error: PostDomainError) => string);
  default: string;
  forbidden?: string;
  notFound?: string;
  validation?: string | ((error: PostDomainError) => string);
}

const resolveFromPreset = (
  value: PostDomainErrorMessagePreset["validation"],
  error: PostDomainError,
) => {
  if (typeof value === "function") {
    return value(error);
  }

  return value;
};

export const resolvePostDomainErrorMessage = (
  error: unknown,
  preset: PostDomainErrorMessagePreset,
) => {
  const normalizedError = normalizePostDomainError(error);

  switch (normalizedError.kind) {
    case "auth":
      return preset.auth ?? normalizedError.message ?? preset.default;
    case "forbidden":
      return preset.forbidden ?? normalizedError.message ?? preset.default;
    case "not_found":
      return preset.notFound ?? normalizedError.message ?? preset.default;
    case "validation": {
      const validationMessage = resolveFromPreset(
        preset.validation,
        normalizedError,
      );
      return validationMessage ?? normalizedError.message ?? preset.default;
    }
    case "conflict": {
      const conflictMessage = resolveFromPreset(
        preset.conflict,
        normalizedError,
      );
      return conflictMessage ?? normalizedError.message ?? preset.default;
    }
    default:
      return normalizedError.message || preset.default;
  }
};
