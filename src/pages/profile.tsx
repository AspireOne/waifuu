import { useSession } from "@/hooks/useSession";
import { api } from "@/lib/api";

import updateSelfSchema from "@/server/shared/updateSelfSchema";
import { AppPage } from "@components/AppPage";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocaleCode, changeAndSaveGlobalLocale, getLocale, locales } from "@lib/i18n";
import { paths } from "@lib/paths";
import { Trans, t } from "@lingui/macro";
import { Avatar, Button, Input, Link, Select, SelectItem, Textarea } from "@nextui-org/react";
import { User } from "@prisma/client";
import NextLink from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SubmitHandler, UseFormRegisterReturn, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export default function Profile() {
  const { user, refetch } = useSession();

  const updateUserMutation = api.users.updateSelf.useMutation({
    onSuccess: (data) => {
      toast(t`Profile updated!`, { type: "success" });
      refetch();
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
    defaultValues: useMemo(() => getCurrentUserValues(user), [user]),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUrl = watch("imageUrl");
  const username = watch("username");

  useEffect(() => reset(getCurrentUserValues(user)), [user, reset]);

  function getCurrentUserValues(user?: User | null) {
    return {
      username: user?.username || "",
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      addressedAs: user?.addressedAs || "",
      botContext: user?.botContext || "",
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

  async function onlanguageSelected(e: React.ChangeEvent<HTMLSelectElement>) {
    const locale = e.target.value;
    await changeAndSaveGlobalLocale(locale as LocaleCode);
    toast(t`Language successfully changed`, { type: "success" });
  }

  return (
    /*TODO: Change to false when action bar is again implemented.*/
    <AppPage title={t`Profile`}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={"flex md:w-[600px] mx-auto flex-col gap-4"}
      >
        <div className={"flex flex-col gap-3 items-center justify-center"}>
          <Avatar
            onClick={() => fileInputRef.current?.click()}
            isBordered
            className={
              "mx-auto h-32 w-auto aspect-square hover:cursor-pointer hover:opacity-80 duration-150"
            }
            src={imageUrl ?? undefined}
          />
          {user?.plan && (
            <Link
              as={NextLink}
              isBlock
              showAnchorIcon
              href={paths.pricing}
              className={"text-xl whitespace-pre"}
            >
              <Trans>
                Plan: <b>{user.plan.name}</b>
              </Trans>
            </Link>
          )}
        </div>
        {/*Comment it out for now.*/}
        {/*<input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          style={{ display: "none" }}
          accept="image/*"
        />*/}

        <div className={"flex flex-row gap-4"}>
          <UsernameInput
            register={register}
            isInvalid={!!errors.username}
            disabled={!user}
            errorMessage={errors.username?.message as string}
            value={username}
            isDirty={!!dirtyFields.username}
          />
          <Input
            label={t`Name`}
            placeholder={"John Doe"}
            {...register("name")}
            isInvalid={!!errors.name}
            disabled={!user}
            errorMessage={errors.name?.message as string}
          />
        </div>

        <Input
          label={t`Email`}
          placeholder={"john.doe@gmail.com"}
          {...register("email")}
          isInvalid={!!errors.email}
          disabled={!user || true} // TODO: Implement email verification.
          errorMessage={errors.email?.message as string}
        />
        <Textarea
          label={t`Bio`}
          placeholder={t`What is your special skill?`}
          {...register("bio")}
          isInvalid={!!errors.bio}
          disabled={!user}
          errorMessage={errors.bio?.message as string}
        />
        <Input
          label={t`Addressed As`}
          placeholder={t`How should the character address you?`}
          {...register("addressedAs")}
          isInvalid={!!errors.addressedAs}
          disabled={!user}
          errorMessage={errors.addressedAs?.message as string}
        />
        <Textarea
          label={t`Tell us about yourself`}
          placeholder={t`What should your characters know about you?`}
          {...register("botContext")}
          isInvalid={!!errors.botContext}
          disabled={!user}
          errorMessage={errors.botContext?.message as string}
        />

        <Select
          onChange={onlanguageSelected}
          label={t`Language`}
          defaultSelectedKeys={[getLocale()]}
        >
          {locales.map(({ code, label }) => (
            <SelectItem key={code} value={code}>
              {label}
            </SelectItem>
          ))}
        </Select>

        <Button
          isLoading={updateUserMutation.isLoading}
          isDisabled={!isDirty || updateUserMutation.isLoading}
          type={"submit"}
          variant={"flat"}
        >
          <Trans>Save Changes</Trans>
        </Button>
      </form>
    </AppPage>
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
  const [usernameAvailable, setUsernameAvailable] = useState<undefined | boolean>(undefined);

  useEffect(() => setUsernameAvailable(undefined), [props.value]);

  const usernameAvailability = api.users.checkUsernameAvailability.useMutation({
    onSuccess: (data) => {
      setUsernameAvailable(data);
    },
  });

  function checkAvailability() {
    if (!props.value) return;
    usernameAvailability.mutate({ username: props.value });
  }

  return (
    <div className={"flex flex-col gap-2 w-full"}>
      <Input
        label={t`Username`}
        placeholder={t`Username`}
        {...props.register("username")}
        isInvalid={props.isInvalid}
        disabled={props.disabled}
        errorMessage={props.errorMessage}
      />

      <Button
        onClick={checkAvailability}
        isDisabled={!props.isDirty || usernameAvailability.isLoading || props.isInvalid}
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
    </div>
  );
}
