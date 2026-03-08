"use client";

import React, { ReactNode, useState, useEffect } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cardSchema, CardFormData } from "@/lib/schema/card";

import { usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";

import { motion } from "motion/react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Button } from "../ui/button";
import { Slider } from "../ui/slider";

import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

import { CreditCard, Calendar, Hash, Tag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addCardThunk } from "@/lib/features/card/cardThunk";

type AddCardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddCardDialog({ open, onOpenChange }: AddCardDialogProps) {
  const [creditLimit, setCreditLimit] = useState(5000);
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.card);
  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardBrand: "",
      cardNumber: "",
      expirationDate: "",
      billingCycleDay: 1,
      creditLimit: 5000,
      nickname: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { getCardNumberProps, getExpiryDateProps, meta } = usePaymentInputs();

  const cardNumber = useWatch({
    control: form.control,
    name: "cardNumber",
  });

  const expiry = useWatch({
    control: form.control,
    name: "expirationDate",
  });

  const nickname = useWatch({
    control: form.control,
    name: "nickname",
  });
  const onSubmit = async (data: CardFormData) => {
    console.log(`on submit triggered`);
    try {
      const result = await dispatch(addCardThunk(data));
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (meta.cardType?.type) {
      form.setValue("cardBrand", meta.cardType.type);
    }
  }, [meta.cardType, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto space-y-6">
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
        </DialogHeader>

        {/* Card Preview */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Cards
            number={cardNumber}
            expiry={(expiry as any).replace("/", "")}
            name={nickname}
            cvc=""
          />
        </motion.div>

        <form
          className="space-y-6"
          onSubmit={
            (form.handleSubmit(onSubmit),
            (errors) => console.log("FORM ERRORS:", errors))
          }
        >
          <FieldGroup>
            {/* Card Number */}

            <Controller
              name="cardNumber"
              control={form.control}
              render={({ field, fieldState }) => {
                const cardType = (meta.cardType?.type ||
                  "placeholder") as keyof typeof images;
                const CardBrand = images[cardType] as unknown as ReactNode;
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="cardNumber">Card Number</FieldLabel>

                    <InputGroup>
                      <InputGroupAddon>
                        <CreditCard />
                      </InputGroupAddon>

                      <InputGroupInput
                        {...getCardNumberProps({
                          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                            field.onChange(e.target.value),
                          value: field.value,
                        })}
                        id="cardNumber"
                        aria-invalid={fieldState.invalid}
                      />

                      <InputGroupAddon>
                        <svg
                          width="32"
                          height="20"
                          viewBox="0 0 24 16"
                          className="opacity-80"
                        >
                          {CardBrand}
                        </svg>
                      </InputGroupAddon>
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Expiration Date */}

            <Controller
              name="expirationDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="expirationDate">
                    Expiration Date
                  </FieldLabel>

                  <InputGroup>
                    <InputGroupAddon>
                      <Calendar />
                    </InputGroupAddon>

                    <InputGroupInput
                      {...getExpiryDateProps({
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                          field.onChange(e.target.value),
                      })}
                      id="expirationDate"
                      aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Billing Cycle */}

            <Controller
              name="billingCycleDay"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="billingCycleDay">
                    Billing Cycle Day
                  </FieldLabel>

                  <InputGroup>
                    <InputGroupAddon>
                      <Hash />
                    </InputGroupAddon>

                    <InputGroupInput
                      id="billingCycleDay"
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                      onBlur={field.onBlur}
                      aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Nickname */}

            <Controller
              name="nickname"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="nickname">Card Nickname</FieldLabel>

                  <InputGroup>
                    <InputGroupAddon>
                      <Tag />
                    </InputGroupAddon>

                    <InputGroupInput
                      {...field}
                      id="nickname"
                      placeholder="Personal / Travel"
                      aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {/* Credit Limit */}

          <Controller
            name="creditLimit"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Credit Limit: ₹{creditLimit}</FieldLabel>

                <Slider
                  min={1000}
                  max={50000}
                  step={500}
                  value={[Number(field.value)]}
                  onValueChange={(val) => {
                    field.onChange(val[0]);
                    setCreditLimit(val[0]);
                  }}
                />
              </Field>
            )}
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting ? "Adding..." : "Add Card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
