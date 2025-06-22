import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import contactStyles from "../styles/contact.module.css";
import CustomTitle from "./Items/CustomTitle";
import { getConstant } from "@/utilities/utils";
import { contactValidation } from "@/utilities/formvalidations";

export default function Contact() {
  const defaultFormData = {
    from_name: "",
    from_email: "",
    subject: "",
    message: "",
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [validation, setValidation] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm();

  useEffect(() => {
    const temp = {
      from_name: register("from_name", contactValidation.from_name),
      from_email: register("from_email", contactValidation.from_email),
      subject: register("subject", contactValidation.subject),
      message: register("message", contactValidation.message),
    };
    setValidation(temp);
  }, []);

  const updateSelectedForm = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const resetSelectedForm = () => {
    setFormData(defaultFormData);
    Object.keys(defaultFormData).forEach((key) => resetField(key));
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      setIsSuccess(result.success);
      setIsOpen(true);
      if (result.success) resetSelectedForm();
    } catch (error) {
      setIsSuccess(false);
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className="contact container section relative"
      id="contact"
    >
      <CustomTitle
        mainText="Reach out"
        highlightedText="to me!"
      />
      <div className={`${contactStyles.contactContainer} grid mt-5`}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={contactStyles.contactForm}
        >
          {/* Name & Email */}
          <div className={contactStyles.contactFormGroup}>
            <div className={contactStyles.contactFormDiv}>
              <input
                type="text"
                {...validation.from_name}
                onChange={(e) => {
                  validation.from_name.onChange(e);
                  updateSelectedForm("from_name", e.target.value);
                }}
                placeholder="Your Name"
                name="from_name"
                value={formData.from_name}
                className={contactStyles.contactFormInput}
                autoComplete="off"
                maxLength={getConstant("MAX_LEN_TEXT")}
              />
              <span className="text-red-500">{errors?.from_name?.message}</span>
            </div>

            <div className={contactStyles.contactFormDiv}>
              <input
                type="email"
                {...validation.from_email}
                onChange={(e) => {
                  validation.from_email.onChange(e);
                  updateSelectedForm("from_email", e.target.value);
                }}
                placeholder="Your Email"
                name="from_email"
                value={formData.from_email}
                className={contactStyles.contactFormInput}
                autoComplete="off"
              />
              <span className="text-red-500">
                {errors?.from_email?.message}
              </span>
            </div>
          </div>

          {/* Subject */}
          <div className={contactStyles.contactFormDiv}>
            <input
              type="text"
              {...validation.subject}
              onChange={(e) => {
                validation.subject.onChange(e);
                updateSelectedForm("subject", e.target.value);
              }}
              placeholder="Subject"
              name="subject"
              value={formData.subject}
              className={contactStyles.contactFormInput}
              autoComplete="off"
            />
            <span className="text-red-500">{errors?.subject?.message}</span>
          </div>

          {/* Message */}
          <div className={contactStyles.contactFormDiv}>
            <textarea
              rows="6"
              {...validation.message}
              onChange={(e) => {
                validation.message.onChange(e);
                updateSelectedForm("message", e.target.value);
              }}
              placeholder="Message"
              name="message"
              value={formData.message}
              className={contactStyles.contactFormInput}
            />
            <span className="text-red-500">{errors?.message?.message}</span>
          </div>

          <button
            type="submit"
            className="btn"
          >
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {isOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold">
              {isSuccess ? "✅ Message Sent" : "❌ Failed to Send"}
            </h2>
            <p className="mt-2">
              {isSuccess
                ? "Thank you for reaching out!"
                : "Please try again later."}
            </p>
            <button
              className="mt-4 bg-green-600 px-4 py-2 text-white rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
