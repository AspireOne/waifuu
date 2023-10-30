import { generateOpenApiDocument } from "trpc-openapi";
import { appRouter } from "@/server/routers/root";

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "tRPC OpenAPI",
  version: "1.0.0",
  baseUrl: "http://localhost:3000",
});

//const server = http.createServer(createOpenApiHttpHandler({ router: appRouter })); /* 👈 */

//server.listen(3000);
