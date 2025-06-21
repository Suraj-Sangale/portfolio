import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import CustomTitle from "./Items/CustomTitle";
import contactStyles from "../styles/contact.module.css"; // CSS Module

const Contact = () => {
  const form = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialFormState = {
    from_name: "",
    from_email: "",
    subject: "",
    message: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  const [errors, setErrors] = useState({
    from_name: "",
    from_email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData(initialFormState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.from_name.trim()) {
      isValid = false;
      newErrors.from_name = "Name is required";
    }

    if (!formData.from_email.trim()) {
      isValid = false;
      newErrors.from_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.from_email)) {
      isValid = false;
      newErrors.from_email = "Invalid email format";
    }

    if (!formData.subject.trim()) {
      isValid = false;
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      isValid = false;
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);

    if (isValid) {
      setIsLoading(true);
      emailjs
        .sendForm("service_kurtcr8", "template_ed9ynop", form.current, {
          publicKey: "DvhW8RF1zxNX4rKXe",
        })
        .then(
          () => {
            setIsOpen(true);
            setIsLoading(false);
            setIsSuccess(true);
          },
          (error) => {
            console.error("FAILED...", error.text);
            setIsOpen(true);
            setIsLoading(false);
            setIsSuccess(false);
          }
        );
    }
  };

  useEffect(() => {
    document.body.classList.toggle("no-scroll", isLoading);
    return () => document.body.classList.remove("no-scroll");
  }, [isLoading]);

  return (
    <section
      className="contact container section relative"
      id="contact"
    >
      <CustomTitle
        subheading=""
        mainText="Reach out"
        highlightedText="to me!"
      />

      <div className={`${contactStyles.contactContainer} grid mt-5`}>
        <div className={`${contactStyles.contactInfo}`}>
          <p className="text-white">
            DISCUSS A PROJECT OR JUST WANT TO SAY HI ? MY INBOX IS OPEN FOR
            ALL.👋
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          ref={form}
          className={contactStyles.contactForm}
        >
          <div className={contactStyles.contactFormGroup}>
            <div className={contactStyles.contactFormDiv}>
              <input
                type="text"
                className={contactStyles.contactFormInput}
                placeholder="Your Good Name Here"
                name="from_name"
                value={formData.from_name}
                onChange={handleInputChange}
              />
              <span className="text-red-500 absolute mt-[3.6rem] ms-4">
                {errors.from_name}
              </span>
            </div>

            <div className={contactStyles.contactFormDiv}>
              <input
                type="email"
                className={contactStyles.contactFormInput}
                placeholder="Your Email"
                name="from_email"
                value={formData.from_email}
                onChange={handleInputChange}
              />
              <span className="text-red-500 absolute mt-[3.6rem] ms-4">
                {errors.from_email}
              </span>
            </div>
          </div>

          <div className={contactStyles.contactFormDiv}>
            <input
              type="text"
              className={contactStyles.contactFormInput}
              placeholder="Let's Talk About..."
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
            />
            <span className="text-red-500 absolute mt-[3.6rem] ms-4">
              {errors.subject}
            </span>
          </div>

          <div
            className={`${contactStyles.contactFormDiv} ${contactStyles.contactFormArea}`}
          >
            <textarea
              name="message"
              cols={30}
              rows={10}
              className={contactStyles.contactFormInput}
              placeholder="Suraj, Lets Grow Together !"
              value={formData.message}
              onChange={handleInputChange}
            />
            <span className="text-red-500 absolute mt-[3.6rem] ms-4">
              {errors.message}
            </span>
          </div>

          <button
            type="submit"
            className="btn"
          >
            Send Message
          </button>
        </form>
      </div>

      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-black bg-opacity-70"></div>
            </div>
            <span className="inline-block h-screen align-middle">&#8203;</span>

            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div
                    className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
                      isSuccess ? "bg-green-100" : "bg-red-100"
                    } sm:mx-0 sm:h-10 sm:w-10`}
                  >
                    <svg
                      className={`h-6 w-6 ${
                        isSuccess ? "text-green-600" : "text-red-600"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      {isSuccess ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      )}
                    </svg>
                  </div>

                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {isSuccess ? "Success!" : "Failed"}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {isSuccess
                          ? "Your message has been sent successfully."
                          : "Oops! Something went wrong. Please try again later."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={closeModal}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-70">
          <div className="loader">
            <div className="intern">Please wait..</div>
            <div className="external-shadow">
              <div className="central"></div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
