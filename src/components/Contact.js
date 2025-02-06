import React, { useEffect, useRef, useState } from "react";
import "../styles//Contact.css";
import emailjs from "@emailjs/browser";
import CustomTitle from "./Items/CustomTitle";

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
      newErrors.email = "Invalid email format";
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
      e.preventDefault();
      setIsLoading(true);
      emailjs
        .sendForm("service_kurtcr8", "template_ed9ynop", form.current, {
          publicKey: "DvhW8RF1zxNX4rKXe",
        })
        .then(
          () => {
            console.log("SUCCESS!");
            setIsOpen(true);
            setIsLoading(false);
            setIsSuccess(true);
          },
          (error) => {
            console.log("FAILED...", error.text);
            setIsOpen(true);
            setIsLoading(false);
            setIsSuccess(false);
          }
        );
    }
  };

  useEffect(() => {
    // Disable scroll when loading
    if (isLoading) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Clean up when the component is unmounted or state changes
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isLoading]);
  return (
    <section
      className="contact container section"
      id="contact"
    >
      <CustomTitle
        subheading=""
        mainText="Reach out"
        highlightedText="to me!"
      />
      {/* <h2 className="section__title text-white">Reach Out to me!</h2> */}
      <div className="contact__container grid mt-5">
        <div className="contact__info">
          <p className="contact__details text-white">
            DISCUSS A PROJECT OR JUST WANT TO SAY HI ? MY INBOX IS OPEN FOR
            ALL.👋
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          ref={form}
          className="contact__form"
        >
          <div className="contact__form-group">
            <div className="contact__form-div">
              <input
                type="text"
                className="contact__form-input"
                placeholder="Your Good Name Here"
                name="from_name"
                value={formData.from_name}
                onChange={handleInputChange}
              />
              <span className="text-red-500 absolute mt-[3.6rem] ms-4">
                {errors.from_name}
              </span>
            </div>

            <div className="contact__form-div">
              <input
                type="email"
                className="contact__form-input"
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

          <div className="contact__form-div">
            <input
              type="text"
              className="contact__form-input"
              placeholder="Let's Talk About..."
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
            />
            <span className="text-red-500 absolute mt-[3.6rem] ms-4">
              {errors.subject}
            </span>
          </div>

          <div className="contact__form-div contact__form-area">
            <textarea
              name="message"
              id=""
              cols={30}
              rows={10}
              className="contact__form-input"
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
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  {isSuccess ? (
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="h-6 w-6 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="h-6 w-6 text-red-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    {isSuccess ? (
                      <>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Success!
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Your message has been sent successfully.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Failed
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Oops! Something went wrong. Please try again later
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={closeModal}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
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
          <div class="loader">
            <div class="intern">Please wait..</div>
            <div class="external-shadow">
              <div class="central"></div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
