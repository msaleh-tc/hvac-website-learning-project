"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactInput) {
    setSubmitState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
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
        err instanceof Error ? err.message : "Failed to send message"
      );
    }
  }

  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Have a question or ready to schedule service? Reach out to our
            friendly team and we&apos;ll get back to you promptly.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact Info Sidebar */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Get In Touch
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  We&apos;re here to help with all your heating and cooling
                  needs.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Phone</p>
                    <a
                      href="tel:+15551234567"
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      (555) 123-4567
                    </a>
                    <p className="text-xs text-slate-500">
                      Available 24/7 for emergencies
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Email</p>
                    <a
                      href="mailto:info@comfortairpro.com"
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      info@comfortairpro.com
                    </a>
                    <p className="text-xs text-slate-500">
                      We respond within 2 business hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Address</p>
                    <p className="text-sm text-slate-600">
                      1234 Comfort Lane
                      <br />
                      Suite 200
                      <br />
                      Springfield, IL 62701
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      Business Hours
                    </p>
                    <div className="text-sm text-slate-600">
                      <p>Monday - Friday: 7:00 AM - 7:00 PM</p>
                      <p>Saturday: 8:00 AM - 5:00 PM</p>
                      <p>Sunday: Emergency calls only</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                {submitState === "success" ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-slate-900">
                      Message Sent!
                    </h3>
                    <p className="mt-2 text-slate-600">
                      Thank you for reaching out. We&apos;ll get back to you
                      within 2 business hours.
                    </p>
                    <Button
                      className="mt-6"
                      onClick={() => setSubmitState("idle")}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-slate-900">
                      Send Us a Message
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Fill out the form below and we&apos;ll be in touch soon.
                    </p>

                    {submitState === "error" && (
                      <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                        {errorMessage}
                      </div>
                    )}

                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="mt-6 space-y-5"
                    >
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Input
                          id="name"
                          label="Full Name"
                          placeholder="John Doe"
                          error={errors.name?.message}
                          {...register("name")}
                        />
                        <Input
                          id="email"
                          label="Email Address"
                          type="email"
                          placeholder="john@example.com"
                          error={errors.email?.message}
                          {...register("email")}
                        />
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <Input
                          id="phone"
                          label="Phone (Optional)"
                          type="tel"
                          placeholder="(555) 000-0000"
                          error={errors.phone?.message}
                          {...register("phone")}
                        />
                        <Input
                          id="subject"
                          label="Subject"
                          placeholder="How can we help?"
                          error={errors.subject?.message}
                          {...register("subject")}
                        />
                      </div>

                      <Textarea
                        id="message"
                        label="Message"
                        rows={5}
                        placeholder="Tell us about your heating or cooling needs..."
                        error={errors.message?.message}
                        {...register("message")}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        loading={submitState === "loading"}
                        className="w-full sm:w-auto"
                      >
                        Send Message
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
