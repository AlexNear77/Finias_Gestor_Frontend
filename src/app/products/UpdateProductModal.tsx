// UpdateProductModal.tsx
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useGetProductByIdQuery, useUpdateProductMutation } from "@/state/api";
import Header from "@/app/(components)/Header";
import ImageUpload from "../(components)/ImageUpload";
import Image from "next/image";

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

const UpdateProductModal = ({
  isOpen,
  onClose,
  productId,
}: UpdateProductModalProps) => {
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

  const [sizes, setSizes] = useState<{ size: string; stockQuantity: number }[]>(
    []
  );
  const [imageUrl, setImageUrl] = useState<string>("");

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
      setSizes(product.sizes || []);
      setImageUrl(product.imageUrl || "");
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
    setSizes([...sizes, { size: "", stockQuantity: 0 }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSizeChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedSizes = sizes.map((sizeItem, i) =>
      i === index ? { ...sizeItem, [field]: value } : sizeItem
    );
    setSizes(updatedSizes);
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateProduct({ productId, ...formData, sizes, imageUrl });
    onClose();
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20">
        <div className="bg-white p-4 rounded">Loading...</div>
      </div>
    );
  }

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Update Product" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* PRODUCT NAME */}
          <label htmlFor="productName" className={labelCssStyles}>
            Product Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />

          {/* PRICE */}
          <label htmlFor="productPrice" className={labelCssStyles}>
            Price
          </label>
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            value={formData.price}
            className={inputCssStyles}
            required
          />

          {/* STOCK QUANTITY */}
          <label htmlFor="stockQuantity" className={labelCssStyles}>
            Stock Quantity
          </label>
          <input
            type="number"
            name="stockQuantity"
            placeholder="Stock Quantity"
            onChange={handleChange}
            value={formData.stockQuantity}
            className={inputCssStyles}
            required
          />

          {/* RATING */}
          <label htmlFor="rating" className={labelCssStyles}>
            Rating
          </label>
          <input
            type="number"
            name="rating"
            placeholder="Rating"
            onChange={handleChange}
            value={formData.rating}
            className={inputCssStyles}
          />

          {/* DESCRIPTION */}
          <label htmlFor="description" className={labelCssStyles}>
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            value={formData.description}
            className={`${inputCssStyles} h-24 resize-none`}
          ></textarea>

          {/* GENDER */}
          <label htmlFor="gender" className={labelCssStyles}>
            Gender
          </label>
          <select
            name="gender"
            onChange={handleChange}
            value={formData.gender}
            className={inputCssStyles}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unisex">Unisex</option>
          </select>

          {/* SIZES */}
          <div className="mt-4">
            <label className={labelCssStyles}>Sizes</label>
            {sizes.map((sizeItem, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder="Size"
                  value={sizeItem.size}
                  onChange={(e) =>
                    handleSizeChange(index, "size", e.target.value)
                  }
                  className={`${inputCssStyles} mr-2`}
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
                  className={`${inputCssStyles} mr-2`}
                />
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSize}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
              Add Size
            </button>
          </div>

          {/* IMAGE UPLOAD */}
          <div className="mt-4">
            <label className={labelCssStyles}>Product Image</label>
            <ImageUpload onUpload={handleImageUpload} productId={productId} />
            {/* Mostrar vista previa de la imagen si se ha cargado */}
            {imageUrl && (
              <div className="mt-4">
                <Image
                  src={imageUrl}
                  alt="Uploaded Image"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
              </div>
            )}
          </div>

          {/* UPDATE ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;
