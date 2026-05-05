"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  CheckCircle,
  ArrowRight,
  Wrench,
  Clock,
  Shield,
} from "lucide-react";
import {
  serviceRequestSchema,
  type ServiceRequestInput,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

const categoryOptions = [
  { value: "AC_REPAIR", label: "AC Repair" },
  { value: "AC_INSTALLATION", label: "AC Installation" },
  { value: "AC_MAINTENANCE", label: "AC Maintenance" },
  { value: "HEATING_REPAIR", label: "Heating Repair" },
  { value: "HEATING_INSTALLATION", label: "Heating Installation" },
  { value: "HEATING_MAINTENANCE", label: "Heating Maintenance" },
  { value: "DUCT_CLEANING", label: "Duct Cleaning" },
  { value: "THERMOSTAT", label: "Thermostat Service" },
  { value: "EMERGENCY", label: "Emergency Service" },
  { value: "INSPECTION", label: "Inspection" },
  { value: "OTHER", label: "Other" },
];

const priorityOptions = [
  { value: "LOW", label: "Low - Flexible scheduling" },
  { value: "NORMAL", label: "Normal - Within a few days" },
  { value: "HIGH", label: "High - As soon as possible" },
  { value: "EMERGENCY", label: "Emergency - Immediate attention" },
];

export default function BookPage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceRequestInput>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      type: "RESIDENTIAL",
      priority: "NORMAL",
    },
  });

  async function onSubmit(data: ServiceRequestInput) {
    setSubmitState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Something went wrong");
      }

      setSubmitState("success");
      reset();
    } catch (err) {
      setSubmitState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to submit request"
      );
    }
  }

  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Book a Service
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Tell us about your HVAC needs and we&apos;ll get back to you with a
            quote and scheduling options.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-100">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Fast Response
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Licensed & Insured
            </span>
            <span className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Expert Technicians
            </span>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {submitState === "success" ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                  Service Request Submitted!
                </h2>
                <p className="mt-2 max-w-md text-slate-600">
                  Thank you for choosing ComfortAir Pro. Our team will review
                  your request and contact you within 2 business hours to confirm
                  scheduling.
                </p>
                <div className="mt-8 flex gap-4">
                  <Button onClick={() => setSubmitState("idle")}>
                    Submit Another Request
                  </Button>
                  <Link href="/">
                    <Button variant="outline">
                      Back to Home
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Service Request Form
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Fill in the details below and we&apos;ll take care of the
                    rest.
                  </p>
                </div>

                {submitState === "error" && (
                  <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
                    {errorMessage}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Service Type & Category */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Select
                      id="type"
                      label="Service Type"
                      error={errors.type?.message}
                      {...register("type")}
                    >
                      <option value="RESIDENTIAL">Residential</option>
                      <option value="COMMERCIAL">Commercial</option>
                    </Select>

                    <Select
                      id="category"
                      label="Service Category"
                      error={errors.category?.message}
                      {...register("category")}
                    >
                      <option value="">Select a category</option>
                      {categoryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {/* Priority */}
                  <Select
                    id="priority"
                    label="Priority Level"
                    error={errors.priority?.message}
                    {...register("priority")}
                  >
                    {priorityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>

                  {/* Title */}
                  <Input
                    id="title"
                    label="Brief Title"
                    placeholder="e.g., AC not cooling properly"
                    error={errors.title?.message}
                    {...register("title")}
                  />

                  {/* Description */}
                  <Textarea
                    id="description"
                    label="Description"
                    rows={4}
                    placeholder="Please describe the issue or service you need in detail..."
                    error={errors.description?.message}
                    {...register("description")}
                  />

                  {/* Address */}
                  <Input
                    id="address"
                    label="Service Address"
                    placeholder="1234 Main St, Springfield, IL 62701"
                    error={errors.address?.message}
                    {...register("address")}
                  />

                  {/* Preferred Date */}
                  <Input
                    id="preferredDate"
                    label="Preferred Date (Optional)"
                    type="date"
                    error={errors.preferredDate?.message}
                    {...register("preferredDate")}
                  />

                  {/* Guest Fields (shown when not authenticated) */}
                  {!isAuthenticated && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-slate-900">
                          Your Contact Information
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Already have an account?{" "}
                          <Link
                            href="/auth/signin"
                            className="font-medium text-blue-600 hover:text-blue-700"
                          >
                            Sign in
                          </Link>{" "}
                          to auto-fill your details.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Input
                            id="guestName"
                            label="Full Name"
                            placeholder="John Doe"
                            error={errors.guestName?.message}
                            {...register("guestName")}
                          />
                          <Input
                            id="guestEmail"
                            label="Email Address"
                            type="email"
                            placeholder="john@example.com"
                            error={errors.guestEmail?.message}
                            {...register("guestEmail")}
                          />
                        </div>
                        <Input
                          id="guestPhone"
                          label="Phone Number"
                          type="tel"
                          placeholder="(555) 000-0000"
                          error={errors.guestPhone?.message}
                          {...register("guestPhone")}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    loading={submitState === "loading"}
                    className="w-full"
                  >
                    Submit Service Request
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
