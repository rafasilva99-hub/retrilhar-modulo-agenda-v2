import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const configAuditPath = join(projectRoot, "docs/audits/admin-config-theme-parity.md");
const uiAuditPath = join(projectRoot, "docs/audits/shadcn-ui-quarantine.md");
const shellPolicyPath = join(projectRoot, "docs/audits/shell-route-policy.md");
const figmaContainmentPath = join(projectRoot, "docs/audits/figma-export-containment.md");
const dependencyQuarantinePath = join(projectRoot, "docs/audits/dependency-quarantine.md");
const readinessPath = join(projectRoot, "docs/audits/admin-alignment-readiness.md");
const componentsConfigPath = join(projectRoot, "components.json");
const packageJsonPath = join(projectRoot, "package.json");
const layoutTypesPath = join(projectRoot, "src/components/layout/types.ts");
const shellMocksPath = join(projectRoot, "src/mocks/shell.ts");
const appPath = join(projectRoot, "src/app/App.tsx");
const agendaAdaptersPath = join(projectRoot, "src/modules/agenda/adapters");
const agendaMockBarrelPath = join(projectRoot, "src/mocks/agenda.ts");
const agendaMockDomainPaths = [
  "src/mocks/agenda/activities.ts",
  "src/mocks/agenda/reservations.ts",
  "src/mocks/agenda/guides.ts",
  "src/mocks/agenda/holidays.ts",
  "src/mocks/agenda/status.ts",
].map((path) => join(projectRoot, path));

function readProjectFile(path: string): string {
  return readFileSync(path, "utf8");
}

