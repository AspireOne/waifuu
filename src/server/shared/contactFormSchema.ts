import * as z from "zod";

export default z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});
