"use client";

import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import { resetPasswordAsync } from "@/actions/auth";
import { paths } from "@/routes/path";
import { Field, Form } from "@/components/hook-form";
import { FormHead } from "../components/form-head";
import { FormReturnLink } from "../components/form-return-link";
import PasswordIcon from "@/assets/icons/password-icon";
import { Button } from "@mui/material";

// ----------------------------------------------------------------------

export const ResetPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email must be a valid email address!" }),
});

// ----------------------------------------------------------------------

export function ResetPasswordView() {
  const router = useRouter();

  const defaultValues = {
    email: "",
  };

  const methods = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await resetPasswordAsync({ email: data.email });
      const href = `${paths.auth.waitingConfirmation}`;
      router.push(href);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        autoFocus
        name="email"
        label="Email address"
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Send request..."
      >
        Send request
      </Button>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<PasswordIcon />}
        title="Forgot your password?"
        description={`Please enter the email address associated with your account and we'll email you a link to reset your password.`}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <FormReturnLink href={paths.auth.signIn} />
    </>
  );
}
