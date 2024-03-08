import { AppPage } from "@components/AppPage";
import Title from "@components/ui/Title";
import { api } from "@lib/api";
import { paths } from "@lib/paths";
import { t } from "@lingui/macro";
import { CardHeader } from "@nextui-org/card";
import { Avatar, Button, Card, CardBody, Spacer } from "@nextui-org/react";
import Link from "next/link";

const FriendsPage = () => {
  const utils = api.useUtils();
  const { data: friends, isLoading } = api.friends.getAll.useQuery();
  const removeFriend = api.friends.remove.useMutation({
    onSuccess: () => utils.friends.getAll.invalidate(),
  });

  const handleRemoveFriend = async (friendUsername: string) => {
    await removeFriend.mutateAsync({ username: friendUsername });
  };

  return (
    <AppPage backPath={paths.discover} title={t`Friends`}>
      <Spacer y={2} />

      <Card className={"max-w-[700px] mx-auto"}>
        <CardHeader>
          <Title>Friends</Title>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <p>Loading friends...</p>
          ) : friends?.length === 0 ? (
            <p>You have no friends yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {friends?.map((friend) => (
                <Card>
                  <CardBody className={"flex flex-row gap-4"}>
                    <Link href={paths.userProfile(friend.username)}>
                      <Avatar src={friend.image} size="lg" />
                    </Link>
                    <div>
                      <p>{friend.username}</p>
                      <p className={"text-gray-400"}>{friend.bio || friend.name}</p>
                    </div>
                    <Button
                      color={"danger"}
                      size={"sm"}
                      className={"ml-auto mt-auto"}
                      onClick={() => handleRemoveFriend(friend.username)}
                    >
                      Remove
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </AppPage>
  );
};

export default FriendsPage;
