import Page from "~/components/Page";
import { ZodSchema, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Input, Textarea } from "@nextui-org/react";
import useSession from "~/hooks/useSession";
import React, { useEffect, useMemo, useState } from "react";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

const schema: ZodSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Required." })
    .max(16, { message: "Too long." }),
  name: z
    .string()
    .min(3, { message: "Required." })
    .max(80, { message: "Too long." })
    .nullable(),
  email: z
    .string()
    .email({ message: "Invalid." })
    .max(100, { message: "Too long." }),
  bio: z.string().max(500, { message: "Too long." }).nullable(),
  addressedAs: z.string().max(50, { message: "Too long." }).nullable(),
  about: z.string().max(500, { message: "Too long." }).nullable(),
});

export default function Profile() {
  const { user, refetch } = useSession();
  const [usernameAvailable, setUsernameAvailable] = useState<
    undefined | boolean
  >(undefined);

  const updateUserMutation = api.users.updateSelf.useMutation({
    onSuccess: (data) => {
      toast("Profile updated!", { type: "success" });
      refetch();
    },
    onError: (error) => {
      console.error(error);
      toast(error.message, { type: "error" });
    },
  });

  const usernameAvailability = api.users.checkUsernameAvailability.useMutation({
    onSuccess: (data) => {
      setUsernameAvailable(data);
    },
    onError: (error) => {
      console.error(error);
      toast(error.message, { type: "error" });
    },
  });

  // prettier-ignore
  const {register, watch, handleSubmit, getValues, formState: {errors, isDirty, dirtyFields}, reset}
    = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: useMemo(() => {
      return {
        username: user?.username || "",
        name: user?.name || "",
        email: user?.email || "",
        bio: user?.bio || "",
        addressedAs: user?.addressedAs || "",
        about: user?.about || "",
      };
    }, [user]),
  });

  const username = watch("username");

  useEffect(() => {
    setUsernameAvailable(undefined);
  }, [username]);

  useEffect(() => {
    reset(user);
  }, [user]);

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = (
    data: z.infer<typeof schema>,
  ) => {
    updateUserMutation.mutate(data);
  };

  function checkAvailability() {
    console.log("checking:", getValues("username"));
    usernameAvailability.mutate({ username: getValues("username") });
  }

  // TODO: Profile picture...
  return (
    <Page title={"Profile"} showActionBar autoBack={false}>
      <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-4"}>
        <Input
          label={"Username"}
          placeholder={"Username"}
          {...register("username")}
          isInvalid={!!errors.username}
          disabled={!user}
          errorMessage={errors.username?.message as string}
        />
        <Button
          onClick={checkAvailability}
          isDisabled={!dirtyFields.username || usernameAvailability.isLoading}
          size={"sm"}
          className={twMerge("text-left", !dirtyFields.username && "hidden")}
          variant={"flat"}
          color={
            usernameAvailable === undefined || usernameAvailability.isLoading
              ? "default"
              : usernameAvailable
              ? "success"
              : "warning"
          }
        >
          {usernameAvailability.isLoading && "Checking..."}
          {usernameAvailable === undefined && "Check availability"}
          {usernameAvailable === false && "Not available"}
          {usernameAvailable === true && "Available"}
        </Button>
        <Input
          label={"Name"}
          placeholder={"John Doe"}
          {...register("name")}
          isInvalid={!!errors.name}
          disabled={!user}
          errorMessage={errors.name?.message as string}
        />
        <Input
          label={"Email"}
          placeholder={"john.doe@gmail.com"}
          {...register("email")}
          isInvalid={!!errors.email}
          disabled={!user || true} // TODO: Implement email verification.
          errorMessage={errors.email?.message as string}
        />
        <Textarea
          label={"Bio"}
          placeholder={"What is your special skill?"}
          {...register("bio")}
          isInvalid={!!errors.bio}
          disabled={!user}
          errorMessage={errors.bio?.message as string}
        />
        <Input
          label={"Addressed As"}
          placeholder={"Addressed As"}
          {...register("addressedAs")}
          isInvalid={!!errors.addressedAs}
          disabled={!user}
          errorMessage={errors.addressedAs?.message as string}
        />
        <Textarea
          label={"About"}
          placeholder={"What should the bots you chat with know about you?"}
          {...register("about")}
          isInvalid={!!errors.about}
          disabled={!user}
          errorMessage={errors.about?.message as string}
        />

        <Button
          isLoading={updateUserMutation.isLoading}
          isDisabled={!isDirty || updateUserMutation.isLoading}
          type={"submit"}
          variant={"flat"}
        >
          Save Changes
        </Button>
      </form>
    </Page>
  );
}
