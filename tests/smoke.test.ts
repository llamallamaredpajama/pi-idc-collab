import { describe, expect, test } from "bun:test";

const readJson = async <T>(path: string): Promise<T> => {
  const file = Bun.file(path);
  expect(await file.exists()).toBe(true);
  return JSON.parse(await file.text()) as T;
};

describe("Phase 0 Bun/TypeScript scaffold", () => {
  test("declares the package test script and strict TypeScript settings", async () => {
    const pkg = await readJson<{ private: boolean; type: string; scripts: Record<string, string> }>("package.json");
    expect(pkg.private).toBe(true);
    expect(pkg.type).toBe("module");
    expect(pkg.scripts.test).toBe("bun test");

    const tsconfig = await readJson<{ compilerOptions: Record<string, unknown> }>("tsconfig.json");
    expect(tsconfig.compilerOptions.strict).toBe(true);
    expect(tsconfig.compilerOptions.noEmit).toBe(true);
    expect(tsconfig.compilerOptions.moduleResolution).toBe("Bundler");
  });
});
