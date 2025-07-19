import React, { useState, useRef } from "react";
import { ChatBubbleLeftIcon, XMarkIcon } from "./icons";
import SimpleInput from "./SimpleInput";
import type { UserInfo } from "../model";
import { startChatSessionAsync } from "../actions/auth";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

interface PreChatFormProps {
  onSuccess: (data: UserInfo) => void;
}

const PreChatForm: React.FC<PreChatFormProps> = ({ onSuccess }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLDivElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email";
    } else {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Email is not valid";
      }
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number";
    } else {
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Phone number is not valid";
      } else if (formData.phone.replace(/[^\d]/g, "").length < 10) {
        newErrors.phone = "Phone number must be at least 10 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      setFormData({ name: "", email: "", phone: "" });
      setErrors({});
      setIsFormOpen(false);

      handleStartChat(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartChat = async (data: FormData) => {
    const response = await startChatSessionAsync(data);
    onSuccess(response);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="animate-shake hover:animate-none">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="group relative bg-primary-500 
                     text-white p-4 rounded-full shadow-lg 
                     hover:shadow-xl hover:bg-primary-600 transform transition-all duration-300
                     hover:scale-105 
                     focus:outline-none focus:ring-4 focus:ring-transparent"
          aria-label="Open chat form"
        >
          <ChatBubbleLeftIcon className="h-8 w-8" />
        </button>
      </div>

      {/* Popup Form */}
      {isFormOpen && (
        <div className="absolute bottom-20 right-0 w-96 max-w-sm">
          <div
            ref={formRef}
            className="bg-white rounded-2xl shadow-2xl border border-neutral-200 
                       overflow-hidden transform transition-all duration-300 
                       animate-in slide-in-from-bottom-5"
          >
            {/* Header */}
            <div className="p-4 flex justify-between items-center">
              <p className="font-bold">
                Hello! 😊Could you share your WhatsApp number?{" "}
                <span className="text-primary-600">
                  Our tailor can assist and confirm details.
                </span>
              </p>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-white hover:text-neutral-200 transition-colors
                          p-1 rounded-full hover:bg-white/20"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
              {/* Name */}
              <SimpleInput
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                required
              />

              {/* Email */}
              <SimpleInput
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />

              {/* Phone */}
              <SimpleInput
                name="phone"
                type="tel"
                placeholder="0123 456 789"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                required
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-500 hover:bg-primary-600 
                         text-white py-3 px-6 rounded-lg font-medium
                         focus:ring-4 focus:ring-primary-300
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transform transition-all duration-200
                         hover:scale-[1.02] active:scale-[0.98]
                         flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? "Processing..." : "Start chat"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreChatForm;
