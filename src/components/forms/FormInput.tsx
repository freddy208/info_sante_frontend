"use client";

import React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"; // On ne prend plus InputProps
import { cn } from "@/lib/utils";

interface FormInputProps<T extends FieldValues> extends React.ComponentProps<"input"> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  ...props
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label && <FormLabel htmlFor={field.name}>{label}</FormLabel>}
          <FormControl>
            <Input
              {...field}
              {...props}
              id={field.name}
              aria-invalid={!!fieldState.error}
              className={cn(fieldState.error && "border-red-500", className)}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
