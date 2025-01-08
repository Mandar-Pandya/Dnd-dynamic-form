import { Type } from "lucide-react";
import * as z from "zod";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "../hooks/useDesigner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { DynamicInputField } from "../DynamicInputField";

const options = [
  { value: "text", label: "Text" },
  { value: "password", label: "Password" },
  { value: "email", label: "Email" },
  { value: "number", label: "Number" },
];

const type: ElementsType = "TextField";
const extraAttributes = {
  label: "Text field",
  helperText: "Helper text",
  required: false,
  placeHolder: "Value here...",
  inputType: "text" as any,
  customValidation: false,
  minLength: "5",
  maxLength: "100",
  minLengthError: "It should be minimum 5 words",
  maxLengthError: "It should be maximum 100 words",
  regex: "",
  regexError: "",
};

const propertiesSchema = z.object({
  label: z.string().max(200),
  helperText: z.string().max(50),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
  inputType: z.enum(["text", "password", "email", "number"]).default("text"),
  customValidation: z.boolean().default(false), // Checkbox for enabling custom validation
  minLength: z.string(),
  // .optional()
  // .transform((val) => (val ? parseInt(val, 10) : undefined)) // Transform string to number
  // .refine((val) => val === undefined || val >= 0, {
  //   message: "Minimum length must be 0 or greater",
  // }),
  maxLength: z.string(),
  // .optional()
  // .transform((val) => (val ? parseInt(val, 10) : undefined)) // Transform string to number
  // .refine((val) => val === undefined || val >= 0, {
  //   message: "Minimum length must be 0 or greater",
  // }),
  minLengthError: z.string().max(50),
  maxLengthError: z.string().max(50),
  regex: z.string().max(200),
  regexError: z.string().max(200),
});
export const TextFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: Type,
    label: "Text field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement: FormElementInstance, currentValue: string) => {
    console.log(formElement);
    console.log(currentValue);
    const element = formElement as CustomInstance;
    const { required, minLength, maxLength, customValidation } =
      element.extraAttributes;

    console.log(currentValue);

    // if (required && !currentValue.trim()) return false;
    // if (minLength && currentValue.length < minLength) return false;
    // if (maxLength && currentValue.length > maxLength) return false;
    // if (required && !currentValue.trim()) {
    //   return false;
    // }

    // if (customValidation) {
    //   if (minLength !== undefined && currentValue.length < minLength) {
    //     return false;
    //   }
    //   if (maxLength !== undefined && currentValue.length > maxLength) {
    //     return false;
    //   }
    // }

    return true;
  },
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

type PropertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const {
    label,
    required,
    placeHolder,
    helperText,
    inputType,
    minLengthError,
    maxLengthError,
  } = element.extraAttributes;

  return (
    <div className="flex w-full flex-col gap-2">
      <Label>
        {label} designer component
        {required && "*"}
      </Label>
      <Input readOnly disabled placeholder={placeHolder} type={inputType} />
      {helperText && required && (
        <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>
      )}
      {minLengthError}
    </div>
  );
}

function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  defaultValue?: string;
}) {
  const element = elementInstance as CustomInstance;
  const [value, setValue] = useState(defaultValue || "");
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  const {
    label,
    required,
    placeHolder,
    helperText,
    inputType,
    customValidation,
    minLength,
    maxLength,
    minLengthError,
    maxLengthError,
    regex,
    regexError,
  } = element.extraAttributes;
  console.log(element);
  console.log(maxLengthError);
  console.log(minLength);
  console.log(maxLength);

  return (
    <div className="flex w-full flex-col gap-2">
      {/* <Label className={cn(error && "text-red-500")}>
        {label}form component
        {required && "*"}
      </Label>
      <Input
        type={inputType}
        className={cn(error && "border-red-500")}
        placeholder={placeHolder}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          if (!submitValue) return;

          const valid = TextFieldFormElement.validate(element, e.target.value);
          setError(!valid);
          if (!valid) return;
          submitValue(element.id, e.target.value);
        }}
        value={value}
      />
     
      {helperText && required && (
        <p
          className={cn(
            "text-[0.8rem] text-muted-foreground",
            error && "text-red-500",
          )}
        >
          {helperText}
        </p>
      )}
      {minLengthError && customValidation && (
        <p
          className={cn(
            "text-[0.8rem] text-muted-foreground",
            error && "text-red-500",
          )}
        >
          {minLengthError}
        </p>
      )} */}
      <DynamicInputField extraAttributes={element.extraAttributes} />
    </div>
  );
}

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const { updateElement } = useDesigner();
  const element = elementInstance as CustomInstance;
  const form = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      placeHolder: element.extraAttributes.placeHolder,
      inputType: element.extraAttributes.inputType,
      customValidation: element.extraAttributes.customValidation,
      minLength: element.extraAttributes.minLength,
      maxLength: element.extraAttributes.maxLength,
      minLengthError: element.extraAttributes.minLengthError,
      maxLengthError: element.extraAttributes.maxLengthError,
      regex: element.extraAttributes.regex,
      regexError: element.extraAttributes.regexError,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: PropertiesFormSchemaType) {
    const {
      label,
      helperText,
      required,
      placeHolder,
      inputType,
      customValidation,
      minLength,
      maxLength,
      minLengthError,
      maxLengthError,
      regex,
      regexError,
    } = values;
    console.log(values);
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label: label,
        helperText: helperText,
        required: required,
        placeHolder: placeHolder,
        inputType: inputType,
        customValidation,
        minLength,
        maxLength,
        minLengthError,
        maxLengthError,
        regex,
        regexError,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        onBlur={form.handleSubmit(applyChanges)}
      >
        <FormField
          control={form.control}
          name="inputType"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Input Type</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select input type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {options.map((ele, index) => (
                        <SelectItem key={index} value={ele.value}>
                          {ele.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Choose the input type (e.g., text, password, email, number).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                The label of the field. <br />
                It will be displayed above the field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Placeholder</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                />
              </FormControl>
              <FormDescription>The placeholder of the field.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel htmlFor={field.name}>Required</FormLabel>
                <FormDescription>
                  The required state of the field.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form?.getValues("required") && (
          <>
            <FormField
              control={form.control}
              name="helperText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Helper text</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.currentTarget.blur();
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The helper text of the field. <br />
                    It will be displayed below the field
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="customValidation"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>
                Enable Custom Validation
              </FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <FormDescription>
                Check to enable custom length validation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("customValidation") && (
          <>
            <FormField
              control={form.control}
              name="minLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Minimum Length</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>
                    Set the minimum number of characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minLengthError"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Min Length Error</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.currentTarget.blur();
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The helper text of the field. <br />
                    It will be displayed below the field
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Maximum Length</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>
                    Set the maximum number of characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxLengthError"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Max Length Error</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.currentTarget.blur();
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The helper text of the field. <br />
                    It will be displayed below the field
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="regex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>regex</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.currentTarget.blur();
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The helper text of the field. <br />
                    It will be displayed below the field
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="regexError"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>RegexError</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.currentTarget.blur();
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The helper text of the field. <br />
                    It will be displayed below the field
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </form>
    </Form>
  );
}
