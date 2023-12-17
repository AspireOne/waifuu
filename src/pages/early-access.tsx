import {
  RequestEarlyAccessFormValues,
  requestEarlyAccessFormValues,
} from "@/server/shared/requestEarlyAccessFormValuesSchema";
import { useEarlyAccessStore } from "@/stores";
import { PageDescription } from "@components/PageDescription";
import { PageTitle } from "@components/PageTitle";
import { PublicPage } from "@components/PublicPage";
import Title from "@components/ui/Title";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@lib/api";
import { Trans, t } from "@lingui/macro";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function EarlyAccess() {
  const { requested } = useEarlyAccessStore();

  return (
    <PublicPage title={t`Request Access`} description={t`Request acess`}>
      <div className="flex flex-col items-center space-y-4 text-center mb-20">
        <PageTitle>Waifuu is now in closed beta!</PageTitle>
        <PageDescription>
          <Trans>
            We are officially starting to roll out Waifuu to the public. If you wish to be one
            of the first to try it out, please request access below!
          </Trans>
        </PageDescription>
      </div>

      <div className={"flex flex-col lg:flex-row gap-10 md:gap-10"}>
        <div className={"w-full"}>
          <Title size={"xl"}>What are the conditions?</Title>
          <p className={"whitespace-pre-line"}>
            Along with open access, you will get several paid features for free while Waifuu is
            in beta, along with increased limits. Other than that you will be able to use
            Waifuu fully with all features.{"\n\n"}Oh, and if you happen to spot a bug or have
            a suggestion for improvement while using the app, do let us know using the in-app
            feedback feature!
          </p>
        </div>

        {requested ? <RequestedDiv /> : <EarlyAccessForm />}
      </div>
    </PublicPage>
  );
}

const hearAboutUsOptions = [
  { value: "friends", label: "Friends" },
  { value: "social_media", label: "Social Media" },
  { value: "google_search", label: "Google Search" },
  { value: "advertisement", label: "Ads" },
  { value: "other", label: "Other" },
];

const EarlyAccessForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestEarlyAccessFormValues>({
    resolver: zodResolver(requestEarlyAccessFormValues),
  });
  const { requested, markRequested } = useEarlyAccessStore();

  const [requesting, setRequesting] = React.useState(false);

  const requestMutation = api.earlyAccess.requestEarlyAccess.useMutation({
    onMutate: () => {
      setRequesting(true);
    },
    onSuccess: async (data) => {
      markRequested();

      if (data.alreadyPresent) {
        toast(t`You already are in the early access list!`, { type: "success" });
        return;
      }
    },
    onSettled: () => {
      setRequesting(false);
    },
  });

  const onSubmit: SubmitHandler<RequestEarlyAccessFormValues> = (data) => {
    requestMutation.mutate(data);
  };

  return (
    <form
      aria-disabled={requested}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-4 w-full"
    >
      <Input
        disabled={requested}
        {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
        id="email"
        type="email"
        placeholder="Your email*"
        errorMessage={errors.email?.message}
      />

      <Input
        disabled={requested}
        {...register("name", { required: "Name is required" })}
        id="name"
        type="text"
        placeholder="Your name*"
        errorMessage={errors.name?.message}
      />

      <div className={"flex flex-row gap-4"}>
        <Input
          disabled={requested}
          {...register("age", { required: "This is required" })}
          id="age"
          className={"max-w-[40%]"}
          type="number"
          placeholder="Your age (optional)"
          errorMessage={errors.age?.message}
        />

        <Select
          disabled={requested}
          id="hearAboutUs"
          label={t`How did you hear about us?*`}
          errorMessage={errors.hearAboutUs?.message}
          {...register("hearAboutUs", { required: "This is required" })}
        >
          {hearAboutUsOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <Button
        type="submit"
        color={requested ? "success" : "secondary"}
        isLoading={requesting}
        isDisabled={requested}
      >
        {requested ? <Trans>Requested!</Trans> : <Trans>Request Access</Trans>}
      </Button>
    </form>
  );
};

const RequestedDiv = () => {
  return (
    <Card className={"w-full"}>
      <CardHeader>
        <Title size={"lg"} className={"flex flex-row justify-center mx-auto text-primary"}>
          Access requested
        </Title>
      </CardHeader>
      <CardBody className={"pb-10"}>
        <p className={"text-center mx-14 italic"}>
          <Trans>
            You have successfuly requested to join. We will inform you via e-mail when you are
            accepted!
          </Trans>
        </p>
      </CardBody>
    </Card>
  );
};