describe("Admin alignment audits", () => {
  it("documents theme config parity with Vite-safe divergences", () => {
    expect(existsSync(configAuditPath)).toBe(true);

    const componentsConfig = JSON.parse(readProjectFile(componentsConfigPath)) as {
      readonly style?: string;
      readonly rsc?: boolean;
      readonly iconLibrary?: string;
      readonly menuColor?: string;
      readonly menuAccent?: string;
      readonly tailwind?: { readonly css?: string };
    };
    const auditText = readProjectFile(configAuditPath);

    expect(componentsConfig).toMatchObject({
      style: "radix-luma",
      rsc: false,
      iconLibrary: "hugeicons",
      menuColor: "inverted-translucent",
      menuAccent: "subtle",
      tailwind: { css: "src/styles/index.css" },
    });
    expect(auditText).toContain("Already aligned");
    expect(auditText).toContain("Vite-safe divergence");
    expect(auditText).toContain("Needs implementation");
    expect(auditText).toContain("components.json");
    expect(auditText).toContain("src/styles/index.css");
    expect(auditText).toContain("app/globals.css");
    expect(auditText).toContain("rsc: false");
  });

  it("documents shadcn UI quarantine classifications", () => {
    expect(existsSync(uiAuditPath)).toBe(true);

    const auditText = readProjectFile(uiAuditPath);

    expect(auditText).toContain("aligned");
    expect(auditText).toContain("generated exception");
    expect(auditText).toContain("needs wrapper");
    expect(auditText).toContain("candidate for later replacement");
    expect(auditText).toContain("lucide-react");
    expect(auditText).toContain("next-themes");
    expect(auditText).toContain("@mui/material");
  });

  it("layout contracts stay decoupled from mock data", () => {
    const layoutTypesText = readProjectFile(layoutTypesPath);
    const shellMocksText = readProjectFile(shellMocksPath);

    expect(layoutTypesText).not.toContain("@/mocks/shell");
    expect(layoutTypesText).not.toContain("export type {");
    expect(layoutTypesText).toContain("export type AppPage");
    expect(layoutTypesText).toContain("export interface ShellNavItem");
    expect(layoutTypesText).toContain("export interface ShellProfile");
    expect(layoutTypesText).toContain("export interface ShellOrganization");
    expect(shellMocksText).toContain("@/components/layout/types");
  });

  it("agenda app orchestration lives in the agenda module", () => {
    expect(existsSync(shellPolicyPath)).toBe(true);

    const appText = readProjectFile(appPath);
    const policyText = readProjectFile(shellPolicyPath);

    expect(appText).toContain("AgendaPrototypeApp");
    expect(appText).not.toContain("useAgendaPrototypeNavigation");
    expect(appText).not.toContain("AgendaMonthPage");
    expect(appText).not.toContain("AgendaDayPage");
    expect(policyText).toContain("#agenda");
    expect(policyText).toContain("#agendaDia");
    expect(policyText).toContain("#atualizacoes");
    expect(policyText).toContain("#novaAtividade");
    expect(policyText).toContain("AppShell");
  });

  it("documents Figma export containment behind agenda adapters", () => {
    expect(existsSync(figmaContainmentPath)).toBe(true);

    const auditText = readProjectFile(figmaContainmentPath);
    const adapterTexts = [
      readProjectFile(join(agendaAdaptersPath, "figma-agenda-month-page.tsx")),
      readProjectFile(join(agendaAdaptersPath, "figma-agenda-day-page.tsx")),
      readProjectFile(join(agendaAdaptersPath, "figma-agenda-updates-page.tsx")),
    ];

    expect(auditText).toContain("src/imports/AgendaMes/AgendaMes-13-9535.tsx");
    expect(auditText).toContain("src/imports/AgendaAtividadesDoDia/AgendaAtividadesDoDia.tsx");
    expect(auditText).toContain("src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx");
    expect(auditText).toContain("figma-agenda-month-page.tsx");
    expect(auditText).toContain("figma-agenda-day-page.tsx");
    expect(auditText).toContain("figma-agenda-updates-page.tsx");
    expect(auditText).toContain("Replacement path");
    expect(auditText).toContain("src/modules/agenda/adapters");
    expect(adapterTexts.every((text) => text.includes("Legacy Figma export containment"))).toBe(
      true
    );
  });

  it("keeps agenda mock data split behind the public barrel", () => {
    const barrelText = readProjectFile(agendaMockBarrelPath);

    expect(barrelText).toContain("export { mockActivities");
    expect(barrelText).toContain("export { mockReservations");
    expect(barrelText).toContain("mockGuides");
    expect(barrelText).toContain('from "./agenda/guides"');
    expect(barrelText).toContain("export { allHolidays");
    expect(barrelText).toContain("export { isEligibleForBulkAction");
    expect(agendaMockDomainPaths.every((path) => existsSync(path))).toBe(true);
  });

  it("documents dependency quarantine decisions against package state", () => {
    expect(existsSync(dependencyQuarantinePath)).toBe(true);

    const auditText = readProjectFile(dependencyQuarantinePath);
    const packageJson = JSON.parse(readProjectFile(packageJsonPath)) as {
      readonly dependencies?: Record<string, string>;
    };
    const dependencies = packageJson.dependencies ?? {};

    expect(auditText).toContain("@mui/material");
    expect(auditText).toContain("@mui/icons-material");
    expect(auditText).toContain("@emotion/react");
    expect(auditText).toContain("@emotion/styled");
    expect(auditText).toContain("lucide-react");
    expect(auditText).toContain("next-themes");
    expect(auditText).toContain("generated exception");
    expect(auditText).toContain("Replacement path");
    expect(auditText).toContain("src/components/ui/sonner.tsx");
    expect(dependencies["@mui/material"]).toBeUndefined();
    expect(dependencies["@mui/icons-material"]).toBeUndefined();
    expect(dependencies["@emotion/react"]).toBeUndefined();
    expect(dependencies["@emotion/styled"]).toBeUndefined();
  });

  it("documents final Admin alignment readiness without claiming migration", () => {
    expect(existsSync(readinessPath)).toBe(true);

    const reportText = readProjectFile(readinessPath);

    expect(reportText).toContain("Admin-compatible");
    expect(reportText).toContain("legacy/Figma-contained");
    expect(reportText).toContain("prototype-only");
    expect(reportText).toContain("mock-only");
    expect(reportText).toContain("Retrilhar Admin");
    expect(reportText).toContain("Ready to port");
    expect(reportText).toContain("Must not migrate");
    expect(reportText).toContain("Remaining risks");
    expect(reportText).toContain("Evidence");
    expect(reportText).not.toContain("already migrated into Retrilhar Admin");
    expect(reportText).not.toContain("backend implemented");
  });
});
