"use client";

import Link from "next/link";
import { Heart, MapPin, Clock, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { addOrder } from "../../lib/orders";
import { toast } from "react-toastify";

export default function PatientPage() {
  const [formData, setFormData] = useState({
    patientName: "",
    roomNumber: "",
    bed: "",
    mealTime: "",
    menuItems: [] as string[],
    specialInstructions: "",
  });

  const [showError, setShowError] = useState(false);

  const menuOptionsByMeal: Record<string, string[]> = {
    breakfast: [
      "Scrambled Eggs",
      "Toast with Butter",
      "Oatmeal",
      "Fresh Fruit",
      "Orange Juice",
      "Coffee",
      "Yogurt",
    ],
    lunch: [
      "Grilled Chicken Sandwich",
      "Caesar Salad",
      "Vegetable Soup",
      "French Fries",
      "Apple",
      "Iced Tea",
      "Chocolate Chip Cookie",
    ],
    dinner: [
      "Baked Salmon",
      "Mashed Potatoes",
      "Green Beans",
      "Mixed Vegetables",
      "Dinner Roll",
      "Chocolate Pudding",
      "Milk",
    ],
  };

  const currentMenuOptions = formData.mealTime ? menuOptionsByMeal[formData.mealTime] || [] : [];

  const handleMenuItemToggle = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      menuItems: prev.menuItems.includes(item)
        ? prev.menuItems.filter((i) => i !== item)
        : [...prev.menuItems, item],
    }));
  };

  const handleMealTimeChange = (mealTime: string) => {
    // Clear menu items when meal time changes
    setFormData({
      ...formData,
      mealTime,
      menuItems: [],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.roomNumber || formData.menuItems.length === 0 || !formData.patientName) {
      setShowError(true);
      return;
    }
    
    setShowError(false);
    // create order and save to localStorage (demo mode)
    const created = addOrder({
      patientName: formData.patientName,
      roomNumber: formData.roomNumber,
      bed: formData.bed,
      mealTime: formData.mealTime,
      menuItems: formData.menuItems,
      specialInstructions: formData.specialInstructions,
    });

    // reset form and show a simple confirmation (for demo)
    setFormData({
      patientName: "",
      roomNumber: "",
      bed: "",
      mealTime: "",
      menuItems: [],
      specialInstructions: "",
    });

    toast.success(`Order submitted successfully! Order ID: ${created.id.slice(0, 8).toUpperCase()}`, {
      position: "top-right",
      autoClose: 4000,
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f0fbff] to-[#f7fff4] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="flex flex-col items-center gap-4 mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Heart className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-semibold text-[#0f172a]">Redeemer&apos;s Health Village</h1>
          <p className="text-lg text-blue-600">Meal Ordering Service</p>
        </header>

        <div className="flex justify-end mb-4">
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg bg-white hover:bg-blue-50 transition whitespace-nowrap"
          >
            Change Role
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-blue-900" />
              <h2 className="text-lg font-medium text-blue-900">Patient Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-[#1e3a8a] mb-2">
                  Patient Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) =>
                    setFormData({ ...formData, patientName: e.target.value })
                  }
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="roomNumber" className="block text-sm font-medium text-[#1e3a8a] mb-2">
                    Room Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="roomNumber"
                    value={formData.roomNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, roomNumber: e.target.value })
                    }
                    placeholder="e.g. 204"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  />
                </div>

                <div>
                  <label htmlFor="bed" className="block text-sm font-medium text-[#1e3a8a] mb-2">
                    Bed (Optional)
                  </label>
                  <input
                    type="text"
                    id="bed"
                    value={formData.bed}
                    onChange={(e) =>
                      setFormData({ ...formData, bed: e.target.value })
                    }
                    placeholder="e.g. A"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Select Meal Time */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-blue-900" />
              <h2 className="text-lg font-medium text-blue-900">
                Select Meal Time <span className="text-red-500">*</span>
              </h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="mealTime"
                  value="breakfast"
                  checked={formData.mealTime === "breakfast"}
                  onChange={(e) => handleMealTimeChange(e.target.value)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-[#0f172a]">Breakfast</div>
                  <div className="text-sm text-gray-500">7:00 AM - 9:00 AM</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="mealTime"
                  value="lunch"
                  checked={formData.mealTime === "lunch"}
                  onChange={(e) => handleMealTimeChange(e.target.value)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-[#0f172a]">Lunch</div>
                  <div className="text-sm text-gray-500">12:00 PM - 2:00 PM</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="mealTime"
                  value="dinner"
                  checked={formData.mealTime === "dinner"}
                  onChange={(e) => handleMealTimeChange(e.target.value)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-[#0f172a]">Dinner</div>
                  <div className="text-sm text-gray-500">6:00 PM - 8:00 PM</div>
                </div>
              </label>
            </div>
          </div>

          {/* Select Menu Items - Only show when meal time is selected */}
          {formData.mealTime && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <UtensilsCrossed className="h-5 w-5 text-blue-900" />
                <h2 className="text-lg font-medium text-blue-900">
                  Select Menu Items <span className="text-red-500">*</span>
                </h2>
              </div>

              <div className="space-y-3">
                {currentMenuOptions.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition"
                  >
                    <input
                      type="checkbox"
                      checked={formData.menuItems.includes(item)}
                      onChange={() => handleMenuItemToggle(item)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-[#1e3a8a] font-medium">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-blue-900 mb-4">Special Instructions</h2>
            <textarea
              value={formData.specialInstructions}
              onChange={(e) =>
                setFormData({ ...formData, specialInstructions: e.target.value })
              }
              placeholder="Any dietary restrictions, allergies, or special requests..."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-400 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-md transition"
          >
            Place Order
          </button>

          {/* Error Message */}
          {showError && (
            <p className="text-center text-sm text-red-600">
              Please fill in required fields: meal time, room number, and select at least one menu item.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
