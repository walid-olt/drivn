import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["react", "react_perf", "typescript", "unicorn"],
  categories: {
    correctness: "error",
  },
  rules: {
    "no-console": "off",
  },
});
