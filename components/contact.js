import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CustomTitle from "./Items/CustomTitle";
import contactStyles from "../styles/contact.module.css";

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data) => {
    console.log('data', data)
    try {
      const res = await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setIsSuccess(result.success);
      setIsOpen(true);
      reset();
    } catch (err) {
      console.error("Sending failed:", err);
      setIsSuccess(false);
      setIsOpen(true);
    }
  };

  const closeModal = () => setIsOpen(false);

  return (
    <section className="contact container section" id="contact">
      <CustomTitle mainText="Reach out" highlightedText="to me!" />
      <div className={`${contactStyles.contactContainer} grid mt-5`}>
        <form onSubmit={handleSubmit(onSubmit)} className={contactStyles.contactForm}>
          <div className={contactStyles.contactFormGroup}>
            <div className={contactStyles.contactFormDiv}>
              <input
                type="text"
                placeholder="Your Name"
                {...register("from_name", { required: "Name is required" })}
                className={contactStyles.contactFormInput}
              />
              {errors.from_name && (
                <span className="text-red-500">{errors.from_name.message}</span>
              )}
            </div>

            {/* <div className={contactStyles.contactFormDiv}>
              <input
                type="email"
                placeholder="Your Email"
                {...register("from_email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                className={contactStyles.contactFormInput}
              />
              {errors.from_email && (
                <span className="text-red-500">{errors.from_email.message}</span>
              )}
            </div> */}
          </div>

          <div className={contactStyles.contactFormDiv}>
            {/* <input
              type="text"
              placeholder="Subject"
              {...register("subject", { required: "Subject is required" })}
              className={contactStyles.contactFormInput}
            /> */}
            {errors.subject && (
              <span className="text-red-500">{errors.subject.message}</span>
            )}
          </div>

          <div className={contactStyles.contactFormDiv}>
            {/* <textarea
              rows="6"
              placeholder="Message"
              {...register("message", { required: "Message is required" })}
              className={contactStyles.contactFormInput}
            /> */}
            {errors.message && (
              <span className="text-red-500">{errors.message.message}</span>
            )}
          </div>
          <button onClick={()=>console.log("hellll")}>hee</button>

          <button type="submit" className="btn cursor-pointer">
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {isOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold">
              {isSuccess ? "Message sent ✅" : "Failed to send ❌"}
            </h2>
            <p className="mt-2">
              {isSuccess ? "Thank you for reaching out!" : "Please try again later."}
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
};

export default Contact;
