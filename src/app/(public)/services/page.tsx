import Link from "next/link";
import {
  Snowflake,
  Flame,
  Wrench,
  ThermometerSun,
  Wind,
  Clock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const services = [
  {
    icon: Snowflake,
    title: "Residential Cooling",
    description:
      "Keep your home cool and comfortable all summer long with our comprehensive air conditioning services. From tune-ups to full system replacements, our certified technicians deliver reliable cooling solutions.",
    items: [
      "Central AC repair and diagnostics",
      "Ductless mini-split installation",
      "Air conditioning system replacement",
      "Refrigerant recharge and leak repair",
      "Thermostat installation and calibration",
      "Seasonal tune-ups and inspections",
    ],
  },
  {
    icon: Flame,
    title: "Residential Heating",
    description:
      "Stay warm through the coldest months with our expert heating services. We work with all major furnace and heat pump brands to ensure your family's comfort.",
    items: [
      "Furnace repair and replacement",
      "Heat pump installation and service",
      "Boiler maintenance and repair",
      "Radiant heating system service",
      "Pilot light and ignition repair",
      "Carbon monoxide safety inspections",
    ],
  },
  {
    icon: ThermometerSun,
    title: "Commercial Cooling",
    description:
      "Enterprise-grade cooling solutions for offices, retail spaces, restaurants, and industrial facilities. We understand that downtime costs you money.",
    items: [
      "Rooftop unit (RTU) service and repair",
      "Chiller maintenance and installation",
      "VRF/VRV system installation",
      "Building automation integration",
      "Preventative maintenance contracts",
      "Emergency commercial AC repair",
    ],
  },
  {
    icon: Wind,
    title: "Commercial Heating",
    description:
      "Reliable commercial heating solutions to keep your employees comfortable and your business running smoothly through every season.",
    items: [
      "Commercial furnace and boiler service",
      "Warehouse and industrial heating",
      "Radiant floor heating systems",
      "Make-up air unit service",
      "Heat recovery ventilator installation",
      "Energy efficiency consulting",
    ],
  },
  {
    icon: Wrench,
    title: "Maintenance Plans",
    description:
      "Protect your investment with our comprehensive maintenance plans. Regular upkeep prevents costly breakdowns and extends the life of your HVAC system by years.",
    items: [
      "Bi-annual system inspections",
      "Priority scheduling for members",
      "15% discount on all repairs",
      "Filter replacement included",
      "Performance efficiency reporting",
      "No overtime charges for members",
    ],
  },
  {
    icon: Clock,
    title: "Emergency Services",
    description:
      "HVAC emergencies don't follow a schedule, and neither do we. Our emergency team is available 24 hours a day, 7 days a week, 365 days a year.",
    items: [
      "24/7 emergency dispatch",
      "Average 60-minute response time",
      "No after-hours surcharges for plan members",
      "Temporary heating/cooling solutions",
      "Gas leak detection and repair",
      "Frozen pipe and burst pipe assistance",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Our Services
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            From routine maintenance to emergency repairs, ComfortAir Pro
            delivers full-spectrum HVAC solutions for residential and commercial
            customers.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          {services.map((service, index) => (
            <Card key={service.title} className="overflow-hidden">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
                <div className="flex-1">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                      <service.icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {service.title}
                    </h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="flex-1">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                    What&apos;s Included
                  </h3>
                  <ul className="space-y-2">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                        <span className="text-sm text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link href="/book">
                      <Button>
                        Book Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-blue-600 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white">
            Not Sure What You Need?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
            Our experts will assess your situation and recommend the best
            solution. Get a free consultation today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                Get a Free Quote
              </Button>
            </Link>
            <Link href="tel:+15551234567">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Call (555) 123-4567
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
