import type { MockUser } from "@/lib/api-adapters/types";

export const seedUsers: MockUser[] = [
  {
    id: "u1",
    regId: "REG-1001",
    name: "Priya Sharma",
    email: "priya@example.com",
    mobile: "+91 98765 43210",
    address: "12 MG Road, Pune",
    registeredAt: "2024-01-15T10:00:00Z",
    status: "active",
  },
  {
    id: "u2",
    regId: "REG-1002",
    name: "Rahul Mehta",
    email: "rahul@example.com",
    mobile: "+91 91234 56789",
    address: "45 Park Street, Mumbai",
    registeredAt: "2024-02-20T14:30:00Z",
    status: "active",
  },
  {
    id: "u3",
    regId: "REG-1003",
    name: "Ananya Desai",
    email: "ananya@example.com",
    mobile: "+91 99887 76655",
    address: "8 Lake View, Bangalore",
    registeredAt: "2024-03-05T09:15:00Z",
    status: "blocked",
  },
];
