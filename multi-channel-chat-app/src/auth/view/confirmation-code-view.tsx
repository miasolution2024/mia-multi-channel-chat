"use client";

import { z as zod } from "zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import { useRouter, useSearchParams } from "next/navigation";
import { useCountdownSeconds } from "@/hooks/use-countdown";
import { paths } from "@/routes/path";
import { Field, Form } from "@/components/hook-form";
import { FormHead } from "../components/form-head";
import { FormReturnLink } from "../components/form-return-link";
import { FormResendCode } from "../components/form-resend-code";
import SentIcon from "@/assets/icons/sent-icon";
import { Button } from "@mui/material";

// ----------------------------------------------------------------------

export const UpdatePasswordSchema = zod.object({
  code: zod
    .string()
    .min(1, { message: "Code is required!" })
    .min(6, { message: "Code must be at least 6 characters!" }),
  email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email must be a valid email address!" }),
});

// ----------------------------------------------------------------------

export function ConfirmationCodeView() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const email = searchParams?.get("email");

  const countdown = useCountdownSeconds(5);

  const defaultValues = {
    code: "",
    email: email || "",
  };

  const methods = useForm({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);

      router.push(paths.auth.signIn);
    } catch (error) {
      console.error(error);
    }
  });

  const handleResendCode = useCallback(async () => {
    if (!countdown.isCounting) {
      try {
        countdown.reset();
        countdown.start();
        // const code = generateCode(6);
        // const request: EmailBody = {
        //   sendTo: values.email,
        //   subject: "Confirmation Code",
        //   html: `<div><p>Your confirmation code is <strong>${code}</strong></p><p>Thanks.</p></div>`,
        // };
        // await sendMailAsync(request);
      } catch (error) {
        console.error(error);
      }
    }
  }, [countdown, values.email]);

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        name="email"
        label="Email address"
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
        disabled
      />

      <Field.Code name="code" />

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Verify Code..."
      >
        Verify Code
      </Button>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<SentIcon />}
        title="Request sent successfully!"
        description={`We've sent a 6-digit confirmation email to your email. \nPlease enter the code in below box to verify your email.`}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <FormResendCode
        onResendCode={handleResendCode}
        value={countdown.value}
        disabled={countdown.isCounting}
      />

      <FormReturnLink href={paths.auth.signIn} />
    </>
  );
}
