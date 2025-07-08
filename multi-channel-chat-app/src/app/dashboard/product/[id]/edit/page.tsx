import { CONFIG } from "@/config-global";
import { Product } from "@/models/product/product";
import { ProductEditView } from "@/sections/product/view/product-edit-view";
import axiosInstance, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

export const metadata = {
  title: `Product edit | Dashboard - ${CONFIG.appName}`,
};

type ProductParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: ProductParams) {
  const { id } = await params;

  const product = await getProduct(id);

  return <ProductEditView product={product}/>;
}

async function getProduct(id: string) {
  try {
    const url = id ? `${endpoints.products.list}/${id}` : "";
    const res = await axiosInstance.get(url);
    
    return res?.data.data as Product;
  } catch (error) {
    console.error("Error during get product:", error);
    throw error;
  }
}
