import metaHandler from "@/server/lib/metaHandler";

export default metaHandler.public(() => (_req: unknown, res: any) => {
  throw new Error("Sentry Example API Route Error");
  res.status(200).json({ name: "John Doe" });
});
