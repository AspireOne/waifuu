import metaHandler from "@/pages/api/metaHandler";

export default metaHandler.public(() => (_req: any, res: any) => {
  throw new Error("Sentry Example API Route Error");
  res.status(200).json({ name: "John Doe" });
});
