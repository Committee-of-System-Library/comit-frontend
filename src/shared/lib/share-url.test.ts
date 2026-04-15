import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildPostShareUrl, resolveAppBaseUrl } from "@/shared/lib/share-url";

describe("share-url", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.stubEnv("VITE_APP_BASE_URL", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("uses the current browser origin when app base env is not set", () => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        ...originalLocation,
        origin: "http://localhost:5173",
      },
    });

    expect(resolveAppBaseUrl()).toBe("http://localhost:5173");
    expect(buildPostShareUrl(123)).toBe("http://localhost:5173/post/123");
  });

  it("trims a trailing slash from window origin", () => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        ...originalLocation,
        origin: "https://preview.example.com/",
      },
    });

    expect(resolveAppBaseUrl()).toBe("https://preview.example.com");
  });

  it("falls back to a relative path when no origin is available", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        ...originalLocation,
        origin: "",
      },
    });

    expect(buildPostShareUrl(7)).toBe("/post/7");
    warnSpy.mockRestore();
  });
});
