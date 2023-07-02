import { defineConfig } from "unocss";
import transformerCompileClass from "@unocss/transformer-compile-class";

export default defineConfig({
  transformers: [transformerCompileClass()],
});
