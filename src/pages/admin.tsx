import { PageDescription } from "@components/PageDescription";
import { PageTitle } from "@components/PageTitle";
import { PublicPage } from "@components/PublicPage";
import Title from "@components/ui/Title";
import { api } from "@lib/api";
import { paths } from "@lib/paths";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Button, Spacer } from "@nextui-org/react";
import { Spinner } from "@nextui-org/spinner";
import { useSession } from "@providers/SessionProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminPage() {
  const session = useSession();
  const router = useRouter();
  const [loadingMail, setLoadingMail] = useState<string | undefined>();

  const { data: isAdmin, status } = api.auth.isAdmin.useQuery(undefined, {
    enabled: session.status === "authenticated",
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const acceptRequestMutation = api.earlyAccess.accept.useMutation({
    onMutate: (variables) => {
      setLoadingMail(variables.email);
    },
    onSuccess: () => {
      toast("Accepted", { type: "success" });
      requests.refetch();
    },
    onError: (e) => {
      toast(`Error: ${e.message}`, { type: "error" });
    },
    onSettled: () => {
      setLoadingMail(undefined);
    },
  });

  const requests = api.earlyAccess.getAll.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });

  useEffect(() => {
    if (session.status === "unauthenticated" || (status !== "loading" && !isAdmin)) {
      router.replace(paths.login());
    }
  }, [session, session.status, status, isAdmin]);

  if (status !== "success" || session.status !== "authenticated" || isAdmin !== true) {
    return (
      /*TODO: noindex*/
      <PublicPage
        description={""}
        title={"Loading..."}
        className={"flex flex-col justify-center text-center"}
      >
        <Spinner size={"lg"} />
      </PublicPage>
    );
  }

  function handleAcceptRequest(email: string) {
    acceptRequestMutation.mutate({ email });
  }

  return (
    <PublicPage disableXPadding description={""} title={"Admin Panel"}>
      <div className="flex flex-col items-center text-center">
        <PageTitle>Admin Panel</PageTitle>
        <PageDescription>Manage everything. U are god.</PageDescription>
      </div>

      <Spacer y={10} />
      <Card className={""}>
        <CardHeader>
          <Title size={"lg"}>Access Requests</Title>
        </CardHeader>
        <CardBody>
          <div className={"flex flex-row overflow-x-scroll gap-4 px-10"}>
            {requests.data?.map((request) => (
              <Card
                key={request.email}
                className={`min-w-min bg-content2 p-4 ${request.granted && "bg-success/10"}`}
              >
                <CardHeader>
                  <p className={"text-foreground-500"}>{request.email}</p>
                </CardHeader>
                <CardBody>
                  <p>name: {request.name}</p>
                  <p>age: {request.age}</p>
                  <p>heard by: {request.hearAboutUs}</p>
                  <Spacer y={3} />
                  <p className={"text-foreground-500"}>
                    at {request.createdAt.toLocaleDateString()}
                  </p>
                </CardBody>
                <CardFooter className={"w-full"}>
                  {!request.granted && (
                    <div className={"flex flex-row justify-between w-full"}>
                      <Button
                        onClick={() => handleAcceptRequest(request.email)}
                        size={"sm"}
                        className={""}
                        color={"success"}
                        isLoading={loadingMail === request.email}
                      >
                        Accept
                      </Button>
                      {/*<Button size={"sm"} className={""} color={"danger"} variant={"ghost"} isLoading={loadingMail === request.email}>
                      Reject
                    </Button>*/}
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>
    </PublicPage>
  );
}
