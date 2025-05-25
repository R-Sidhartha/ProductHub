const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://producthub-server.onrender.com";

function getAuthHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getProducts(token: string) {
  const res = await fetch(`${BASE_URL}/api/products`, {
    headers: getAuthHeaders(token),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch products");
  }

  return res.json();
}

type CreateProductInput = {
  name: string;
  image: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  status: "In Stock" | "Out of Stock";
};

export async function createProduct(data: CreateProductInput, token: string) {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create product");
  }

  return res.json();
}

type UpdateProductInput = Partial<CreateProductInput>;

export async function updateProduct(
  id: number,
  data: UpdateProductInput,
  token: string
) {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update product");
  }

  return res.json();
}

export async function deleteProduct(id: number, token: string) {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete product");
  }

  return res.json(); // { message: "Deleted successfully" }
}

type FilterParams = {
  category?: string;
  status?: "In Stock" | "Out of Stock";
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  name?: string;
  description?: string;
};

function buildQuery(params: FilterParams): string {
  const searchParams = new URLSearchParams();

  for (const key in params) {
    const value = params[key as keyof FilterParams];
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  }

  return searchParams.toString();
}

export async function getFilteredProducts(
  filters: FilterParams,
  token: string
) {
  const query = buildQuery(filters);

  const res = await fetch(`${BASE_URL}/api/products/filter?${query}`, {
    headers: getAuthHeaders(token),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch filtered products");
  }

  return res.json();
}
