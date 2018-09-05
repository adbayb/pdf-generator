import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const DIST_PATH = path.resolve(__dirname, "../dist");
export const PUBLIC_PATH = path.resolve(__dirname, "../public");
