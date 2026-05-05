import Link from "next/link";
import { Snowflake, Flame, Phone, Mail, MapPin } from "lucide-react";

const quickLinks = [
  { href: "/services", label: "Our Services" },
  { href: "/about", label: "About Us" },
  { href: "/book", label: "Book Service" },
  { href: "/contact", label: "Contact Us" },
];

const serviceAreas = [
  "Residential HVAC",
  "Commercial HVAC",
  "Emergency Repairs",
  "Maintenance Plans",
  "New Installations",
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company info */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex items-center">
                <Snowflake className="h-6 w-6 text-blue-400" />
                <Flame className="absolute -bottom-0.5 -right-1 h-4 w-4 text-orange-400" />
              </div>
              <span className="text-lg font-bold text-white">
                ComfortAir <span className="text-blue-400">Pro</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Professional heating, ventilation, and air conditioning services.
              Keeping your home comfortable year-round with reliable,
              expert HVAC solutions.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service areas */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="space-y-2">
              {serviceAreas.map((area) => (
                <li key={area} className="text-sm text-slate-400">
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <span>info@comfortairpro.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <span>123 Climate Control Blvd, Suite 100, Anytown, USA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} ComfortAir Pro. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
