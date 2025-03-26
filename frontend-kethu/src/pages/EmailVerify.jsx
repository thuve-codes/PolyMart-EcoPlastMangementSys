import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Navigate, useNavigate } from 'react-router-dom'
import { data } from 'react-router-dom';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';

const EmailVerify = () => {

  axios.defaults.withCredentials = true; // add cookies in request

  const {backendUrl, isLoggedin, userData, getUserData} = useContext(AppContent);

  const navigate = useNavigate();
  const inputRefs = React.useRef([]); // store otp in a varaiable

  const handleInput = (e, index)=>{
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
      inputRefs.current[index + 1].focus();
    }
  } // to manually move the text field while entering otp in otp page

  const handleKeyDown = (e, index)=>{
    if(e.key === 'Backspace' && e.target.value === '' && index > 0){
      inputRefs.current[index - 1].focus();
    }
  } // to manually delete the text field while deleting a number in otp page


  const handlePaste = (e)=>{
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;
      }
    })
  } // to automatically fill the fields when copy and paste the otp from email

  const onSubmitHandler = async (e)=>{
    try {
      e.preventDefault() //prevent loading webpage when submitting form
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')

      const {data} = await axios.post(backendUrl + '/api/auth/verify-account', {otp})

      if(data.success){
        toast.success(data.message);
        getUserData();
        navigate('/');
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

  } // send otp to backend server when we click verify email button
  
  useEffect(()=>{
    isLoggedin && userData && userData.isAccountVerified && navigate('/');
  },[isLoggedin, userData]) // prevent user to enter into verification page again

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-300 to-purple-400">
      <img
              onClick={()=>navigate('/')} //open home page
              src={assets.logo}
              alt=""
              className="absolute left-5 sm:left-20 top-5 sm:w-32 cursor-pointer"
            />

      <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your Email ID</p>
      
      <div className='flex justify-between mb-8' onPaste={handlePaste}>
        {Array(6).fill(0).map((_, index)=>(
          <input type='text' maxLength='1' key={index} required
          className='w-12 h-12 bg-[#333A5C] text-white text-center text-l rounded-md'
          ref={e => inputRefs.current[index] = e}
          onInput={(e) => handleInput(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          />

        ))}

      </div>

      <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Verify Email</button>
      
      </form>
    </div>
  )
}

export default EmailVerify
