import CustomerLayout from "@/layouts/customer-layout";
import PageHero from "@/components/page-hero";
import ContactForm from "@/components/contact-form";
import bakeryContact from "@/assets/images/bakery-Contact.png";
import { Clock, MapPin } from "lucide-react";



export default function Contact() {
  return (
    <CustomerLayout>
      <PageHero
        title="Connect With Our Bakery"
        subtitle="Feel the aroma — we'd love to hear from you"
      />

      <div className="container mx-auto grid gap-12 px-6 py-16 lg:grid-cols-2">
        <div className="space-y-8">
          <ContactForm />

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-serif text-lg font-bold">
              <Clock className="h-5 w-5 text-primary" /> Business Hours
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between">
                <span>Mon – Fri</span>
                <span>7:00 AM – 8:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>8:00 AM – 9:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>8:00 AM – 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-border shadow-md">
  <img
    src={bakeryContact}
    alt="Bakery"
    className="h- 64 w-full object-cover object-center"
  />
</div>
          <div className="flex items-start gap-3 rounded-2xl bg-muted/50 p-6">
            <MapPin className="mt-1 h-5 w-5 text-primary" />
            <div>
              <p className="font-bold">Bake Me Blush</p>
              <p className="text-sm text-muted-foreground">
                123 Baker Street, Sweet City
                <br />
                hello@bakemeblush.com · +91 98765 43210
              </p>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
