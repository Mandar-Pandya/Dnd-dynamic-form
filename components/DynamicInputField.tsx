import { useState } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import * as Yup from "yup";

function createDynamicSchema(extraAttributes: {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  helperText?: string;
  minLengthError?: string;
  maxLengthError?: string;
  customValidation?: boolean;
  regex?: RegExp;
  regexError?: string;
}) {
  //   let schema = z.string();

  //   // Add required validation
  //   if (extraAttributes.required) {
  //     schema = schema.min(1, {
  //       message: extraAttributes.helperText || "This field is required",
  //     });
  //   }

  //   if (extraAttributes.customValidation) {
  //     if (extraAttributes.minLength) {
  //       schema = schema.min(extraAttributes.minLength, {
  //         message:
  //           extraAttributes.minLengthError ||
  //           `Minimum length is ${extraAttributes.minLength}`,
  //       });
  //     }

  //     if (extraAttributes.maxLength) {
  //       schema = schema.max(extraAttributes.maxLength, {
  //         message:
  //           extraAttributes.maxLengthError ||
  //           `Maximum length is ${extraAttributes.maxLength}`,
  //       });
  //     }

  //     if (extraAttributes.regex) {
  //       const regexObject = new RegExp(extraAttributes.regex); // Convert regex string to RegExp object
  //       schema = schema.regex(regexObject, {
  //         message: extraAttributes.regexError || "Invalid format",
  //       });
  //     }
  //   }

  let schema = Yup.string();

  // Add required validation
  if (extraAttributes.required) {
    schema = schema.required(
      extraAttributes.helperText || "This field is required",
    );
  }

  // Add custom validations
  if (extraAttributes.customValidation) {
    if (extraAttributes.minLength) {
      schema = schema.min(
        extraAttributes.minLength,
        extraAttributes.minLengthError,
      );
    }

    if (extraAttributes.maxLength) {
      schema = schema.max(
        extraAttributes.maxLength,
        extraAttributes.maxLengthError ||
          `Maximum length is ${extraAttributes.maxLength}`,
      );
    }

    if (extraAttributes.regex) {
      const regexObject = new RegExp(extraAttributes.regex); // Convert regex string to RegExp object
      schema = schema.matches(regexObject, {
        message: extraAttributes.regexError || "Invalid format",
      });
    }
  }
  return schema;
}

export function DynamicInputField({
  extraAttributes,
}: {
  extraAttributes: any;
}) {
  const {
    label,
    required,
    placeHolder,
    inputType,
    helperText,
    minLength,
    maxLength,
    minLengthError,
    maxLengthError,
    customValidation,
    regex,
    regexError,
  } = extraAttributes;

  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Generate Zod schema
  const fieldSchema = createDynamicSchema({
    required,
    minLength,
    maxLength,
    helperText,
    minLengthError,
    maxLengthError,
    customValidation,
    regex,
    regexError,
  });

  // Validate input
  //   const validateInput = (value: string) => {
  //     const validation = fieldSchema.safeParse(value);
  //     if (!validation.success) {
  //       setError(validation.error.errors[0].message);
  //       return false;
  //     }
  //     setError(null);
  //     return true;
  //   };

  const validateInput = async (value: string) => {
    try {
      await fieldSchema.validate(value); // Validate the value
      setError(""); // Clear the error if validation passes
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.message); // Set the error message from Yup
      }
      return false;
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Input
        type={inputType || "text"}
        className={cn(error && "border-red-500")}
        placeholder={placeHolder}
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
        onBlur={() => validateInput(value)}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {/* {!error && helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )} */}
    </div>
  );
}
