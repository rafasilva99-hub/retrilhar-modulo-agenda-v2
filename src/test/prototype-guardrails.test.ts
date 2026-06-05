import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const rulesPath = join(projectRoot, ".claude/rules/agenda-fidelity.md");
const sourceRoot = join(projectRoot, "src");

const forbiddenRuntimePatterns = [
  "better-auth",
  "next-intl",
  "@hey-api",
  "next/link",
  "next/image",
  "OpenAPI",
  "X-Organization-ID",
  "fetch(",
] as const;

function listMaintainedSourceFiles(root: string): readonly string[] {
  const entries = readdirSync(root);
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(root, entry);
    const projectRelativePath = relative(projectRoot, absolutePath);

    if (projectRelativePath.startsWith("src/imports")) continue;
    if (projectRelativePath.startsWith("src/test")) continue;

    const stat = statSync(absolutePath);
    if (stat.isDirectory()) {
      files.push(...listMaintainedSourceFiles(absolutePath));
      continue;
    }

    if (/\.(ts|tsx)$/.test(entry)) files.push(absolutePath);
  }

  return files;
}

describe("prototype guardrails", () => {
  it("keeps Admin read-only rules and forbids backend/runtime imports", () => {
    expect(existsSync(rulesPath)).toBe(true);

    const rulesText = readFileSync(rulesPath, "utf8");
    expect(rulesText).toContain("Retrilhar Admin");
    expect(rulesText).toContain("somente leitura");
    expect(rulesText).toContain("mock-only");
    expect(rulesText).toContain("Next");
    expect(rulesText).toContain("OpenAPI");
    expect(rulesText).toContain("better-auth");

    const violations = listMaintainedSourceFiles(sourceRoot).flatMap((filePath) => {
      const text = readFileSync(filePath, "utf8");
      return forbiddenRuntimePatterns
        .filter((pattern) => text.includes(pattern))
        .map((pattern) => `${relative(projectRoot, filePath)} contains ${pattern}`);
    });

    expect(violations).toEqual([]);
  });
});
