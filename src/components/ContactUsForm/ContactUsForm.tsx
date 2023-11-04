import contactFormSchema from "@/server/shared/contactFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@lib/api";
import { Trans, t } from "@lingui/macro";
import { Button, Input, Textarea } from "@nextui-org/react";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import * as z from "zod";

type FormValues = z.infer<typeof contactFormSchema>;

export const ContactUsForm = (props: { className?: string }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const formMutation = api.contact.submitContactForm.useMutation({
    onSuccess: () => {
      toast.success(t`Form submitted!`);
    },
    onError: (err) => {},
  });

  const onSubmit = (data: FormValues) => {
    return formMutation.mutateAsync(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={twMerge("space-y-4 w-full", props.className)}
    >
      <Input
        {...register("name")}
        placeholder={t`Enter your name`}
        disabled={isSubmitting || isSubmitSuccessful}
        errorMessage={errors.name?.message}
      />
      <Input
        {...register("email")}
        placeholder={t`Enter your email`}
        disabled={isSubmitting || isSubmitSuccessful}
        errorMessage={errors.email?.message}
      />
      <Input
        {...register("phone")}
        placeholder={t`Enter your phone`}
        disabled={isSubmitting || isSubmitSuccessful}
        errorMessage={errors.phone?.message}
      />
      <Textarea
        {...register("message")}
        placeholder={t`Enter your message...`}
        minRows={4}
        disabled={isSubmitting || isSubmitSuccessful}
        errorMessage={errors.message?.message}
      />

      <Button
        type="submit"
        disabled={isSubmitting || isSubmitSuccessful}
        className={twMerge("w-full", isSubmitSuccessful && "duration-1000 bg-green-500")}
      >
        {isSubmitting ? <Trans>Sending...</Trans> : <Trans>Send message</Trans>}
      </Button>
    </form>
  );
};
