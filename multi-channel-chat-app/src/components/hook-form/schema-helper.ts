/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import { z as zod } from "zod";

// ----------------------------------------------------------------------

export const schemaHelper = {
  /**
   * Phone number
   * defaultValue === ''
   */
  phoneNumber: (props: any) =>
    zod
      .string({
        required_error:
          props?.message?.required_error ?? "Phone number is required!",
        invalid_type_error:
          props?.message?.invalid_type_error ?? "Invalid phone number!",
      })
      .min(1, {
        message: props?.message?.required_error ?? "Phone number is required!",
      })
      .refine(
        (data) => {
          const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
          return phoneRegex.test(data);
        },
        {
          message:
            props?.message?.invalid_type_error ?? "Invalid phone number!",
        }
      ),
  /**
   * Date
   * defaultValue === null
   */
  date: (props: any) =>
    zod.coerce
      .date()
      .nullable()
      .transform((dateString, ctx) => {
        const date = dayjs(dateString).format();

        const stringToDate = zod.string().pipe(zod.coerce.date());

        if (!dateString) {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: props?.message?.required_error ?? "Date is required!",
          });
          return null;
        }

        if (!stringToDate.safeParse(date).success) {
          ctx.addIssue({
            code: zod.ZodIssueCode.invalid_date,
            message: props?.message?.invalid_type_error ?? "Invalid Date!!",
          });
        }

        return date;
      })
      .pipe(zod.union([zod.number(), zod.string(), zod.date(), zod.null()])),
  /**
   * Editor
   * defaultValue === '' | <p></p>
   */
  editor: (props: any) =>
    zod.string().min(8, {
      message: props?.message?.required_error ?? "Editor is required!",
    }),
  /**
   * Object
   * defaultValue === null
   */
  objectOrNull: (props: any) =>
    zod.custom().refine((data) => data !== null && data !== "", {
      message: props?.message?.required_error ?? "Field is required!",
    }),
  /**
   * Boolean
   * defaultValue === false
   */
  boolean: (props: any) =>
    zod.coerce.boolean().refine((bool) => bool === true, {
      message: props?.message?.required_error ?? "Switch is required!",
    }),
  /**
   * File
   * defaultValue === '' || null
   */
  file: (props: any) =>
    zod.custom().transform((data, ctx) => {
      const hasFile =
        data instanceof File || (typeof data === "string" && !!data.length);

      if (!hasFile) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.message?.required_error ?? "File is required!",
        });
        return null;
      }

      return data;
    }),
  /**
   * Files
   * defaultValue === []
   */
  files: (props: any) =>
    zod.array(zod.custom()).transform((data, ctx) => {
      const minFiles = props?.minFiles ?? 2;

      if (!data.length) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.message?.required_error ?? "Files is required!",
        });
      } else if (data.length < minFiles) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: `Must have at least ${minFiles} items!`,
        });
      }

      return data;
    }),
};
