import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper'

import styles from '../styles/Username.module.css';

export default function Register() {
  const navigate = useNavigate()
  const [file, setFile] = useState()
  const fileInputRef = useRef(null) // Reference to the file input

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      const valuesWithProfile = { ...values, profile: file || '' }
      let registerPromise = registerUser(valuesWithProfile)
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: <b>Register Successfully...!</b>,
        error: <b>Could not Register.</b>
      });

      registerPromise.then(() => {
        // Reset form and file state after successful registration
        resetForm()
        setFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = '' // Clear file input
        }
        navigate('/')
      });
    }
  })

  /** formik doesn't support file upload so we need to create this handler */
  const onUpload = async e => {
    if (e.target.files[0]) {
      const base64 = await convertToBase64(e.target.files[0]);
      setFile(base64);
    }
  }

  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{ width: "45%", paddingTop: '3em' }}>
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Register</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Happy to join you!
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor="profile">
                <img src={file || avatar} className={styles.profile_img} alt="avatar" />
              </label>
              <input
                onChange={onUpload}
                type="file"
                id='profile'
                name='profile'
                ref={fileInputRef} // Attach ref to file input
                accept="image/*" // Restrict to image files
              />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('email')} className={styles.textbox} type="text" placeholder='Email*' />
              <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username*' />
              <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='Password*' />
              <button className={styles.btn} type='submit'>Register</button>
            </div>

            <div className="text-center py-4">
              <span className='text-white'>Already Register? <Link className='text-red-500' to="/">Login Now</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}