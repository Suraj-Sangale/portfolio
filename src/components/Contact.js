import React, { useState } from 'react';
import "./Contact.css";


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      isValid = false;
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      isValid = false;
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      isValid = false;
      newErrors.email = 'Invalid email format';
    }

    if (!formData.subject.trim()) {
      isValid = false;
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      isValid = false;
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);

    if (isValid) {
      console.log('Form submitted:', formData);
    }
  };

  return (
    <section className='contact container section' id='contact'>
      <h2 className='section__title text-white'>Reach Out to me!</h2>
      <div className='contact__container grid'>
        <div className='contact__info'>
          <p className='contact__details text-white'>DISCUSS A PROJECT OR JUST WANT TO SAY HI ? MY INBOX IS OPEN FOR ALL.👋</p>
        </div>

        <form onSubmit={handleSubmit} className='contact__form'>
          <div className='contact__form-group'>
            <div className='contact__form-div'>
              <input
                type='text'
                className='contact__form-input'
                placeholder='Your Good Name Here'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
              />
              <span className='text-red-500 absolute mt-[3.6rem] ms-4'>{errors.name}</span>
            </div>

            <div className='contact__form-div'>
              <input
                type='email'
                className='contact__form-input'
                placeholder='Your Email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
              />
              <span className='text-red-500 absolute mt-[3.6rem] ms-4'>{errors.email}</span>
            </div>
          </div>

          <div className='contact__form-div'>
            <input
              type='text'
              className='contact__form-input'
              placeholder="Let's Talk About..."
              name='subject'
              value={formData.subject}
              onChange={handleInputChange}
            />
            <span className='text-red-500 absolute mt-[3.6rem] ms-4'>{errors.subject}</span>
          </div>

          <div className='contact__form-div contact__form-area'>
            <textarea
              name='message'
              id=''
              cols={30}
              rows={10}
              className='contact__form-input'
              placeholder='Suraj, Lets Grow Together !?'
              value={formData.message}
              onChange={handleInputChange}
            />
            <span className='text-red-500 absolute mt-[3.6rem] ms-4'>{errors.message}</span>
          </div>
          <button type='submit' className='btn'>
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
