import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";
import ImageUpload from "../(components)/ImageUpload";
import Image from "next/image";

type ProductFormData = {
  productId: string;
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

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ProductFormData) => void;
};

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateProductModalProps) => {
  // Generar productId solo una vez y usarlo en todo el componente
  const [productId] = useState<string>(v4());

  // Incluir el mismo productId en el formData
  const [formData, setFormData] = useState<ProductFormData>({
    productId: productId,
    name: "",
    price: 0,
    stockQuantity: 0,
    rating: 0,
    description: "",
    gender: "",
    imageUrl: "",
  });

  const [imageUrl, setImageUrl] = useState<string>("");
  const [sizes, setSizes] = useState<{ size: string; stockQuantity: number }[]>(
    []
  );

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate({ ...formData, sizes, imageUrl });
    onClose();
    // Restablecer el formulario
    setFormData({
      productId: v4(),
      name: "",
      price: 0,
      stockQuantity: 0,
      rating: 0,
      description: "",
      gender: "",
      imageUrl: "",
    });
    setSizes([]);
    setImageUrl("");
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700 mt-4";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <Header name="Create New Product" />
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 overflow-y-auto max-h-[80vh]"
        >
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

          {/* Componente de carga de imagen */}
          <div className="mt-4">
            <label className={labelCssStyles}>Product Image</label>
            <ImageUpload
              onUpload={handleImageUpload}
              productId={formData.productId}
            />
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
          {/* Botones de acción */}
          <div className="px-6 py-4 border-t flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
