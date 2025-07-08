/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormProvider as RHFForm } from "react-hook-form";

// ----------------------------------------------------------------------

export function Form({ children, onSubmit, methods }: any) {
  return (
    <RHFForm {...methods}>
      <form onSubmit={onSubmit} noValidate autoComplete="off">
        {children}
      </form>
    </RHFForm>
  );
}
