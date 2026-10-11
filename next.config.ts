import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // self-contained server in .next/standalone for the Docker image
  output: "standalone",
  // DATA_DIR is resolved from process.cwd(), so tracing would copy the local database into the build;
  // the bank JSON is imported and bundled, nothing under data/ is needed at runtime
  outputFileTracingExcludes: { "/*": ["./data/**/*"] },
};

export default nextConfig;
