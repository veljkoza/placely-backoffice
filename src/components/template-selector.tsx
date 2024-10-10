/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

// Define Zod schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  primaryColor: z.string().min(1, "Primary color is required"), // assuming a valid string for a color
});

type FormData = z.infer<typeof formSchema>;

type Template = "classic" | "sleek" | "urban";

export default function TemplateSelector() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );

  const createWebsiteMutation = api.website.create.useMutation();

  // Integrate zodResolver with useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", { template: selectedTemplate, ...data });
    createWebsiteMutation.mutate({
      primaryColor: data.primaryColor,
      template: selectedTemplate ?? "",
      title: data.title,
    });
    alert("Sucessfuly created website!");
    setSelectedTemplate(null);
    reset();
  };

  const templates: Template[] = ["classic", "sleek", "urban"];

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Choose a Website Template</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {templates.map((template) => (
          <Button
            key={template}
            onClick={() => setSelectedTemplate(template)}
            className="h-32 text-lg capitalize"
            variant={"secondary"}
          >
            {template}
          </Button>
        ))}
      </div>

      <Dialog
        open={selectedTemplate !== null}
        onOpenChange={() => setSelectedTemplate(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {selectedTemplate} Template</DialogTitle>
            <DialogDescription>
              Enter the title and choose a primary color for your website.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  className="col-span-3"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="col-span-4 text-red-500">
                    {errors.title?.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="primaryColor" className="text-right">
                  Primary Color
                </Label>
                <Input
                  id="primaryColor"
                  type="color"
                  className="col-span-3 h-10"
                  {...register("primaryColor")}
                />
                {errors.primaryColor && (
                  <p className="col-span-4 text-red-500">
                    {errors.primaryColor.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createWebsiteMutation.isPending}>Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
