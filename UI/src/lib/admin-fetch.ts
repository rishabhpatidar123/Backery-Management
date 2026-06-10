export async function adminFetch(
  url: string,
  token: string | null,
  options: RequestInit = {}
) {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}

export function exportOrdersCsv(orders: any[]) {
  const headers = [
    "Order ID",
    "Customer",
    "Email",
    "Total",
    "Status",
    "Date",
  ];
  const rows = orders.map((o) => [
    o._id,
    o.shippingAddress.name,
    o.shippingAddress.email,
    o.totalAmount,
    o.status,
    new Date(o.createdAt).toISOString(),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
