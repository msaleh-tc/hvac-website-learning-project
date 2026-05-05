import Link from "next/link";
import {
  Shield,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Users,
  ThermometerSun,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const stats = [
  { label: "Years in Business", value: "15+" },
  { label: "Happy Customers", value: "10,000+" },
  { label: "Service Calls Completed", value: "50,000+" },
  { label: "Certified Technicians", value: "35+" },
];

const values = [
  {
    icon: Shield,
    title: "Integrity",
    description:
      "We believe in honest assessments, transparent pricing, and doing the right thing even when no one is watching.",
  },
  {
    icon: Star,
    title: "Excellence",
    description:
      "Every job is done to the highest standard. We don't cut corners and we never settle for 'good enough.'",
  },
  {
    icon: Users,
    title: "Customer First",
    description:
      "Your comfort and satisfaction drive every decision we make. We listen, adapt, and deliver.",
  },
  {
    icon: Wrench,
    title: "Continuous Improvement",
    description:
      "We invest in ongoing training and the latest technology to stay at the forefront of the HVAC industry.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            About ComfortAir Pro
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Over 15 years of keeping homes and businesses comfortable across the
            region. Learn what makes us different.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Our Story</h2>
              <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
                <p>
                  ComfortAir Pro was founded in 2009 by a team of HVAC
                  professionals who believed that homeowners and businesses
                  deserved better service. Frustrated by the industry&apos;s
                  reputation for hidden fees and unreliable work, they set out
                  to build a company rooted in transparency, quality, and genuine
                  care for their customers.
                </p>
                <p>
                  What started as a small team of five technicians operating out
                  of a single service van has grown into one of the region&apos;s
                  most trusted HVAC companies, with over 35 certified
                  technicians and a fleet of fully equipped service vehicles.
                </p>
                <p>
                  Today, we serve thousands of residential and commercial
                  customers, but our commitment remains the same: to deliver
                  honest, expert HVAC service that puts your comfort first.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-slate-100 p-8">
              <div className="flex items-center gap-3">
                <ThermometerSun className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-bold text-slate-900">
                  Our Mission
                </h3>
              </div>
              <p className="mt-4 text-slate-600 leading-relaxed">
                To provide exceptional heating and cooling services with
                integrity, expertise, and a relentless focus on customer
                satisfaction. We aim to be the HVAC company you trust and
                recommend to your neighbors.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <Star className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-bold text-slate-900">
                  Our Vision
                </h3>
              </div>
              <p className="mt-4 text-slate-600 leading-relaxed">
                To set the industry standard for HVAC service excellence, making
                every home and business we touch more comfortable, energy
                efficient, and safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-600 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-white">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-blue-100">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Our Core Values
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              These principles guide everything we do, from the first phone call
              to the final follow-up.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <value.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {value.title}
                  </h3>
                  <p className="text-sm text-slate-600">{value.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Experience the ComfortAir Pro Difference
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Join over 10,000 satisfied customers who trust us with their comfort.
            Schedule your first service today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/book">
              <Button size="lg">
                Book a Service
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
