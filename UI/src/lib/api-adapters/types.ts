export type DataSource = "live" | "mock";

export interface Subcategory {
  id: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  name: string;
  weightLabel: string;
  price: number;
  imageUrl: string;
  productId?: string;
}

export interface MockUser {
  id: string;
  regId: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  registeredAt: string;
  status: "active" | "blocked";
}

export interface MockAd {
  id: string;
  title: string;
  flashLine: string;
  description: string;
  link: string;
  imageUrl: string;
  placement: "home-banner" | "sidebar";
  sortOrder: number;
}

export interface MockContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  service?: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Completed"
  | "Cancelled";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function isObjectId(value: string): boolean {
  return /^[a-f\d]{24}$/i.test(value);
}
