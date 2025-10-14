import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import contactStyles from "../styles/contact.module.css";
import CustomTitle from "./Items/CustomTitle";
import { getConstant } from "@/utilities/utils";
import { contactValidation } from "@/utilities/formValidations";
import aboutStyles from "../styles/about.module.css";
import { FaCheckCircle } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";

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
  const [showMsg, setShowMsg] = useState(false);

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
    setShowMsg(false);
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
      setShowMsg(true);
      setIsLoading(false);
    }
  };

  // Add this helper inside your component (before return)
  const handleWhatsAppMessage = () => {
    const { from_name, from_email, subject, message } = formData;

    // Recipient WhatsApp number (use your own number with country code, no "+" sign)
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER; // Example: India (+91)

    // Create message text
    const text = `Hi Suraj,
I want to discuss about - ${subject},
${message}
Regards,
${from_name},
${from_email}`;

    // Encode the message for URL
    const encodedText = encodeURIComponent(text);

    // WhatsApp API link
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    // Open in new tab
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section
      className={`${contactStyles.contact} container ${contactStyles.section}  relative`}
      id="contact"
    >
      <CustomTitle
        mainText="Reach out"
        highlightedText="to me!"
      />
      <div className={`${contactStyles.contactContainer} grid mt-5`}>
        <div className={`${contactStyles.contactInfo}`}>
          <p className="contact__details text-white">
            Want to discuss a project or just say hi? My inbox is always open.
            👋
          </p>
        </div>
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
              <span className="text-red-500 absolute top-[3.7rem] left-7">
                {errors?.from_name?.message}
              </span>
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
              <span className="text-red-500 absolute top-[3.7rem] left-7">
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
            <span className="text-red-500 absolute top-[3.7rem] left-7">
              {errors?.subject?.message}
            </span>
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
            <span className="text-red-500 absolute top-[3.7rem] left-7">
              {errors?.message?.message}
            </span>
          </div>
          <div className="flex justify-between items-end">
            <button
              className={`text-center ${aboutStyles.styleButton}`}
              type="submit"
            >
              <span
                className={`${aboutStyles.viewResumeButton} ${aboutStyles.mail}`}
              >
                {isLoading ? "Sending..." : "Send"}
              </span>
            </button>
            <button
              type="submit"
              onClick={handleWhatsAppMessage}
              className={`text-center ${aboutStyles.styleButton} `}
            >
              <span
                className={`${aboutStyles.viewResumeButton}  ${aboutStyles.whatsapp}`}
              >
                Send
              </span>
            </button>
          </div>
          {isOpen && showMsg && Object.keys(errors).length == 0 && (
            <>
              <div
                className={`mt-2 p-2 rounded-xl text-center border-2 flex items-center justify-center gap-2 ${
                  isSuccess
                    ? "bg-green-200 border-green-700 text-green-700 font-semibold"
                    : "bg-yellow-200 border-yellow-700 text-yellow-700 font-semibold"
                }`}
              >
                {isSuccess ? (
                  <>
                    <FaCheckCircle />
                    Message Sent Successfully
                  </>
                ) : (
                  <>
                    <IoWarning />
                    Failed to Send Message, Please try again later
                  </>
                )}
              </div>
            </>
          )}
        </form>
      </div>

      {/* {isOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-opacity-70 flex items-center justify-center z-50">
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
      )} */}
    </section>
  );
}
