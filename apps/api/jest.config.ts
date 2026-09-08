import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        tsconfig: {
          module: "CommonJS",
          moduleResolution: "Node",
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          esModuleInterop: true,
        },
      },
    ],
  },
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@expense-tracker/database$": "<rootDir>/test/database-stub.ts",
    "^@expense-tracker/validation$":
      "<rootDir>/../../packages/validation/src/index.ts",
    "^@expense-tracker/types$": "<rootDir>/../../packages/types/src/index.ts",
  },
};

export default config;
