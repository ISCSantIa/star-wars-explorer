import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    documents: ["src/graphql/queries/**/*.graphql"],
    ignoreNoDocuments: true,
    generates: {
        "./src/graphql/generated/": {
            preset: "client",
            plugins: [],
        },
    },
};

export default config;