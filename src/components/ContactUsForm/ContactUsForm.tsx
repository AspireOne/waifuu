import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import { Button, Input, Textarea } from "@nextui-org/react";
import { api } from "@lib/api";
import contactFormSchema from "@/server/types/contactFormSchema";

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
      toast.success("Form submitted!");
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
        placeholder="Enter your name"
        disabled={isSubmitting || isSubmitSuccessful}
        errorMessage={errors.name?.message}
      />
      <Input
        {...register("email")}
        placeholder="Enter your email"
        disabled={isSubmitting || isSubmitSuccessful}
        errorMessage={errors.email?.message}
      />
      <Input
        {...register("phone")}
        placeholder="Enter your phone"
        disabled={isSubmitting || isSubmitSuccessful}
        errorMessage={errors.phone?.message}
      />
      <Textarea
        {...register("message")}
        placeholder="Enter your message..."
        minRows={4}
        disabled={isSubmitting || isSubmitSuccessful}
        errorMessage={errors.message?.message}
      />

      <Button
        type="submit"
        disabled={isSubmitting || isSubmitSuccessful}
        className={twMerge(
          "w-full",
          isSubmitSuccessful && "duration-1000 bg-green-500",
        )}
      >
        {isSubmitting ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
};
