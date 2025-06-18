import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This resolves paths relative to the project root
export const resolveRoot = (...segments) => {
  return path.resolve(__dirname, "..", ...segments);
};
