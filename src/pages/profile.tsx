import Page from "~/components/Page";
import { ZodSchema, z, isDirty } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, UseFormRegisterReturn } from "react-hook-form";
import { Avatar, Button, Input, Textarea } from "@nextui-org/react";
import { useSession } from "~/hooks/useSession";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { api } from "~/lib/api";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import updateSelfSchema from "~/server/types/updateSelfSchema";
import { User } from "@prisma/client";

export default function Profile() {
  const { user, refetch } = useSession();

  const updateUserMutation = api.users.updateSelf.useMutation({
    onSuccess: (data) => {
      toast("Profile updated!", { type: "success" });
      refetch();
    },
    onError: (error) => {
      toast(error.message, { type: "error" });
    },
  });

  const {
    register,
    watch,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<z.infer<typeof updateSelfSchema>>({
    resolver: zodResolver(updateSelfSchema),
    mode: "all",
    defaultValues: useMemo(() => getCurrentUserValues(), [user]),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUrl = watch("imageUrl");
  const username = watch("username");

  useEffect(() => reset(getCurrentUserValues()), [user]);

  function getCurrentUserValues() {
    return {
      username: user?.username || "",
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      addressedAs: user?.addressedAs || "",
      about: user?.about || "",
      imageUrl: user?.image || "",
    };
  }

  const onSubmit: SubmitHandler<z.infer<typeof updateSelfSchema>> = (
    data: z.infer<typeof updateSelfSchema>,
  ) => {
    // Upload the raw image to storage, get the URL, and use that url.
    const rawUrl = data.imageUrl;

    updateUserMutation.mutate(data);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("imageUrl", reader.result as string);
      };
      reader.readAsDataURL(file!);
    }
  };

  return (
    <Page title={"Profile"} showActionBar autoBack={false}>
      <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-4"}>
        <Avatar
          onClick={() => fileInputRef.current?.click()}
          isBordered
          className={
            "mx-auto h-32 w-auto aspect-square hover:cursor-pointer hover:opacity-80 duration-150"
          }
          src={imageUrl ?? "/assets/default_user.jpg"}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          style={{ display: "none" }}
          accept="image/*"
        />
        <UsernameInput
          register={register}
          isInvalid={!!errors.username}
          disabled={!user}
          errorMessage={errors.username?.message as string}
          value={username}
          isDirty={!!dirtyFields.username}
        />
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

function UsernameInput(props: {
  isInvalid: boolean;
  errorMessage?: string;
  disabled: boolean;
  isDirty: boolean;
  value?: string;
  register: (name: "username") => UseFormRegisterReturn;
}) {
  const [usernameAvailable, setUsernameAvailable] = useState<
    undefined | boolean
  >(undefined);

  useEffect(() => setUsernameAvailable(undefined), [props.value]);

  const usernameAvailability = api.users.checkUsernameAvailability.useMutation({
    onSuccess: (data) => {
      setUsernameAvailable(data);
    },
    onError: (error) => {
      toast(error.message, { type: "error" });
    },
  });

  function checkAvailability() {
    if (!props.value) return;
    usernameAvailability.mutate({ username: props.value });
  }

  return (
    <>
      <Input
        label={"Username"}
        placeholder={"Username"}
        {...props.register("username")}
        isInvalid={props.isInvalid}
        disabled={props.disabled}
        errorMessage={props.errorMessage}
      />

      <Button
        onClick={checkAvailability}
        isDisabled={
          !props.isDirty || usernameAvailability.isLoading || props.isInvalid
        }
        size={"sm"}
        className={twMerge("text-left", !props.isDirty && "hidden")}
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
    </>
  );
}
