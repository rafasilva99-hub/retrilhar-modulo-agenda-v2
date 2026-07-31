declare module "@frontman-ai/vite" {
  import type { PluginOption } from "vite";

  export type FrontmanViteOptions = {
    readonly projectRoot?: string;
    readonly sourceRoot?: string;
    readonly basePath?: string;
    readonly host?: string;
    readonly serverName?: string;
    readonly serverVersion?: string;
    readonly clientUrl?: string;
    readonly clientCssUrl?: string;
    readonly entrypointUrl?: string;
    readonly isLightTheme?: boolean;
    readonly isDev?: boolean;
  };

  export function frontmanPlugin(options?: FrontmanViteOptions): PluginOption[];
}
