import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useGetProductByIdQuery, useUpdateProductMutation } from "@/state/api";
import Header from "@/app/(components)/Header";
import ImageUpload from "../(components)/ImageUpload";
import Image from "next/image";
import { XIcon, PlusIcon, MinusIcon } from "lucide-react";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
  description?: string;
  gender?: string;
  sizes?: {
    size: string;
    stockQuantity: number;
  }[];
  imageUrl?: string;
};

type UpdateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
};

export default function UpdateProductModal({
  isOpen,
  onClose,
  productId,
}: UpdateProductModalProps) {
  const { data: product, isLoading } = useGetProductByIdQuery(productId);
  const [updateProduct] = useUpdateProductMutation();

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    stockQuantity: 0,
    rating: 0,
    description: "",
    gender: "",
    sizes: [],
    imageUrl: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        stockQuantity: product.stockQuantity,
        rating: product.rating || 0,
        description: product.description || "",
        gender: product.gender || "",
        sizes: product.sizes || [],
        imageUrl: product.imageUrl || "",
      });
    }
  }, [product]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" || name === "stockQuantity" || name === "rating"
          ? parseFloat(value)
          : value,
    });
  };

  const addSize = () => {
    setFormData({
      ...formData,
      sizes: [...(formData.sizes || []), { size: "", stockQuantity: 0 }],
    });
  };

  const removeSize = (index: number) => {
    setFormData({
      ...formData,
      sizes: formData.sizes?.filter((_, i) => i !== index) || [],
    });
  };

  const handleSizeChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedSizes = (formData.sizes || []).map((sizeItem, i) =>
      i === index ? { ...sizeItem, [field]: value } : sizeItem
    );
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const handleImageUpload = (url: string) => {
    setFormData((prevData) => ({ ...prevData, imageUrl: url }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateProduct({ productId, ...formData });
    onClose();
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="rounded-lg bg-white p-6 shadow-xl">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative mx-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
        >
          <XIcon className="h-6 w-6" />
        </button>
        <Header name="Update Product" />
        <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
          <div className="grid gap-2">
            <label
              htmlFor="productName"
              className="text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              value={formData.name}
              className="rounded-md border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label
                htmlFor="productPrice"
                className="text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                id="productPrice"
                name="price"
                placeholder="Price"
                onChange={handleChange}
                value={formData.price}
                className="rounded-md border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="stockQuantity"
                className="text-sm font-medium text-gray-700"
              >
                Stock Quantity
              </label>
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                placeholder="Stock Quantity"
                onChange={handleChange}
                value={formData.stockQuantity}
                className="rounded-md border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="rating"
              className="text-sm font-medium text-gray-700"
            >
              Rating
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              placeholder="Rating"
              onChange={handleChange}
              value={formData.rating}
              className="rounded-md border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              onChange={handleChange}
              value={formData.description}
              className="h-24 resize-none rounded-md border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            ></textarea>
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="gender"
              className="text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              onChange={handleChange}
              value={formData.gender}
              className="rounded-md border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Sizes</label>
            {formData.sizes?.map((sizeItem, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Size"
                  value={sizeItem.size}
                  onChange={(e) =>
                    handleSizeChange(index, "size", e.target.value)
                  }
                  className="flex-1 rounded-md border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={sizeItem.stockQuantity}
                  onChange={(e) =>
                    handleSizeChange(
                      index,
                      "stockQuantity",
                      parseInt(e.target.value)
                    )
                  }
                  className="flex-1 rounded-md border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="rounded-full bg-red-100 p-2 text-red-600 transition-colors hover:bg-red-200"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSize}
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
            >
              <PlusIcon className="h-4 w-4" />
              Add Size
            </button>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">
              Product Image
            </label>
            <ImageUpload onUpload={handleImageUpload} productId={productId} />
            {formData.imageUrl && (
              <div className="mt-2">
                <Image
                  src={formData.imageUrl}
                  alt="Uploaded Image"
                  width={200}
                  height={200}
                  className="rounded-md object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              type="button"
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
