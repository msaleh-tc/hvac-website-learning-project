import Link from "next/link";
import {
  Snowflake,
  Flame,
  Phone,
  Shield,
  Wrench,
  ThermometerSun,
  Wind,
  CheckCircle,
  Star,
  ArrowRight,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const services = [
  {
    icon: Snowflake,
    title: "AC Repair",
    description:
      "Fast, reliable air conditioning repair to keep your home cool when it matters most.",
  },
  {
    icon: Flame,
    title: "Heating Repair",
    description:
      "Expert furnace and heating system repair for year-round warmth and comfort.",
  },
  {
    icon: ThermometerSun,
    title: "Installation",
    description:
      "Professional HVAC installation with top-tier equipment and expert craftsmanship.",
  },
  {
    icon: Wrench,
    title: "Maintenance",
    description:
      "Preventative maintenance plans to extend the life of your system and avoid costly breakdowns.",
  },
  {
    icon: Wind,
    title: "Duct Cleaning",
    description:
      "Thorough air duct cleaning to improve indoor air quality and system efficiency.",
  },
  {
    icon: Clock,
    title: "Emergency Service",
    description:
      "24/7 emergency HVAC service because comfort emergencies don't wait for business hours.",
  },
];

const features = [
  {
    icon: Shield,
    title: "Licensed & Certified",
    description:
      "All our technicians are fully licensed, insured, and NATE-certified for your peace of mind.",
  },
  {
    icon: Clock,
    title: "24/7 Emergency Service",
    description:
      "Round-the-clock availability means help is always just a phone call away.",
  },
  {
    icon: CheckCircle,
    title: "Satisfaction Guaranteed",
    description:
      "We stand behind every job with a 100% satisfaction guarantee. Your comfort is our commitment.",
  },
  {
    icon: Users,
    title: "Transparent Pricing",
    description:
      "Upfront, honest pricing with no hidden fees. You approve the cost before we start any work.",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    location: "Residential Customer",
    rating: 5,
    text: "ComfortAir Pro saved us during a heat wave when our AC went out. They arrived within an hour and had everything running perfectly. Couldn't ask for better service!",
  },
  {
    name: "James Rodriguez",
    location: "Business Owner",
    rating: 5,
    text: "We've been using ComfortAir Pro for our commercial building maintenance for over three years. Their team is professional, thorough, and always on time. Highly recommend.",
  },
  {
    name: "Linda Chen",
    location: "Residential Customer",
    rating: 5,
    text: "From the initial consultation to the final installation, the team was incredible. They helped us choose the right system for our home and the price was very fair.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            <Snowflake className="h-4 w-4" />
            Trusted HVAC Professionals Since 2009
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Your Comfort,{" "}
            <span className="text-blue-200">Our Priority</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100 sm:text-xl">
            Expert residential and commercial heating &amp; cooling services
            available 24/7. From emergency repairs to complete system
            installations, ComfortAir Pro keeps you comfortable year-round.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/book">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                Book a Service
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="tel:+15551234567">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Phone className="mr-2 h-5 w-5" />
                (555) 123-4567
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Our Services
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Comprehensive HVAC solutions for homes and businesses. Whatever
              your heating or cooling needs, we have you covered.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.title} className="group transition-shadow hover:shadow-md">
                <div className="flex flex-col items-start gap-4">
                  <div className="rounded-lg bg-blue-50 p-3 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {service.description}
                    </p>
                  </div>
                  <Link
                    href="/services"
                    className="mt-auto inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Learn more
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Why Choose ComfortAir Pro?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              We set the standard for HVAC excellence with industry-leading
              service and customer care.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              What Our Customers Say
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Don&apos;t just take our word for it. Here&apos;s what real
              customers have to say about ComfortAir Pro.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="flex flex-col">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-slate-600">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="border-t border-slate-100 pt-4">
                    <p className="font-semibold text-slate-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-blue-600 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Get Comfortable?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
            Schedule your service today and experience the ComfortAir Pro
            difference. Fast, reliable, and always affordable.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/book">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                Schedule Service
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
