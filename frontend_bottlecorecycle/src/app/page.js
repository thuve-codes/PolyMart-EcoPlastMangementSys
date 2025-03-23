"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    bottleType: '',
    weight: '',
    feedback: '',
    name: '',
    email: '',
    contactNumber: '',
    address: '',
    disposalPurpose: '',
    pickupDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // You can handle the form submission logic here (e.g., sending the data to a server)
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headingPrimary}>Plastic Bottle Collection</h1>
      <h2 className={styles.headingSecondary}>Plastic Collection Form</h2>
      
      <form onSubmit={handleSubmit}>
        <table className={`${styles.table} ${styles.centeredTable}`}>
          <tbody>
            {/* Name Input */}
            <tr>
              <td><label htmlFor="name">Name</label></td>
              <td><input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              /></td>
            </tr>

            {/* Email Input */}
            <tr>
              <td><label htmlFor="email">Email</label></td>
              <td><input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              /></td>
            </tr>

            {/* Contact Number Input */}
            <tr>
              <td><label htmlFor="contactNumber">Contact Number</label></td>
              <td><input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              /></td>
            </tr>

            {/* Address Input */}
            <tr>
              <td><label htmlFor="address">Address</label></td>
              <td><textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              /></td>
            </tr>

            {/* Bottle Type Input */}
            <tr>
              <td><label htmlFor="bottleType">Bottle Type</label></td>
              <td><select
                id="bottleType"
                name="bottleType"
                value={formData.bottleType}
                onChange={handleChange}
                required
              >
                <option value="">Select Bottle Type</option>
                <option value="plastic">Plastic</option>
                <option value="glass">Glass</option>
                <option value="metal">Metal</option>
                <option value="other">Other</option>
              </select></td>
            </tr>

            {/* Weight of the Product Input */}
            <tr>
              <td><label htmlFor="weight">Weight of the Product (in kg)</label></td>
              <td><input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
              /></td>
            </tr>

            {/* Feedback Input */}
            <tr>
              <td><label htmlFor="feedback">Feedback</label></td>
              <td><textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
              /></td>
            </tr>

            {/* Purpose of Disposal */}
            <tr>
              <td><label htmlFor="disposalPurpose">Purpose of Disposal</label></td>
              <td><select
                id="disposalPurpose"
                name="disposalPurpose"
                value={formData.disposalPurpose}
                onChange={handleChange}
                required
              >
                <option value="">Select Purpose</option>
                <option value="recycle">Recycle</option>
                <option value="dispose">Dispose</option>
                <option value="reuse">Reuse</option>
                <option value="other">Other</option>
              </select></td>
            </tr>

            {/* Preferred Pickup Date */}
            <tr>
              <td><label htmlFor="pickupDate">Preferred Pickup Date</label></td>
              <td><input
                type="date"
                id="pickupDate"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                required
              /></td>
            </tr>

            {/* Submit Button */}
            <tr>
              <td colSpan="2">
              <button className={styles.submitButton} type="submit">Submitt</button>

              </td>
            </tr>
          </tbody>
          
        </table>
      </form>
      <div className={styles.imageContainer}>
        <Image 
          src="/images/uni.jpg"  
          alt="Plastic Bottle Collection" 
          width={500}  
          height={300} 
          objectFit="contain" 
          className={styles.centeredImage}
        />
      </div>
    </div>
    
  );
}
