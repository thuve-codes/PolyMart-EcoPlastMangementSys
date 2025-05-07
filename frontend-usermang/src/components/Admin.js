import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

import { useFormik } from 'formik';
import { usernameValidate } from '../helper/validate'
import { useAuthStore } from '../store/store'

import styles from '../styles/Username.module.css';

export default function Admin() {

  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername);

  const formik = useFormik({
    initialValues : {
      username : ''
    },
    validate : usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    
    onSubmit : async values => {
      try {
        const res = await fetch(`/api/user/${values.username}`);
        const data = await res.json();

        if (data.type === 'admin') {
          setUsername(values.username);
          navigate('/adminP'); // ✅ redirect to admin password page
        } else {
          toast.error('You are not an admin, please use user login');
        }

      } catch (error) {
        toast.error('User not found or server error');
        console.error(error);
      }
    }
  })

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false} />

      <div className='flex justify-left items-center h-screen'>
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Admin Panel</h4>
            <span className='py-4 text-xl w-2/3 text-center text-black-500'>
              Enter your admin username to proceed.
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <img src={avatar} className={styles.profile_img} alt="avatar" />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Admin Username' />
              <button className={styles.btn} type='submit'>Next</button>
            </div>

            <div className="text-center py-4">
              <span className='text-black'>Not an admin? <Link className='text-red-500' to="/">User Login</Link></span>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}
