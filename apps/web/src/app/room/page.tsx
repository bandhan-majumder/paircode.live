import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@paircode/auth";

async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session?.user || !session.user.id) {
    redirect("/login");
  }

  redirect("/");
}

export default Page