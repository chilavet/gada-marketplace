'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface ModifierGroup {
  id: string;
  title: string;
  required: boolean;
  minSelections?: number;
  maxSelections?: number;
  options: ModifierOption[];
}

export interface CustomProduct {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  image: string;
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  modifierGroups?: ModifierGroup[];
}

interface Props {
  product: CustomProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductCustomizationModal({ product, isOpen, onClose }: Props) {
  const { addItem } = useCartStore();
  const [selectedRadio, setSelectedRadio] = useState<Record<string, ModifierOption>>({});
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<Record<string, ModifierOption[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  // Calculate dynamic line total
  const radioTotal = Object.values(selectedRadio).reduce((acc, opt) => acc + opt.price, 0);
  const checkboxTotal = Object.values(selectedCheckboxes)
    .flat()
    .reduce((acc, opt) => acc + opt.price, 0);
  const unitPrice = product.basePrice + radioTotal + checkboxTotal;
  const totalPrice = unitPrice * quantity;

  const handleRadioSelect = (groupId: string, option: ModifierOption) => {
    setSelectedRadio((prev) => ({ ...prev, [groupId]: option }));
  };

  const handleCheckboxToggle = (groupId: string, option: ModifierOption, max = 99) => {
    const current = selectedCheckboxes[groupId] || [];
    const exists = current.some((item) => item.id === option.id);

    if (exists) {
      setSelectedCheckboxes((prev) => ({
        ...prev,
        [groupId]: current.filter((item) => item.id !== option.id),
      }));
    } else {
      if (current.length >= max) return;
      setSelectedCheckboxes((prev) => ({
        ...prev,
        [groupId]: [...current, option],
      }));
    }
  };

  const handleAddToCart = () => {
    setValidationError(null);

    // Validate required groups
    if (product.modifierGroups) {
      for (const group of product.modifierGroups) {
        if (group.required && !selectedRadio[group.id]) {
          setValidationError(`Please make a selection for: ${group.title}`);
          return;
        }
      }
    }

    const selectedAddonNames = [
      ...Object.values(selectedRadio).map((o) => o.name),
      ...Object.values(selectedCheckboxes).flat().map((o) => o.name),
    ];

    addItem(
      {
        productId: product.id,
        vendorId: product.vendorId,
        title: product.title,
        variantTitle: selectedAddonNames.length > 0 ? selectedAddonNames.join(', ') : undefined,
        unitPrice,
        quantity,
        image: product.image,
      },
      {
        vendorId: product.vendorId,
        vendorName: product.vendorName,
        vendorSlug: product.vendorSlug,
      }
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header / Product Banner */}
        <div className="relative h-44 w-full bg-gray-100 shrink-0">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center text-sm font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Customization Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">{product.title}</h2>
            <p className="text-xs text-gray-500 mt-1">{product.description}</p>
            <p className="text-base font-bold text-amber-600 mt-2">
              Base Price: ₦{product.basePrice.toLocaleString()}
            </p>
          </div>

          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              ⚠ {validationError}
            </div>
          )}

          {/* Modifier Groups */}
          {product.modifierGroups?.map((group) => (
            <div key={group.id} className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-bold text-gray-900">{group.title}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  group.required ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'
                }`}>
                  {group.required ? 'Required' : 'Optional'}
                </span>
              </div>

              <div className="space-y-2">
                {group.options.map((option) => {
                  const isChecked = group.required
                    ? selectedRadio[group.id]?.id === option.id
                    : (selectedCheckboxes[group.id] || []).some((item) => item.id === option.id);

                  return (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm cursor-pointer transition ${
                        isChecked
                          ? 'border-amber-500 bg-amber-50/50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type={group.required ? 'radio' : 'checkbox'}
                          name={group.id}
                          checked={isChecked}
                          onChange={() =>
                            group.required
                              ? handleRadioSelect(group.id, option)
                              : handleCheckboxToggle(group.id, option, group.maxSelections)
                          }
                          className="text-amber-500 focus:ring-amber-500 h-4 w-4"
                        />
                        <span className="font-medium text-gray-800">{option.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 font-semibold">
                        {option.price > 0 ? `+₦${option.price.toLocaleString()}` : 'Free'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Special Instructions */}
          <div className="border-t border-gray-100 pt-4 space-y-2">
            <label className="block text-xs font-bold uppercase text-gray-700">
              Kitchen Instructions / Allergy Notes
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less pepper, cutlery in bag, ring gate phone..."
              className="w-full text-xs border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-sm">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3.5 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-l-xl"
            >
              -
            </button>
            <span className="px-3 text-sm font-bold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3.5 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-r-xl"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow transition flex justify-between items-center"
          >
            <span>Add to Basket</span>
            <span>₦{totalPrice.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCustomizationModal;
