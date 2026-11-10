import { useState } from "react";
import { z } from "zod";

export function useFormValidation<TData>(
  initialValues: TData,
  schema: z.ZodType<any, any, any>,
  onSubmit: (values: TData) => void
) {
  const [values, setValues] = useState<TData>(initialValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const set = <K extends keyof TData>(key: K, value: TData[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Optional: Clear error saat user mengetik
    if (errors[key as string]) {
      setErrors((prev) => ({ ...prev, [key]: undefined } as any));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(values);
    
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    
    setErrors({});
    onSubmit(result.data);
  };

  return { values, setValues, errors, set, handleSubmit };
}