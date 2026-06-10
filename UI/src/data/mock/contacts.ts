import type { MockContact } from "@/lib/api-adapters/types";

export const seedContacts: MockContact[] = [
  {
    id: "c1",
    name: "Sneha Kapoor",
    email: "sneha@example.com",
    phone: "+91 98765 11111",
    message: "Looking for a 2-tier birthday cake for 50 guests.",
    service: "Custom Cake",
    status: "new",
    createdAt: "2024-05-10T08:00:00Z",
  },
  {
    id: "c2",
    name: "Vikram Singh",
    email: "vikram@example.com",
    phone: "+91 91234 22222",
    message: "Do you offer corporate bulk orders?",
    service: "Bulk Order",
    status: "read",
    createdAt: "2024-05-08T12:00:00Z",
  },
];
