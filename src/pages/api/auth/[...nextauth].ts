import NextAuth from "next-auth";

import { authOptions } from "~/server/lib/auth";
import handlerWithCors from "~/pages/api/handlerWithCors";

export default handlerWithCors(NextAuth(authOptions));
