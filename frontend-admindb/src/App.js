"use client";

import { useState, useEffect } from "react";
import Switch from "react-switch";
import jsPDF from "jspdf";
import logo from "./logo.png";

import jspdfAutoTable from "jspdf-autotable"; 


import {
  Home,
  Users,
  ShoppingCart,
  Mail,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Paperclip,
  Send,
  Edit,
  Trash,
  Plus,
  Check,
  X,
  Recycle,
} from "lucide-react";
import {
  LineChart,
  PieChart,
  Pie,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";

const API_BASE_URL = "http://localhost:5005/api"; // Update with your backend URL


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];


  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '8px',
    
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#e3342f', // red
    color: 'white',
    fontSize: '20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };
  const textStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#e3342f', // red
    textShadow: '2px 2px 5px rgba(0,0,0,0.2)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',

    textAlign: 'center',
    animation: 'pulse 1.5s infinite',
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = '#cc1f1a'; // darker red on hover
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = '#e3342f';
  };

function PolymartAdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]); // Added messages state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [requestSearchQuery, setRequestSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState({
    users: false,
    orders: false,
    requests: false,
    messages: false,
    stats: false,
  });
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeSellers: 0,
    totalOrders: 0,
    revenue: 0,
  });

  

  // Form states
  const [editedUserData, setEditedUserData] = useState({
    username: "",
    email: "",
    isAccountVerified: false,
  });
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    password: "",
    isAccountVerified: false,
  });
  const [editedOrderData, setEditedOrderData] = useState({
    customer: "",
    date: "",
    total: "",
    status: "Processing",
  });

  // Fetch data from backend
  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
    fetchOrders();
    fetchRequests();
    fetchMessages(); // Added messages fetch
    fetchProductCount();
  }, []);

  const fetchProductCount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/count`);
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();
      setStats({
        ...stats,
        totalProducts: data.total || 0,
      });
    } catch (error) {
      console.error("Error fetching product count:", error);
      showAlert("Failed to load products count");
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, stats: true }));
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();
      setStats({
        totalProducts: data.totalProducts || 0,
        activeSellers: data.activeSellers || 0,
        totalOrders: data.totalOrders || 0,
        revenue: data.revenue || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      showAlert("Successfully loaded dashboard statistics");
    } finally {
      setIsLoading((prev) => ({ ...prev, stats: false }));
    }
  };
  // Add this function within the PolymartAdminDashboard component
  // Modify the generatePDFReport function to include orders data correctly
  const generatePDFReport = async (tab, orders = []) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = 20;
    
    // Add logo (assuming you have a logo URL)
    try {
        const logoWidth = 30;
        const logoHeight = 15;
        const logoX = pageWidth - margin - logoWidth;
        const logoY = margin;
        
        const logoData = await getBase64ImageFromURL(logo);
        doc.addImage(logoData, 'PNG', logoX, logoY, logoWidth, logoHeight);
    } catch (e) {
        console.warn("Could not load logo:", e);
    }

    // Header with improved styling
    doc.setFontSize(20);
    doc.setTextColor("#e3342f");
    doc.setFont("helvetica", "bold");
    doc.text("Polymart Admin Report", pageWidth / 2, y, { align: "center" });
    
    y += 12;
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    
    y += 15;
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text(`Report Type: ${tab.charAt(0).toUpperCase() + tab.slice(1)}`, margin, y);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth - margin, y, { align: "right" });
    
    y += 20;

    // Orders Report Content
    if (tab === "orders") {
        // Summary section with boxes
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, y, pageWidth - margin * 2, 25, 'F');
        
        doc.setFontSize(14);
        doc.setTextColor("#e3342f");
        doc.setFont("helvetica", "bold");
        doc.text("Order Management", margin + 5, y + 8);
        
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFont("helvetica", "normal");
        doc.text(`Total Orders: ${orders.length || 0}`, margin + 5, y + 18);
        
        const revenue = orders.reduce((total, order) => total + (order.total || 0), 0);
        doc.text(`Total Revenue: LKR ${revenue.toLocaleString()}`, pageWidth - margin - 5, y + 18, { align: "right" });
        
        y += 35;

        // Orders Table with improved styling
        doc.setFontSize(14);
        doc.setTextColor("#e3342f");
        doc.setFont("helvetica", "bold");
        doc.text("Recent Orders", margin, y);
        y += 10;
        
        const headers = ["Order ID", "Customer", "Date", "Amount", "Status"];
        const data = (orders || []).slice(0, 10).map((order) => [
            order._id ? order._id.substring(0, 8) + '...' : 'N/A',
            order.buyer && order.buyer.length > 15 ? order.buyer.substring(0, 12) + '...' : order.buyer || 'N/A',
            order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB") : 'N/A',
            order.total ? `LKR ${order.total.toLocaleString()}` : 'N/A',
            { content: order.status || 'N/A', styles: { textColor: getStatusColor(order.status) } }
        ]);
        
        doc.autoTable({
            startY: y,
            head: [headers],
            body: data,
            theme: "grid",
            headStyles: { 
                fillColor: "#e3342f", 
                textColor: "#ffffff",
                fontStyle: "bold",
                fontSize: 10
            },
            bodyStyles: {
                fontSize: 9
            },
            alternateRowStyles: {
                fillColor: 245
            },
            margin: { left: margin, right: margin },
            styles: { overflow: "linebreak", cellWidth: "wrap" },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 35 },
                2: { cellWidth: 25 },
                3: { cellWidth: 25 },
                4: { cellWidth: 25 }
            }
        });
        
        y = doc.lastAutoTable.finalY + 15;
        
        // Add summary statistics
        if (y < pageHeight - 40) {
            const statusCounts = orders.reduce((acc, order) => {
                acc[order.status] = (acc[order.status] || 0) + 1;
                return acc;
            }, {});
            
            doc.setFontSize(12);
            doc.setTextColor("#e3342f");
            doc.setFont("helvetica", "bold");
            doc.text("Order Status Distribution", margin, y);
            y += 8;
            
            doc.setFontSize(10);
            doc.setTextColor(0);
            doc.setFont("helvetica", "normal");
            
            let xPos = margin;
            for (const [status, count] of Object.entries(statusCounts)) {
                const percentage = orders.length ? ((count / orders.length) * 100).toFixed(1) : 0;
                doc.setTextColor(getStatusColor(status));
                doc.text(`${status}: ${count} (${percentage}%)`, xPos, y);
                xPos += 50;
                if (xPos > pageWidth - 100) {
                    xPos = margin;
                    y += 7;
                }
            }
            y += 15;
        }
    }

    // Footer with improved styling
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
    
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`© ${new Date().getFullYear()} Polymart Admin. All rights reserved.`, pageWidth / 2, pageHeight - 12, { align: "center" });
    doc.text(`Page 1 of 1`, pageWidth - margin, pageHeight - 12, { align: "right" });

    const dateStr = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    doc.save(`Polymart_${tab}_Report_${dateStr}.pdf`);
  };
// Helper function to get status color
function getStatusColor(status) {
    const colors = {
        'completed': '#38c172',
        'pending': '#f6993f',
        'cancelled': '#e3342f',
        'shipped': '#3490dc'
    };
    return colors[status.toLowerCase()] || '#000';
}

// Helper function to convert image URL to base64
function getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            
            const dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
        };
        
        img.onerror = error => {
            reject(error);
        };
        
        img.src = url;
    });
}
  const fetchUsers = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, users: true }));
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      showAlert("Failed to load users");
    } finally {
      setIsLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, orders: true }));
      const response = await fetch(`${API_BASE_URL}/orders`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      showAlert("Failed to load orders");
    } finally {
      setIsLoading((prev) => ({ ...prev, orders: false }));
    }
  };

  const fetchRequests = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, requests: true }));
      const response = await fetch(`${API_BASE_URL}/requests`);
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      setRequests(data.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      showAlert("Failed to load plastic collection requests");
    } finally {
      setIsLoading((prev) => ({ ...prev, requests: false }));
    }
  };

  const fetchMessages = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, messages: true }));
      const response = await fetch(`${API_BASE_URL}/chats`);
      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }
      const { data } = await response.json();
      // Group chats by sellerName-user pair
      const groupedChats = data.reduce((acc, chat) => {
        const user = chat.messages.find((msg) => msg.sender !== chat.sellerName)?.sender || "Unknown";
        const key = `${chat.sellerName}-${user}`;
        if (!acc[key]) {
          acc[key] = { ...chat, user, conversationId: key };
        }
        return acc;
      }, {});
      setMessages(Object.values(groupedChats));
    } catch (error) {
      console.error("Error fetching chats:", error);
      showAlert("Failed to load chats");
    } finally {
      setIsLoading((prev) => ({ ...prev, messages: false }));
    }
  };

  const filteredMessages = messages.filter(
    (message) =>
      message.sellerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.productName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchQuery.toLowerCase()),
  );

  const filteredRequests = requests?.filter(
    (request) =>
      request.name?.toLowerCase().includes(requestSearchQuery.toLowerCase()) ||
      request._id?.toLowerCase().includes(requestSearchQuery.toLowerCase()) ||
      request.status?.toLowerCase().includes(requestSearchQuery.toLowerCase()),
  );

  const handleReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: selectedMessage.productName,
          sellerName: selectedMessage.sellerName,
          sender: selectedMessage.sellerName,
          text: replyContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reply");
      }

      const { data } = await response.json();
      setMessages((prev) =>
        prev.map((msg) => (msg.id === data.id ? { ...data, user: msg.user, conversationId: msg.conversationId } : msg)),
      );
      setReplyContent("");
      setIsReplying(false);
      showAlert("Reply sent successfully!");
    } catch (error) {
      console.error("Error sending reply:", error);
      showAlert("Failed to send reply");
    }
  };
  const handleAttachmentChange = (e) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };


  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditedUserData({
      username: user.username || "",
      email: user.email || "",
      isAccountVerified: user.isAccountVerified || false,
    });
    setShowUserEditModal(true);
  };

  const handleSaveUserEdit = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUserData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      // Update user in the state
      const updatedUsers = users.map((user) =>
        user._id === editingUser._id ? { ...user, ...editedUserData } : user,
      );
      setUsers(updatedUsers);

      // Close modal
      setShowUserEditModal(false);
      showAlert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      showAlert("Failed to update user");
    }
  };

  // filepath: c:\Users\thuve\Desktop\dev - polymart\PolyMart-EcoPlastMangementSys\frontend-admindb\src\App.js
const handleAddUser = async () => {
  try {
      const response = await fetch(`${API_BASE_URL}/users`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(newUserData),
      });

      if (!response.ok) {
          // Check if the response is JSON
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
              const errorData = await response.json();
              throw new Error(errorData.message || "Failed to add user");
          } else {
              throw new Error("Unexpected response from server");
          }
      }

      const newUser = await response.json();

      if (!newUser || !newUser.data) {
          throw new Error("Invalid response from server");
      }

      // Add to users array
      setUsers([...users, newUser.data]);

      // Close modal and reset form
      setShowAddUserModal(false);
      setNewUserData({
          username: "",
          email: "",
          password: "",
          isAccountVerified: false,
      });

      showAlert("User added successfully!");
  } catch (error) {
      console.error("Error adding user:", error);
      showAlert(error.message || "Failed to add user");
  }
};
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setEditedOrderData({
      user: order?.user || {},
      date: order?.createdAt || "",
      total: order?.total || "",
      status: order?.status || "Unavailable",
    });
  };

  const handleSaveOrderEdit = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${selectedOrder._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: editedOrderData.status,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      const updatedOrder = await response.json();

      // Update order in the state
      const updatedOrders = orders.map((order) =>
        order._id === selectedOrder._id
          ? { ...order, status: updatedOrder.status }
          : order,
      );
      setOrders(updatedOrders);

      // Close the order view
      setSelectedOrder(null);
      showAlert("Order updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
      showAlert("Failed to update order");
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action.toLowerCase()} request`);
      }

      const updatedRequests = requests.map((request) => {
        if (request._id === requestId) {
          return { ...request, status: action };
        }
        return request;
      });
      setRequests(updatedRequests);
      showAlert(`Request ${action.toLowerCase()} successfully!`);
      setSelectedRequest(null);
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing request:`, error);
      showAlert(`Failed to ${action.toLowerCase()} request`);
    }
  };

  const handleDeleteOrder = async (order) => {
    if (!order) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${order._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const updatedOrders = orders.filter(
          (existingOrder) => existingOrder._id !== order._id,
        );
        setOrders(updatedOrders); // Update the orders state with the new list
        showAlert("Order deleted successfully!"); // Show success message
      } else {
        throw new Error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error Deleting order:", error);
      showAlert("Failed to delete order");
    }
  };
  const handleDeleteRequest = async (request) => {
    if (!request) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${request._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const updatedReq = requests.filter(
          (existingRequests) => existingRequests._id !== request._id,
        );
        setRequests(updatedReq); // Update the orders state with the new list
        showAlert("Request deleted successfully!"); // Show success message
        setSelectedRequest(null);
      } else {
        throw new Error("Failed to delete request");
      }
    } catch (error) {
      console.error("Error Deleting request:", error);
      showAlert("Failed to delete request");
    }
  };

  const showAlert = (message) => {
    const successAlert = document.getElementById("success-alert");
    if (successAlert) {
      successAlert.textContent = message;
      successAlert.classList.remove("d-none");
      setTimeout(() => {
        successAlert.classList.add("d-none");
      }, 3000);
    }
  };
  const renderMessageDetail = () => (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setSelectedMessage(null)}
        >
          <ChevronLeft className="me-2" />
          Back to chats
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Chat: {selectedMessage.productName}</h3>
          <p className="card-text">
            Conversation: {selectedMessage.conversationId} | Last Message: {selectedMessage.date}
          </p>
        </div>
        <div className="card-body">
          <div className="border rounded p-3 bg-light">
            {selectedMessage.messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 ${
                  msg.sender === selectedMessage.sellerName ? "text-end" : "text-start"
                }`}
              >
                <p className="mb-1">
                  <strong>{msg.sender}:</strong> {msg.text}
                </p>
                <small className="text-muted">{msg.date}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end">
          <button
            className={`btn ${
              isReplying ? "btn-secondary" : "btn-outline-secondary"
            } me-2`}
            onClick={() => setIsReplying(!isReplying)}
          >
            {isReplying ? "Cancel Reply" : "Reply"}
          </button>
        </div>
      </div>

      {isReplying && (
        <div className="card mt-3">
          <div className="card-header">
            <h3 className="card-title">Reply to {selectedMessage.user}</h3>
            <p className="card-text">Product: {selectedMessage.productName} | As: {selectedMessage.sellerName}</p>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Your Reply</label>
              <textarea
                className="form-control min-h-200"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Type your reply here..."
              ></textarea>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-end">
            <button
              className="btn btn-primary"
              onClick={handleReply}
              disabled={!replyContent.trim()}
            >
              <Send className="me-2" />
              Send Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
  const renderOrderDetail = () => {
    if (!selectedOrder) return null;

    return (
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setSelectedOrder(null)}
          >
            <ChevronLeft className="me-2" />
            Back to orders
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Order Details</h3>
            <p className="card-text">Order ID: {selectedOrder._id}</p>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Customer</label>
              <input
                type="text"
                disabled={true}
                className="form-control"
                value={editedOrderData?.buyer || selectedOrder?.buyer|| ""}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="text"
                disabled={true}
                className="form-control"
                value={new Date(editedOrderData?.date).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  },
                )}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Total amount:</label>
              <input
                type="text"
                disabled={true}
                className="form-control"
                value={`LKR ${editedOrderData.total}.00`}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={editedOrderData.status}
                onChange={(e) =>
                  setEditedOrderData({
                    ...editedOrderData,
                    status: e.target.value,
                  })
                }
              >
                <option value="Delivered">Delivered</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-end">
            <button
              className="btn btn-secondary me-2"
              onClick={() => setSelectedOrder(null)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveOrderEdit}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderRequestDetail = () => {
    if (!selectedRequest) return null;

    return (
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setSelectedRequest(null)}
          >
            <ChevronLeft className="me-2" />
            Back to requests
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Plastic Collection Request</h3>
            <p className="card-text">Request ID: {selectedRequest?._id}</p>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">User</label>
              <input
                type="text"
                className="form-control"
                value={selectedRequest?.name}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Pickup date</label>
              <input
                type="text"
                className="form-control"
                value={new Date(selectedRequest?.pickupDate).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  },
                )}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={selectedRequest?.address}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Feedback</label>
              <textarea
                className="form-control"
                value={selectedRequest?.feedback}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Plastics Collected</label>
              <table className="table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Quantity (kgs)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{selectedRequest?.bottleType}</td>
                    <td>{selectedRequest?.weight}</td>
                  </tr>
                  {/*<tr className="fw-bold">*/}
                  {/*  <td>Total</td>*/}
                  {/*  <td>*/}
                  {/*    {selectedRequest.plastics*/}
                  {/*      ? selectedRequest.plastics.reduce(*/}
                  {/*          (total, plastic) => total + (plastic.kgs || 0),*/}
                  {/*          0,*/}
                  {/*        )*/}
                  {/*      : 0}{" "}*/}
                  {/*    kgs*/}
                  {/*  </td>*/}
                  {/*</tr>*/}
                </tbody>
              </table>
            </div>

            <div className="mb-3">
              <label className="form-label">Status</label>
              <div className="d-flex align-items-center">
                <span
                  className={`badge ${
                    selectedRequest?.status === "Completed"
                      ? "bg-success"
                      : selectedRequest?.status === "Pending"
                        ? "bg-danger"
                        : "bg-warning"
                  } me-3`}
                >
                  {selectedRequest?.status}
                </span>
              </div>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-end">
            {selectedRequest?.status === "Pending" ||
            selectedRequest?.status === "Picked Up" ? (
              <>
                <button
                  className="btn btn-success me-2"
                  onClick={() =>
                    handleRequestAction(selectedRequest._id, "Completed")
                  }
                >
                  <Check className="me-1" />
                  Complete
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteRequest(selectedRequest)}
                >
                  <Trash size={18} className="mb-1" />
                  Delete
                </button>
              </>
            ) : (
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteRequest(selectedRequest)}
              >
                <Trash size={18} className="mb-1" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        const monthlySales = [];

        const salesData = orders.reduce((acc, order) => {
          const date = new Date(order.createdAt);
          const month = date.toLocaleString("default", { month: "short" });
          const year = date.getFullYear();
          const monthYear = `${month} ${year}`;

          if (!acc[monthYear]) {
            acc[monthYear] = 0;
          }

          acc[monthYear] += order.total;
          return acc;
        }, {});

        for (const key in salesData) {
          monthlySales.push({ month: key, total: salesData[key] });
        }

        const totalRevenue = orders.reduce((total, order) => {
          return total + (order.total || 0); // protect if some order.amount is undefined
        }, 0);

        // Prepare pie data
        const statusCounts = orders.reduce((acc, order) => {
          const status = order.status || "Unknown";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const getStatusColor = (status) => {
          switch (status) {
            case "Delivered":
              return "#28a745"; // green (bootstrap success)
            case "Shipped":
              return "#17a2b8"; // info blue
            case "Cancelled":
              return "#dc3545"; // danger red
            case "Processing":
              return "#ffc107"; // warning yellow
            default:
              return "#dc3545"; // default red for unknown statuses
          }
        };

        const pieData = Object.entries(statusCounts).map(
          ([status, count, colour]) => ({
            status,
            count,
            colour: getStatusColor(status),
          }),
        );

        return (
          <div className="mb-4">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px',height: '10vh', flexDirection: 'column' }}>
            <h1 style={textStyle}>HELLO ADMIN!</h1>
          </div>
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card">
                  <div className="card-header">
                    <p className="card-text">Total Products</p>
                    <h3 className="card-title fs-1">{stats.totalProducts}</h3>
                  </div>
                  <div className="card-body">
                    <div className="text-muted">+12% from last month</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-header">
                    <p className="card-text">Active Customers</p>
                    <h3 className="card-title fs-1">
                      {users?.filter((u) => u.role === "user").length}
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="text-muted">+5% from last month</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-header">
                    <p className="card-text">Total Orders</p>
                    <h3 className="card-title fs-1">{orders?.length}</h3>
                  </div>
                  <div className="card-body">
                    <div className="text-muted">+18% from last month</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-header">
                    <p className="card-text">Total Sales</p>
                    <h3 className="card-title fs-1">
                      LKR {totalRevenue.toLocaleString()}
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="text-muted">+22% from last month</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Sales Overview</h3>
                  </div>
                  <div className="card-body" style={{ height: "300px" }}>
                    {isLoading.stats ? (
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlySales}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Order Status Track</h3>
                  </div>
                  <div className="card-body" style={{ height: "300px" }}>
                    {isLoading.stats ? (
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            label={({ status, percent }) =>
                              `${status}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.colour} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name, props) => [
                              `${value}`,
                              `${props.payload.status}`,
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="card-title">Recent Orders</h3>
                  <button
                    className="btn btn-link"
                    onClick={() => setActiveTab("orders")}
                  >
                    View all <ArrowRight className="ms-2" />
                  </button>
                </div>
              </div>
              <div className="card-body">
                {isLoading.orders ? (
                  <div className="d-flex justify-content-center align-items-center py-5">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt),
                        )
                        .slice(0, 4)
                        .map((order) => (
                          <tr key={order?._id}>
                            <td>{order?._id}</td>
                            <td>{order?.buyer}</td>
                            <td>
                              {new Date(order?.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </td>
                            <td>LKR {order?.total?.toLocaleString()}.00</td>
                            <td>
                              <span
                                className={`badge ${
                                  order.status === "Delivered"
                                    ? "bg-success"
                                    : order.status === "Shipped"
                                      ? "bg-info"
                                      : order.status === "Cancelled"
                                        ? "bg-danger"
                                        : order.status === "Processing"
                                          ? "bg-warning"
                                          : "bg-danger"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="card mt-4">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="card-title">Recent Users</h3>
                  <button
                    className="btn btn-link"
                    onClick={() => setActiveTab("users")}
                  >
                    View all <ArrowRight className="ms-2" />
                  </button>
                </div>
              </div>
              <div className="card-body">
                {isLoading.users ? (
                  <div className="d-flex justify-content-center align-items-center py-5">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 4).map((user) => (
                        <tr key={user._id}>
                          <td>{user._id}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>
                            <span
                              className={`badge ${user.isAccountVerified ? "bg-success" : "bg-danger"}`}
                            >
                              {user.isAccountVerified
                                ? "verified"
                                : "Unverified"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div style={containerStyle}>
      <button
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => (window.location.href = "http://localhost:3001/")}
      >
        Sign Out
      </button>
    </div>


          </div>
        );

      case "users":
        return (
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h4">User Management</h2>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Search users..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddUserModal(true)}
                >
                  <Plus size={16} className="me-1" />
                  Add User
                </button>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                {isLoading.users ? (
                  <div className="d-flex justify-content-center align-items-center py-5">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>User ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                              <span
                                className={`badge ${user.isAccountVerified ? "bg-success" : "bg-danger"}`}
                              >
                                {user.isAccountVerified
                                  ? "verified"
                                  : "Unverified"}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex">
                                <button
                                  className="btn btn-outline-primary btn-sm me-2"
                                  onClick={() => handleEditUser(user)}
                                >
                                  <Edit size={16} className="me-1" />
                                  Edit
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={async () => {
                                    try {
                                      const response = await fetch(
                                        `${API_BASE_URL}/users/${user._id}`,
                                        {
                                          method: "DELETE",
                                        },
                                      );

                                      if (!response.ok) {
                                        throw new Error(
                                          "Failed to delete user",
                                        );
                                      }

                                      setUsers(
                                        users.filter((u) => u._id !== user._id),
                                      );
                                      setOrders(
                                        orders.filter(
                                          (order) =>
                                            order.user._id !== user._id,
                                        ),
                                      );
                                      showAlert("User deleted successfully!");
                                    } catch (error) {
                                      console.error(
                                        "Error deleting user:",
                                        error,
                                      );
                                      showAlert("User deleted successfully!");
                                    }
                                  }}
                                >
                                  <Trash size={16} className="" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="card-footer d-flex justify-content-between">
                      <div className="text-muted">
                        Showing 1 to {filteredUsers.length} of {users.length}{" "}
                        entries
                      </div>
                      <div className="d-flex">
                        <button className="btn btn-outline-secondary btn-sm me-2">
                          <ChevronLeft size={16} />
                        </button>
                        <button className="btn btn-outline-secondary btn-sm">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case "orders":
        return selectedOrder ? (
          renderOrderDetail()
        ) : (
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h4">Order Management</h2>
              <div className="d-flex">
                <button
                  className="btn btn-primary"
                  onClick={() => generatePDFReport("orders", orders)}
                >
                  Generate Report
                </button>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                {isLoading.orders ? (
                  <div className="d-flex justify-content-center align-items-center py-5">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order?._id}>
                            <td>{order?._id}</td>
                            <td>{order?.buyer}</td>
                            <td>
                              {new Date(order?.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </td>
                            <td>LKR {order?.total?.toLocaleString()}.00</td>
                            <td>
                              <span
                                className={`badge ${
                                  order.status === "Delivered"
                                    ? "bg-success"
                                    : order.status === "Shipped"
                                      ? "bg-info"
                                      : order.status === "Cancelled"
                                        ? "bg-danger"
                                        : order.status === "Processing"
                                          ? "bg-warning"
                                          : "bg-danger"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex">
                                <button
                                  className="btn btn-outline-primary btn-sm me-2"
                                  onClick={() => handleEditOrder(order)}
                                >
                                  Edit Status
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDeleteOrder(order)}
                                >
                                  <Trash size={16} className="" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="card-footer d-flex justify-content-between">
                      <div className="text-muted">
                        Showing 1 to {orders.length} of {orders.length} entries
                      </div>
                      <div className="d-flex">
                        <button className="btn btn-outline-secondary btn-sm me-2">
                          <ChevronLeft size={16} />
                        </button>
                        <button className="btn btn-outline-secondary btn-sm">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case "requests":
        return selectedRequest ? (
          renderRequestDetail()
        ) : (
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h4">Plastic Collection Requests</h2>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Search requests..."
                  value={requestSearchQuery}
                  onChange={(e) => setRequestSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                {isLoading.requests ? (
                  <div className="d-flex justify-content-center align-items-center py-5">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Request ID</th>
                          <th>User</th>
                          <th>Date</th>
                          <th>Total Plastics (kgs)</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRequests.map((request) => (
                          <tr key={request._id}>
                            <td>{request._id}</td>
                            <td>{request.name}</td>
                            <td>
                              {new Date(request?.pickupDate).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </td>
                            <td>
                              {request.weight}
                              kgs
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  request.status === "Completed"
                                    ? "bg-success"
                                    : request.status === "Pending"
                                      ? "bg-danger"
                                      : "bg-warning"
                                }`}
                              >
                                {request.status}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => setSelectedRequest(request)}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="card-footer d-flex justify-content-between">
                      <div className="text-muted">
                        Showing 1 to {filteredRequests.length} of{" "}
                        {requests.length} entries
                      </div>
                      <div className="d-flex">
                        <button className="btn btn-outline-secondary btn-sm me-2">
                          <ChevronLeft size={16} />
                        </button>
                        <button className="btn btn-outline-secondary btn-sm">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      

      case "messages":
          return selectedMessage ? (
            renderMessageDetail()
          ) : (
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4">Messages</h2>
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Conversation</th>
                      <th>Product</th>
                      <th>Last Message</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                      {filteredMessages.map((message) => (
                        <tr key={message.conversationId} className={!message.read ? "fw-bold" : ""}>
                          <td>{message.conversationId}</td>
                          <td>{message.productName}</td>
                          <td>{message.date}</td>
                          <td>
                            {message.read ? (
                              <span className="text-muted">Read</span>
                            ) : (
                              <span className="text-primary">Unread</span>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => setSelectedMessage(message)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <div className="text-muted">
                    Showing 1 to {filteredMessages.length} of {messages.length} entries
                  </div>
                  <div className="d-flex">
                    <button className="btn btn-outline-secondary btn-sm me-2">
                      <ChevronLeft size={16} />
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
    }
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className="bg-light border-end" style={{ width: "250px" }}>
        <div className="p-3">
          <h1 className="h5">Polymart Admin</h1>
        </div>
        <nav className="nav flex-column p-2">
          <button
            className={`btn d-flex align-items-center mb-1 ${
              activeTab === "dashboard"
                ? "btn-secondary"
                : "btn-link text-decoration-none text-dark"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Home className="me-2" />
            Dashboard
          </button>
          <button
            className={`btn d-flex align-items-center mb-1 ${
              activeTab === "users"
                ? "btn-secondary"
                : "btn-link text-decoration-none text-dark"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users className="me-2" />
            Users
          </button>
          <button
            className={`btn d-flex align-items-center mb-1 ${
              activeTab === "orders"
                ? "btn-secondary"
                : "btn-link text-decoration-none text-dark"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart className="me-2" />
            Orders
          </button>
          <button
            className={`btn d-flex align-items-center mb-1 ${
              activeTab === "requests"
                ? "btn-secondary"
                : "btn-link text-decoration-none text-dark"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            <Recycle className="me-2" />
            Plastic Requests
          </button>
          <button
            className={`btn d-flex align-items-center mb-1 ${
              activeTab === "messages"
                ? "btn-secondary"
                : "btn-link text-decoration-none text-dark"
            }`}
            onClick={() => setActiveTab("messages")}
          >
            <Mail className="me-2" />
            Messages
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {/* Success Alert */}
        <div
          className="alert alert-success alert-dismissible fade show d-none"
          role="alert"
          id="success-alert"
        >
          Operation completed successfully!
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>

        {renderTabContent()}
      </div>

      {/* User Edit Modal */}
      {showUserEditModal && editingUser && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUserEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">User ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingUser._id}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedUserData.username}
                    onChange={(e) =>
                      setEditedUserData({
                        ...editedUserData,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    disabled
                    className="form-control"
                    value={editedUserData.email}
                  />
                </div>
                <div className="mb-3 d-flex align-items-center gap-2">
                  <label className="form-label mt-1">Verified</label>
                  <Switch
                    id="accountVerified"
                    onChange={(checked) =>
                      setEditedUserData({
                        ...editedUserData,
                        isAccountVerified: checked, // Set true if checked, false if unchecked
                      })
                    }
                    checked={editedUserData?.isAccountVerified}
                    uncheckedIcon={false} // Optionally, you can hide text/icons for better visuals
                    checkedIcon={false}
                    offColor="#888" // Color for unchecked state
                    onColor="#007bff" // Color for checked state (green for verified)
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowUserEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveUserEdit}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddUserModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newUserData.username}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, username: e.target.value })
                    }
                    placeholder="Enter user name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newUserData.email}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, email: e.target.value })
                    }
                    placeholder="Enter user email"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newUserData.password}
                    onChange={(e) =>
                      setNewUserData({
                        ...newUserData,
                        password: e.target.value,
                      })
                    }
                    placeholder="Enter user password"
                  />
                </div>
                <label className="form-label mt-1">User Verification</label>
                <div className="mb-2 d-flex align-items-center gap-2">
                  <Switch
                    id="accountVerified"
                    onChange={(checked) =>
                      setNewUserData({
                        ...newUserData,
                        isAccountVerified: checked, // Set true if checked, false if unchecked
                      })
                    }
                    checked={newUserData?.isAccountVerified}
                    uncheckedIcon={false} // Optionally, you can hide text/icons for better visuals
                    checkedIcon={false}
                    offColor="#888" // Color for unchecked state
                    onColor="#007bff" // Color for checked state (green for verified)
                  />
                  <label className="mt-0">
                    {newUserData.isAccountVerified ? "Verified" : "Unverified"}
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddUserModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddUser}
                  disabled={!newUserData.username || !newUserData.email}
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <PolymartAdminDashboard />
    </div>
  );
}

export default App;

// "use client";

// import { useState, useEffect } from "react";
// import Switch from "react-switch";

// const generatePDFReport = (tab) => {
//   const doc = new jsPDF();

//   // Load custom font (Roboto)
//   doc.addFont('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxM.woff', 'Roboto', 'normal');
//   doc.setFont('Roboto');

//   // Company logo (replace with your actual logo URL or base64 image)
//   const logoUrl = 'https://via.placeholder.com/150x50.png?text=Polymart+Logo'; // Replace with your logo
//   const addLogo = () => {
//     doc.addImage(logoUrl, 'PNG', 10, 10, 50, 15);
//   };

//   // Header function
//   const addHeader = (reportTitle) => {
//     addLogo();
//     doc.setFontSize(24);
//     doc.setTextColor('#e3342f');
//     doc.text(reportTitle, doc.internal.pageSize.getWidth() / 2, 35, { align: 'center' });
//     doc.setFontSize(12);
//     doc.setTextColor('#4a5568');
//     doc.text(`Generated on: ${new Date().toLocaleString('en-GB')}`, 10, 40);
//   };

//   // Footer function
//   const addFooter = () => {
//     const pageCount = doc.internal.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//       doc.setPage(i);
//       doc.setFontSize(10);
//       doc.setTextColor('#4a5568');
//       doc.text('Polymart Inc. | www.polymart.com | support@polymart.com', 10, doc.internal.pageSize.getHeight() - 10);
//       doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
//     }
//   };

//   // Cover page
//   doc.setFillColor('#f7fafc');
//   doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
//   addLogo();
//   doc.setFontSize(36);
//   doc.setTextColor('#2d3748');
//   doc.text('Polymart', doc.internal.pageSize.getWidth() / 2, 80, { align: 'center' });
//   doc.setFontSize(24);
//   doc.text('Admin Report', doc.internal.pageSize.getWidth() / 2, 100, { align: 'center' });
//   doc.setFontSize(16);
//   doc.setTextColor('#4a5568');
//   doc.text(tab.charAt(0).toUpperCase() + tab.slice(1) + ' Overview', doc.internal.pageSize.getWidth() / 2, 120, { align: 'center' });
//   doc.text(`Generated: ${new Date().toLocaleString('en-GB')}`, doc.internal.pageSize.getWidth() / 2, 140, { align: 'center' });

//   // Add new page for content
//   doc.addPage();
//   addHeader(`${tab.charAt(0).toUpperCase() + tab.slice(1)} Report`);

//   // Add content based on tab
//   if (tab === 'orders') {
//     // Orders table
//     doc.autoTable({
//       head: [['Order ID', 'Customer', 'Date', 'Amount', 'Status']],
//       body: orders.slice(0, 10).map(order => [
//         order._id,
//         order.buyer,
//         new Date(order.createdAt).toLocaleDateString('en-GB'),
//         `LKR ${order.total.toLocaleString()}.00`,
//         order.status
//       ]),
//       startY: 50,
//       theme: 'striped',
//       headStyles: {
//         fillColor: '#e3342f',
//         textColor: '#ffffff',
//         fontSize: 12,
//         font: 'Roboto'
//       },
//       bodyStyles: {
//         fontSize: 10,
//         font: 'Roboto',
//         textColor: '#2d3748'
//       },
//       alternateRowStyles: {
//         fillColor: '#f7fafc'
//       },
//       margin: { top: 50 },
//       didDrawPage: () => {
//         addHeader(`${tab.charAt(0).toUpperCase() + tab.slice(1)} Report`);
//       }
//     });
//   }

//   // Add footer to all pages
//   addFooter();

//   // Save the PDF
//   doc.save(`Polymart_${tab}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
// };

// import {
//   Home,
//   Users,
//   ShoppingCart,
//   Mail,
//   ArrowRight,
//   ChevronRight,
//   ChevronLeft,
//   Paperclip,
//   Send,
//   Edit,
//   Trash,
//   Plus,
//   Check,
//   X,
//   Recycle,
// } from "lucide-react";
// import {
//   LineChart,
//   PieChart,
//   Pie,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Dashboard.css";
// import { Button } from "bootstrap";

// const API_BASE_URL = "http://localhost:5005/api"; // Update with your backend URL


// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];


//   const containerStyle = {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: '20px',
//     borderRadius: '8px',
    
//   };

//   const buttonStyle = {
//     padding: '10px 20px',
//     backgroundColor: '#e3342f', // red
//     color: 'white',
//     fontSize: '20px',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     transition: 'background-color 0.3s ease',
//   };
//   const textStyle = {
//     fontSize: '36px',
//     fontWeight: 'bold',
//     color: '#e3342f', // red
//     textShadow: '2px 2px 5px rgba(0,0,0,0.2)',
//     letterSpacing: '2px',
//     textTransform: 'uppercase',
//     fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',

//     textAlign: 'center',
//     animation: 'pulse 1.5s infinite',
//   };

//   const handleMouseEnter = (e) => {
//     e.target.style.backgroundColor = '#cc1f1a'; // darker red on hover
//   };

//   const handleMouseLeave = (e) => {
//     e.target.style.backgroundColor = '#e3342f';
//   };

// function PolymartAdminDashboard() {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [replyContent, setReplyContent] = useState("");
//   const [isReplying, setIsReplying] = useState(false);
//   const [attachments, setAttachments] = useState([]);
//   const [isSending, setIsSending] = useState(false);
//   const [showUserEditModal, setShowUserEditModal] = useState(false);
//   const [showAddUserModal, setShowAddUserModal] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [messages, setMessages] = useState([]); // Added messages state
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [userSearchQuery, setUserSearchQuery] = useState("");
//   const [requestSearchQuery, setRequestSearchQuery] = useState("");
//   const [isLoading, setIsLoading] = useState({
//     users: false,
//     orders: false,
//     requests: false,
//     messages: false,
//     stats: false,
//   });
//   const [stats, setStats] = useState({
//     totalProducts: 0,
//     activeSellers: 0,
//     totalOrders: 0,
//     revenue: 0,
//   });

  

//   // Form states
//   const [editedUserData, setEditedUserData] = useState({
//     username: "",
//     email: "",
//     isAccountVerified: false,
//   });
//   const [newUserData, setNewUserData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     isAccountVerified: false,
//   });
//   const [editedOrderData, setEditedOrderData] = useState({
//     customer: "",
//     date: "",
//     total: "",
//     status: "Processing",
//   });

//   // Fetch data from backend
//   useEffect(() => {
//     fetchDashboardStats();
//     fetchUsers();
//     fetchOrders();
//     fetchRequests();
//     fetchMessages(); // Added messages fetch
//     fetchProductCount();
//   }, []);

//   const fetchProductCount = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/products/count`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch stats");
//       }
//       const data = await response.json();
//       setStats({
//         ...stats,
//         totalProducts: data.total || 0,
//       });
//     } catch (error) {
//       console.error("Error fetching product count:", error);
//       showAlert("Failed to load products count");
//     }
//   };

//   const fetchDashboardStats = async () => {
//     try {
//       setIsLoading((prev) => ({ ...prev, stats: true }));
//       const response = await fetch(`${API_BASE_URL}/stats`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch stats");
//       }
//       const data = await response.json();
//       setStats({
//         totalProducts: data.totalProducts || 0,
//         activeSellers: data.activeSellers || 0,
//         totalOrders: data.totalOrders || 0,
//         revenue: data.revenue || 0,
//       });
//     } catch (error) {
//       console.error("Error fetching stats:", error);
//       showAlert("Failed to load dashboard statistics");
//     } finally {
//       setIsLoading((prev) => ({ ...prev, stats: false }));
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       setIsLoading((prev) => ({ ...prev, users: true }));
//       const response = await fetch(`${API_BASE_URL}/users`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch users");
//       }
//       const data = await response.json();
//       setUsers(data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       showAlert("Failed to load users");
//     } finally {
//       setIsLoading((prev) => ({ ...prev, users: false }));
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       setIsLoading((prev) => ({ ...prev, orders: true }));
//       const response = await fetch(`${API_BASE_URL}/orders`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch orders");
//       }
//       const data = await response.json();
//       setOrders(data);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       showAlert("Failed to load orders");
//     } finally {
//       setIsLoading((prev) => ({ ...prev, orders: false }));
//     }
//   };

//   const fetchRequests = async () => {
//     try {
//       setIsLoading((prev) => ({ ...prev, requests: true }));
//       const response = await fetch(`${API_BASE_URL}/requests`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch requests");
//       }
//       const data = await response.json();
//       setRequests(data.data);
//     } catch (error) {
//       console.error("Error fetching requests:", error);
//       showAlert("Failed to load plastic collection requests");
//     } finally {
//       setIsLoading((prev) => ({ ...prev, requests: false }));
//     }
//   };

//   const fetchMessages = async () => {
//     try {
//       setIsLoading((prev) => ({ ...prev, messages: true }));
//       const response = await fetch(`${API_BASE_URL}/chats`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch chats");
//       }
//       const { data } = await response.json();
//       // Group chats by sellerName-user pair
//       const groupedChats = data.reduce((acc, chat) => {
//         const user = chat.messages.find((msg) => msg.sender !== chat.sellerName)?.sender || "Unknown";
//         const key = `${chat.sellerName}-${user}`;
//         if (!acc[key]) {
//           acc[key] = { ...chat, user, conversationId: key };
//         }
//         return acc;
//       }, {});
//       setMessages(Object.values(groupedChats));
//     } catch (error) {
//       console.error("Error fetching chats:", error);
//       showAlert("Failed to load chats");
//     } finally {
//       setIsLoading((prev) => ({ ...prev, messages: false }));
//     }
//   };

//   const filteredMessages = messages.filter(
//     (message) =>
//       message.sellerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       message.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       message.productName?.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   const filteredUsers = users.filter(
//     (user) =>
//       user.username?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
//       user.email?.toLowerCase().includes(userSearchQuery.toLowerCase()),
//   );

//   const filteredRequests = requests?.filter(
//     (request) =>
//       request.name?.toLowerCase().includes(requestSearchQuery.toLowerCase()) ||
//       request._id?.toLowerCase().includes(requestSearchQuery.toLowerCase()) ||
//       request.status?.toLowerCase().includes(requestSearchQuery.toLowerCase()),
//   );

//   const handleReply = async () => {
//     if (!selectedMessage || !replyContent.trim()) return;

//     try {
//       const response = await fetch(`${API_BASE_URL}/chats`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           productName: selectedMessage.productName,
//           sellerName: selectedMessage.sellerName,
//           sender: selectedMessage.sellerName,
//           text: replyContent,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to send reply");
//       }

//       const { data } = await response.json();
//       setMessages((prev) =>
//         prev.map((msg) => (msg.id === data.id ? { ...data, user: msg.user, conversationId: msg.conversationId } : msg)),
//       );
//       setReplyContent("");
//       setIsReplying(false);
//       showAlert("Reply sent successfully!");
//     } catch (error) {
//       console.error("Error sending reply:", error);
//       showAlert("Failed to send reply");
//     }
//   };
//   const handleAttachmentChange = (e) => {
//     if (!e.target.files) return;
//     const files = Array.from(e.target.files);
//     setAttachments(files);
//   };

//   const removeAttachment = (index) => {
//     setAttachments(attachments.filter((_, i) => i !== index));
//   };


//   const handleEditUser = (user) => {
//     setEditingUser(user);
//     setEditedUserData({
//       username: user.username || "",
//       email: user.email || "",
//       isAccountVerified: user.isAccountVerified || false,
//     });
//     setShowUserEditModal(true);
//   };

//   const handleSaveUserEdit = async () => {
//     if (!editingUser) return;

//     try {
//       const response = await fetch(`${API_BASE_URL}/users/${editingUser._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(editedUserData),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update user");
//       }

//       // Update user in the state
//       const updatedUsers = users.map((user) =>
//         user._id === editingUser._id ? { ...user, ...editedUserData } : user,
//       );
//       setUsers(updatedUsers);

//       // Close modal
//       setShowUserEditModal(false);
//       showAlert("User updated successfully!");
//     } catch (error) {
//       console.error("Error updating user:", error);
//       showAlert("Failed to update user");
//     }
//   };

//   // filepath: c:\Users\thuve\Desktop\dev - polymart\PolyMart-EcoPlastMangementSys\frontend-admindb\src\App.js
// const handleAddUser = async () => {
//   try {
//       const response = await fetch(`${API_BASE_URL}/users`, {
//           method: "POST",
//           headers: {
//               "Content-Type": "application/json",
//           },
//           body: JSON.stringify(newUserData),
//       });

//       if (!response.ok) {
//           // Check if the response is JSON
//           const contentType = response.headers.get("content-type");
//           if (contentType && contentType.includes("application/json")) {
//               const errorData = await response.json();
//               throw new Error(errorData.message || "Failed to add user");
//           } else {
//               throw new Error("Unexpected response from server");
//           }
//       }

//       const newUser = await response.json();

//       if (!newUser || !newUser.data) {
//           throw new Error("Invalid response from server");
//       }

//       // Add to users array
//       setUsers([...users, newUser.data]);

//       // Close modal and reset form
//       setShowAddUserModal(false);
//       setNewUserData({
//           username: "",
//           email: "",
//           password: "",
//           isAccountVerified: false,
//       });

//       showAlert("User added successfully!");
//   } catch (error) {
//       console.error("Error adding user:", error);
//       showAlert(error.message || "Failed to add user");
//   }
// };
//   const handleEditOrder = (order) => {
//     setSelectedOrder(order);
//     setEditedOrderData({
//       user: order?.user || {},
//       date: order?.createdAt || "",
//       total: order?.total || "",
//       status: order?.status || "Unavailable",
//     });
//   };

//   const handleSaveOrderEdit = async () => {
//     if (!selectedOrder) return;

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/orders/${selectedOrder._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             status: editedOrderData.status,
//           }),
//         },
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update order");
//       }

//       const updatedOrder = await response.json();

//       // Update order in the state
//       const updatedOrders = orders.map((order) =>
//         order._id === selectedOrder._id
//           ? { ...order, status: updatedOrder.status }
//           : order,
//       );
//       setOrders(updatedOrders);

//       // Close the order view
//       setSelectedOrder(null);
//       showAlert("Order updated successfully!");
//     } catch (error) {
//       console.error("Error updating order:", error);
//       showAlert("Failed to update order");
//     }
//   };

//   const handleRequestAction = async (requestId, action) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: action }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to ${action.toLowerCase()} request`);
//       }

//       const updatedRequests = requests.map((request) => {
//         if (request._id === requestId) {
//           return { ...request, status: action };
//         }
//         return request;
//       });
//       setRequests(updatedRequests);
//       showAlert(`Request ${action.toLowerCase()} successfully!`);
//       setSelectedRequest(null);
//     } catch (error) {
//       console.error(`Error ${action.toLowerCase()}ing request:`, error);
//       showAlert(`Failed to ${action.toLowerCase()} request`);
//     }
//   };

//   const handleDeleteOrder = async (order) => {
//     if (!order) {
//       return;
//     }
//     try {
//       const response = await fetch(`${API_BASE_URL}/orders/${order._id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (response.ok) {
//         const updatedOrders = orders.filter(
//           (existingOrder) => existingOrder._id !== order._id,
//         );
//         setOrders(updatedOrders); // Update the orders state with the new list
//         showAlert("Order deleted successfully!"); // Show success message
//       } else {
//         throw new Error("Failed to delete order");
//       }
//     } catch (error) {
//       console.error("Error Deleting order:", error);
//       showAlert("Failed to delete order");
//     }
//   };
//   const handleDeleteRequest = async (request) => {
//     if (!request) {
//       return;
//     }
//     try {
//       const response = await fetch(`${API_BASE_URL}/requests/${request._id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (response.ok) {
//         const updatedReq = requests.filter(
//           (existingRequests) => existingRequests._id !== request._id,
//         );
//         setRequests(updatedReq); // Update the orders state with the new list
//         showAlert("Request deleted successfully!"); // Show success message
//         setSelectedRequest(null);
//       } else {
//         throw new Error("Failed to delete request");
//       }
//     } catch (error) {
//       console.error("Error Deleting request:", error);
//       showAlert("Failed to delete request");
//     }
//   };

//   const showAlert = (message) => {
//     const successAlert = document.getElementById("success-alert");
//     if (successAlert) {
//       successAlert.textContent = message;
//       successAlert.classList.remove("d-none");
//       setTimeout(() => {
//         successAlert.classList.add("d-none");
//       }, 3000);
//     }
//   };
//   const renderMessageDetail = () => (
//     <div className="mb-4">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <button
//           className="btn btn-outline-secondary"
//           onClick={() => setSelectedMessage(null)}
//         >
//           <ChevronLeft className="me-2" />
//           Back to chats
//         </button>
//       </div>

//       <div className="card">
//         <div className="card-header">
//           <h3 className="card-title">Chat: {selectedMessage.productName}</h3>
//           <p className="card-text">
//             Conversation: {selectedMessage.conversationId} | Last Message: {selectedMessage.date}
//           </p>
//         </div>
//         <div className="card-body">
//           <div className="border rounded p-3 bg-light">
//             {selectedMessage.messages.map((msg) => (
//               <div
//                 key={msg.id}
//                 className={`mb-2 ${
//                   msg.sender === selectedMessage.sellerName ? "text-end" : "text-start"
//                 }`}
//               >
//                 <p className="mb-1">
//                   <strong>{msg.sender}:</strong> {msg.text}
//                 </p>
//                 <small className="text-muted">{msg.date}</small>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="card-footer d-flex justify-content-end">
//           <button
//             className={`btn ${
//               isReplying ? "btn-secondary" : "btn-outline-secondary"
//             } me-2`}
//             onClick={() => setIsReplying(!isReplying)}
//           >
//             {isReplying ? "Cancel Reply" : "Reply"}
//           </button>
//         </div>
//       </div>

//       {isReplying && (
//         <div className="card mt-3">
//           <div className="card-header">
//             <h3 className="card-title">Reply to {selectedMessage.user}</h3>
//             <p className="card-text">Product: {selectedMessage.productName} | As: {selectedMessage.sellerName}</p>
//           </div>
//           <div className="card-body">
//             <div className="mb-3">
//               <label className="form-label">Your Reply</label>
//               <textarea
//                 className="form-control min-h-200"
//                 value={replyContent}
//                 onChange={(e) => setReplyContent(e.target.value)}
//                 placeholder="Type your reply here..."
//               ></textarea>
//             </div>
//           </div>
//           <div className="card-footer d-flex justify-content-end">
//             <button
//               className="btn btn-primary"
//               onClick={handleReply}
//               disabled={!replyContent.trim()}
//             >
//               <Send className="me-2" />
//               Send Reply
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
//   const renderOrderDetail = () => {
//     if (!selectedOrder) return null;

//     return (
//       <div className="mb-4">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <button
//             className="btn btn-outline-secondary"
//             onClick={() => setSelectedOrder(null)}
//           >
//             <ChevronLeft className="me-2" />
//             Back to orders
//           </button>
//         </div>

//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title">Order Details</h3>
//             <p className="card-text">Order ID: {selectedOrder._id}</p>
//           </div>
//           <div className="card-body">
//             <div className="mb-3">
//               <label className="form-label">Customer</label>
//               <input
//                 type="text"
//                 disabled={true}
//                 className="form-control"
//                 value={editedOrderData?.buyer || selectedOrder?.buyer|| ""}
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Date</label>
//               <input
//                 type="text"
//                 disabled={true}
//                 className="form-control"
//                 value={new Date(editedOrderData?.date).toLocaleDateString(
//                   "en-GB",
//                   {
//                     day: "numeric",
//                     month: "short",
//                     year: "numeric",
//                   },
//                 )}
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Total amount:</label>
//               <input
//                 type="text"
//                 disabled={true}
//                 className="form-control"
//                 value={`LKR ${editedOrderData.total}.00`}
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Status</label>
//               <select
//                 className="form-select"
//                 value={editedOrderData.status}
//                 onChange={(e) =>
//                   setEditedOrderData({
//                     ...editedOrderData,
//                     status: e.target.value,
//                   })
//                 }
//               >
//                 <option value="Delivered">Delivered</option>
//                 <option value="Processing">Processing</option>
//                 <option value="Shipped">Shipped</option>
//                 <option value="Cancelled">Cancelled</option>
//               </select>
//             </div>
//           </div>
//           <div className="card-footer d-flex justify-content-end">
//             <button
//               className="btn btn-secondary me-2"
//               onClick={() => setSelectedOrder(null)}
//             >
//               Cancel
//             </button>
//             <button className="btn btn-primary" onClick={handleSaveOrderEdit}>
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderRequestDetail = () => {
//     if (!selectedRequest) return null;

//     return (
//       <div className="mb-4">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <button
//             className="btn btn-outline-secondary"
//             onClick={() => setSelectedRequest(null)}
//           >
//             <ChevronLeft className="me-2" />
//             Back to requests
//           </button>
//         </div>

//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title">Plastic Collection Request</h3>
//             <p className="card-text">Request ID: {selectedRequest?._id}</p>
//           </div>
//           <div className="card-body">
//             <div className="mb-3">
//               <label className="form-label">User</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={selectedRequest?.name}
//                 readOnly
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Pickup date</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={new Date(selectedRequest?.pickupDate).toLocaleDateString(
//                   "en-GB",
//                   {
//                     day: "numeric",
//                     month: "short",
//                     year: "numeric",
//                   },
//                 )}
//                 readOnly
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Address</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={selectedRequest?.address}
//                 readOnly
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Feedback</label>
//               <textarea
//                 className="form-control"
//                 value={selectedRequest?.feedback}
//                 readOnly
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Plastics Collected</label>
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Type</th>
//                     <th>Quantity (kgs)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>{selectedRequest?.bottleType}</td>
//                     <td>{selectedRequest?.weight}</td>
//                   </tr>
//                   {/*<tr className="fw-bold">*/}
//                   {/*  <td>Total</td>*/}
//                   {/*  <td>*/}
//                   {/*    {selectedRequest.plastics*/}
//                   {/*      ? selectedRequest.plastics.reduce(*/}
//                   {/*          (total, plastic) => total + (plastic.kgs || 0),*/}
//                   {/*          0,*/}
//                   {/*        )*/}
//                   {/*      : 0}{" "}*/}
//                   {/*    kgs*/}
//                   {/*  </td>*/}
//                   {/*</tr>*/}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Status</label>
//               <div className="d-flex align-items-center">
//                 <span
//                   className={`badge ${
//                     selectedRequest?.status === "Completed"
//                       ? "bg-success"
//                       : selectedRequest?.status === "Pending"
//                         ? "bg-danger"
//                         : "bg-warning"
//                   } me-3`}
//                 >
//                   {selectedRequest?.status}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div className="card-footer d-flex justify-content-end">
//             {selectedRequest?.status === "Pending" ||
//             selectedRequest?.status === "Picked Up" ? (
//               <>
//                 <button
//                   className="btn btn-success me-2"
//                   onClick={() =>
//                     handleRequestAction(selectedRequest._id, "Completed")
//                   }
//                 >
//                   <Check className="me-1" />
//                   Complete
//                 </button>
//                 <button
//                   className="btn btn-danger"
//                   onClick={() => handleDeleteRequest(selectedRequest)}
//                 >
//                   <Trash size={18} className="mb-1" />
//                   Delete
//                 </button>
//               </>
//             ) : (
//               <button
//                 className="btn btn-danger"
//                 onClick={() => handleDeleteRequest(selectedRequest)}
//               >
//                 <Trash size={18} className="mb-1" />
//                 Delete
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "dashboard":
//         const monthlySales = [];

//         const salesData = orders.reduce((acc, order) => {
//           const date = new Date(order.createdAt);
//           const month = date.toLocaleString("default", { month: "short" });
//           const year = date.getFullYear();
//           const monthYear = `${month} ${year}`;

//           if (!acc[monthYear]) {
//             acc[monthYear] = 0;
//           }

//           acc[monthYear] += order.total;
//           return acc;
//         }, {});

//         for (const key in salesData) {
//           monthlySales.push({ month: key, total: salesData[key] });
//         }

//         const totalRevenue = orders.reduce((total, order) => {
//           return total + (order.total || 0); // protect if some order.amount is undefined
//         }, 0);

//         // Prepare pie data
//         const statusCounts = orders.reduce((acc, order) => {
//           const status = order.status || "Unknown";
//           acc[status] = (acc[status] || 0) + 1;
//           return acc;
//         }, {});

//         const getStatusColor = (status) => {
//           switch (status) {
//             case "Delivered":
//               return "#28a745"; // green (bootstrap success)
//             case "Shipped":
//               return "#17a2b8"; // info blue
//             case "Cancelled":
//               return "#dc3545"; // danger red
//             case "Processing":
//               return "#ffc107"; // warning yellow
//             default:
//               return "#dc3545"; // default red for unknown statuses
//           }
//         };

//         const pieData = Object.entries(statusCounts).map(
//           ([status, count, colour]) => ({
//             status,
//             count,
//             colour: getStatusColor(status),
//           }),
//         );

//         return (
//           <div className="mb-4">
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px',height: '10vh', flexDirection: 'column' }}>
//             <h1 style={textStyle}>HELLO ADMIN!</h1>
//           </div>
//             <div className="row mb-4">
//               <div className="col-md-3">
//                 <div className="card">
//                   <div className="card-header">
//                     <p className="card-text">Total Products</p>
//                     <h3 className="card-title fs-1">{stats.totalProducts}</h3>
//                   </div>
//                   <div className="card-body">
//                     <div className="text-muted">+12% from last month</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-3">
//                 <div className="card">
//                   <div className="card-header">
//                     <p className="card-text">Active Customers</p>
//                     <h3 className="card-title fs-1">
//                       {users?.filter((u) => u.role === "user").length}
//                     </h3>
//                   </div>
//                   <div className="card-body">
//                     <div className="text-muted">+5% from last month</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-3">
//                 <div className="card">
//                   <div className="card-header">
//                     <p className="card-text">Total Orders</p>
//                     <h3 className="card-title fs-1">{orders?.length}</h3>
//                   </div>
//                   <div className="card-body">
//                     <div className="text-muted">+18% from last month</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-3">
//                 <div className="card">
//                   <div className="card-header">
//                     <p className="card-text">Total Sales</p>
//                     <h3 className="card-title fs-1">
//                       LKR {totalRevenue.toLocaleString()}
//                     </h3>
//                   </div>
//                   <div className="card-body">
//                     <div className="text-muted">+22% from last month</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="row mb-4">
//               <div className="col-md-6">
//                 <div className="card">
//                   <div className="card-header">
//                     <h3 className="card-title">Sales Overview</h3>
//                   </div>
//                   <div className="card-body" style={{ height: "300px" }}>
//                     {isLoading.stats ? (
//                       <div className="d-flex justify-content-center align-items-center h-100">
//                         <div className="spinner-border" role="status">
//                           <span className="visually-hidden">Loading...</span>
//                         </div>
//                       </div>
//                     ) : (
//                       <ResponsiveContainer width="100%" height="100%">
//                         <LineChart data={monthlySales}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="month" />
//                           <YAxis />
//                           <Tooltip />
//                           <Legend />
//                           <Line
//                             type="monotone"
//                             dataKey="total"
//                             stroke="#8884d8"
//                             activeDot={{ r: 8 }}
//                           />
//                         </LineChart>
//                       </ResponsiveContainer>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-6">
//                 <div className="card">
//                   <div className="card-header">
//                     <h3 className="card-title">Order Status Track</h3>
//                   </div>
//                   <div className="card-body" style={{ height: "300px" }}>
//                     {isLoading.stats ? (
//                       <div className="d-flex justify-content-center align-items-center h-100">
//                         <div className="spinner-border" role="status">
//                           <span className="visually-hidden">Loading...</span>
//                         </div>
//                       </div>
//                     ) : (
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <Pie
//                             data={pieData}
//                             cx="50%"
//                             cy="50%"
//                             labelLine={false}
//                             outerRadius={80}
//                             fill="#8884d8"
//                             dataKey="count"
//                             label={({ status, percent }) =>
//                               `${status}: ${(percent * 100).toFixed(0)}%`
//                             }
//                           >
//                             {pieData.map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={entry.colour} />
//                             ))}
//                           </Pie>
//                           <Tooltip
//                             formatter={(value, name, props) => [
//                               `${value}`,
//                               `${props.payload.status}`,
//                             ]}
//                           />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="card">
//               <div className="card-header">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h3 className="card-title">Recent Orders</h3>
//                   <button
//                     className="btn btn-link"
//                     onClick={() => setActiveTab("orders")}
//                   >
//                     View all <ArrowRight className="ms-2" />
//                   </button>
//                 </div>
//               </div>
//               <div className="card-body">
//                 {isLoading.orders ? (
//                   <div className="d-flex justify-content-center align-items-center py-5">
//                     <div className="spinner-border" role="status">
//                       <span className="visually-hidden">Loading...</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         <th>Order ID</th>
//                         <th>Customer</th>
//                         <th>Date</th>
//                         <th>Amount</th>
//                         <th>Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {orders
//                         .sort(
//                           (a, b) =>
//                             new Date(b.createdAt) - new Date(a.createdAt),
//                         )
//                         .slice(0, 4)
//                         .map((order) => (
//                           <tr key={order?._id}>
//                             <td>{order?._id}</td>
//                             <td>{order?.buyer}</td>
//                             <td>
//                               {new Date(order?.createdAt).toLocaleDateString(
//                                 "en-GB",
//                                 {
//                                   day: "numeric",
//                                   month: "short",
//                                   year: "numeric",
//                                 },
//                               )}
//                             </td>
//                             <td>LKR {order?.total?.toLocaleString()}.00</td>
//                             <td>
//                               <span
//                                 className={`badge ${
//                                   order.status === "Delivered"
//                                     ? "bg-success"
//                                     : order.status === "Shipped"
//                                       ? "bg-info"
//                                       : order.status === "Cancelled"
//                                         ? "bg-danger"
//                                         : order.status === "Processing"
//                                           ? "bg-warning"
//                                           : "bg-danger"
//                                 }`}
//                               >
//                                 {order.status}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 )}
//               </div>
//             </div>

//             <div className="card mt-4">
//               <div className="card-header">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h3 className="card-title">Recent Users</h3>
//                   <button
//                     className="btn btn-link"
//                     onClick={() => setActiveTab("users")}
//                   >
//                     View all <ArrowRight className="ms-2" />
//                   </button>
//                 </div>
//               </div>
//               <div className="card-body">
//                 {isLoading.users ? (
//                   <div className="d-flex justify-content-center align-items-center py-5">
//                     <div className="spinner-border" role="status">
//                       <span className="visually-hidden">Loading...</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         <th>User ID</th>
//                         <th>Name</th>
//                         <th>Email</th>
//                         <th>Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {users.slice(0, 4).map((user) => (
//                         <tr key={user._id}>
//                           <td>{user._id}</td>
//                           <td>{user.username}</td>
//                           <td>{user.email}</td>
//                           <td>
//                             <span
//                               className={`badge ${user.isAccountVerified ? "bg-success" : "bg-danger"}`}
//                             >
//                               {user.isAccountVerified
//                                 ? "verified"
//                                 : "Unverified"}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 )}
//               </div>
//             </div>

//             <div style={containerStyle}>
//       <button
//         style={buttonStyle}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         onClick={() => (window.location.href = "http://localhost:3001/")}
//       >
//         Sign Out
//       </button>
//     </div>


//           </div>
//         );

//       case "users":
//         return (
//           <div className="mb-4">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h2 className="h4">User Management</h2>
//               <div className="d-flex">
//                 <input
//                   type="text"
//                   className="form-control me-2"
//                   placeholder="Search users..."
//                   value={userSearchQuery}
//                   onChange={(e) => setUserSearchQuery(e.target.value)}
//                 />
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => setShowAddUserModal(true)}
//                 >
//                   <Plus size={16} className="me-1" />
//                   Add User
//                 </button>
//               </div>
//             </div>
//             <div className="card">
//               <div className="card-body">
//                 {isLoading.users ? (
//                   <div className="d-flex justify-content-center align-items-center py-5">
//                     <div className="spinner-border" role="status">
//                       <span className="visually-hidden">Loading...</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <table className="table">
//                       <thead>
//                         <tr>
//                           <th>User ID</th>
//                           <th>Name</th>
//                           <th>Email</th>
//                           <th>Status</th>
//                           <th>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredUsers.map((user) => (
//                           <tr key={user._id}>
//                             <td>{user._id}</td>
//                             <td>{user.username}</td>
//                             <td>{user.email}</td>
//                             <td>
//                               <span
//                                 className={`badge ${user.isAccountVerified ? "bg-success" : "bg-danger"}`}
//                               >
//                                 {user.isAccountVerified
//                                   ? "verified"
//                                   : "Unverified"}
//                               </span>
//                             </td>
//                             <td>
//                               <div className="d-flex">
//                                 <button
//                                   className="btn btn-outline-primary btn-sm me-2"
//                                   onClick={() => handleEditUser(user)}
//                                 >
//                                   <Edit size={16} className="me-1" />
//                                   Edit
//                                 </button>
//                                 <button
//                                   className="btn btn-outline-danger btn-sm"
//                                   onClick={async () => {
//                                     try {
//                                       const response = await fetch(
//                                         `${API_BASE_URL}/users/${user._id}`,
//                                         {
//                                           method: "DELETE",
//                                         },
//                                       );

//                                       if (!response.ok) {
//                                         throw new Error(
//                                           "Failed to delete user",
//                                         );
//                                       }

//                                       setUsers(
//                                         users.filter((u) => u._id !== user._id),
//                                       );
//                                       setOrders(
//                                         orders.filter(
//                                           (order) =>
//                                             order.user._id !== user._id,
//                                         ),
//                                       );
//                                       showAlert("User deleted successfully!");
//                                     } catch (error) {
//                                       console.error(
//                                         "Error deleting user:",
//                                         error,
//                                       );
//                                       showAlert("User deleted successfully!");
//                                     }
//                                   }}
//                                 >
//                                   <Trash size={16} className="" />
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                     <div className="card-footer d-flex justify-content-between">
//                       <div className="text-muted">
//                         Showing 1 to {filteredUsers.length} of {users.length}{" "}
//                         entries
//                       </div>
//                       <div className="d-flex">
//                         <button className="btn btn-outline-secondary btn-sm me-2">
//                           <ChevronLeft size={16} />
//                         </button>
//                         <button className="btn btn-outline-secondary btn-sm">
//                           <ChevronRight size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case "orders":
//         return selectedOrder ? (
//           renderOrderDetail()
//         ) : (
//           <div className="mb-4">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h2 className="h4">Order Management</h2>
//               <div className="d-flex">
//                 <input
//                   type="text"
//                   className="form-control me-2"
//                   placeholder="Search orders..."
//                 />
//               </div>
//               <Button
//             </div>
//             <div className="card">
//               <div className="card-body">
//                 {isLoading.orders ? (
//                   <div className="d-flex justify-content-center align-items-center py-5">
//                     <div className="spinner-border" role="status">
//                       <span className="visually-hidden">Loading...</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <table className="table">
//                       <thead>
//                         <tr>
//                           <th>Order ID</th>
//                           <th>Customer</th>
//                           <th>Date</th>
//                           <th>Amount</th>
//                           <th>Status</th>
//                           <th>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {orders.map((order) => (
//                           <tr key={order?._id}>
//                             <td>{order?._id}</td>
//                             <td>{order?.buyer}</td>
//                             <td>
//                               {new Date(order?.createdAt).toLocaleDateString(
//                                 "en-GB",
//                                 {
//                                   day: "numeric",
//                                   month: "short",
//                                   year: "numeric",
//                                 },
//                               )}
//                             </td>
//                             <td>LKR {order?.total?.toLocaleString()}.00</td>
//                             <td>
//                               <span
//                                 className={`badge ${
//                                   order.status === "Delivered"
//                                     ? "bg-success"
//                                     : order.status === "Shipped"
//                                       ? "bg-info"
//                                       : order.status === "Cancelled"
//                                         ? "bg-danger"
//                                         : order.status === "Processing"
//                                           ? "bg-warning"
//                                           : "bg-danger"
//                                 }`}
//                               >
//                                 {order.status}
//                               </span>
//                             </td>
//                             <td>
//                               <div className="d-flex">
//                                 <button
//                                   className="btn btn-outline-primary btn-sm me-2"
//                                   onClick={() => handleEditOrder(order)}
//                                 >
//                                   Edit Status
//                                 </button>
//                                 <button
//                                   className="btn btn-outline-danger btn-sm"
//                                   onClick={() => handleDeleteOrder(order)}
//                                 >
//                                   <Trash size={16} className="" />
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                     <div className="card-footer d-flex justify-content-between">
//                       <div className="text-muted">
//                         Showing 1 to {orders.length} of {orders.length} entries
//                       </div>
//                       <div className="d-flex">
//                         <button className="btn btn-outline-secondary btn-sm me-2">
//                           <ChevronLeft size={16} />
//                         </button>
//                         <button className="btn btn-outline-secondary btn-sm">
//                           <ChevronRight size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case "requests":
//         return selectedRequest ? (
//           renderRequestDetail()
//         ) : (
//           <div className="mb-4">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h2 className="h4">Plastic Collection Requests</h2>
//               <div className="d-flex">
//                 <input
//                   type="text"
//                   className="form-control me-2"
//                   placeholder="Search requests..."
//                   value={requestSearchQuery}
//                   onChange={(e) => setRequestSearchQuery(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="card">
//               <div className="card-body">
//                 {isLoading.requests ? (
//                   <div className="d-flex justify-content-center align-items-center py-5">
//                     <div className="spinner-border" role="status">
//                       <span className="visually-hidden">Loading...</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <table className="table">
//                       <thead>
//                         <tr>
//                           <th>Request ID</th>
//                           <th>User</th>
//                           <th>Date</th>
//                           <th>Total Plastics (kgs)</th>
//                           <th>Status</th>
//                           <th>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredRequests.map((request) => (
//                           <tr key={request._id}>
//                             <td>{request._id}</td>
//                             <td>{request.name}</td>
//                             <td>
//                               {new Date(request?.pickupDate).toLocaleDateString(
//                                 "en-GB",
//                                 {
//                                   day: "numeric",
//                                   month: "short",
//                                   year: "numeric",
//                                 },
//                               )}
//                             </td>
//                             <td>
//                               {request.weight}
//                               kgs
//                             </td>
//                             <td>
//                               <span
//                                 className={`badge ${
//                                   request.status === "Completed"
//                                     ? "bg-success"
//                                     : request.status === "Pending"
//                                       ? "bg-danger"
//                                       : "bg-warning"
//                                 }`}
//                               >
//                                 {request.status}
//                               </span>
//                             </td>
//                             <td>
//                               <button
//                                 className="btn btn-outline-primary btn-sm"
//                                 onClick={() => setSelectedRequest(request)}
//                               >
//                                 View Details
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                     <div className="card-footer d-flex justify-content-between">
//                       <div className="text-muted">
//                         Showing 1 to {filteredRequests.length} of{" "}
//                         {requests.length} entries
//                       </div>
//                       <div className="d-flex">
//                         <button className="btn btn-outline-secondary btn-sm me-2">
//                           <ChevronLeft size={16} />
//                         </button>
//                         <button className="btn btn-outline-secondary btn-sm">
//                           <ChevronRight size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         );
      

//       case "messages":
//           return selectedMessage ? (
//             renderMessageDetail()
//           ) : (
//             <div className="mb-4">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h2 className="h4">Messages</h2>
//                 <div className="d-flex">
//                   <input
//                     type="text"
//                     className="form-control me-2"
//                     placeholder="Search messages..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//               </div>
//               <div className="card">
//                 <div className="card-body">
//                 <table className="table">
//                   <thead>
//                     <tr>
//                       <th>Conversation</th>
//                       <th>Product</th>
//                       <th>Last Message</th>
//                       <th>Status</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                       {filteredMessages.map((message) => (
//                         <tr key={message.conversationId} className={!message.read ? "fw-bold" : ""}>
//                           <td>{message.conversationId}</td>
//                           <td>{message.productName}</td>
//                           <td>{message.date}</td>
//                           <td>
//                             {message.read ? (
//                               <span className="text-muted">Read</span>
//                             ) : (
//                               <span className="text-primary">Unread</span>
//                             )}
//                           </td>
//                           <td>
//                             <button
//                               className="btn btn-outline-primary btn-sm"
//                               onClick={() => setSelectedMessage(message)}
//                             >
//                               View
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <div className="card-footer d-flex justify-content-between">
//                   <div className="text-muted">
//                     Showing 1 to {filteredMessages.length} of {messages.length} entries
//                   </div>
//                   <div className="d-flex">
//                     <button className="btn btn-outline-secondary btn-sm me-2">
//                       <ChevronLeft size={16} />
//                     </button>
//                     <button className="btn btn-outline-secondary btn-sm">
//                       <ChevronRight size={16} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )
//     }
//   };

//   return (
//     <div className="d-flex min-vh-100">
//       {/* Sidebar */}
//       <div className="bg-light border-end" style={{ width: "250px" }}>
//         <div className="p-3">
//           <h1 className="h5">Polymart Admin</h1>
//         </div>
//         <nav className="nav flex-column p-2">
//           <button
//             className={`btn d-flex align-items-center mb-1 ${
//               activeTab === "dashboard"
//                 ? "btn-secondary"
//                 : "btn-link text-decoration-none text-dark"
//             }`}
//             onClick={() => setActiveTab("dashboard")}
//           >
//             <Home className="me-2" />
//             Dashboard
//           </button>
//           <button
//             className={`btn d-flex align-items-center mb-1 ${
//               activeTab === "users"
//                 ? "btn-secondary"
//                 : "btn-link text-decoration-none text-dark"
//             }`}
//             onClick={() => setActiveTab("users")}
//           >
//             <Users className="me-2" />
//             Users
//           </button>
//           <button
//             className={`btn d-flex align-items-center mb-1 ${
//               activeTab === "orders"
//                 ? "btn-secondary"
//                 : "btn-link text-decoration-none text-dark"
//             }`}
//             onClick={() => setActiveTab("orders")}
//           >
//             <ShoppingCart className="me-2" />
//             Orders
//           </button>
//           <button
//             className={`btn d-flex align-items-center mb-1 ${
//               activeTab === "requests"
//                 ? "btn-secondary"
//                 : "btn-link text-decoration-none text-dark"
//             }`}
//             onClick={() => setActiveTab("requests")}
//           >
//             <Recycle className="me-2" />
//             Plastic Requests
//           </button>
//           <button
//             className={`btn d-flex align-items-center mb-1 ${
//               activeTab === "messages"
//                 ? "btn-secondary"
//                 : "btn-link text-decoration-none text-dark"
//             }`}
//             onClick={() => setActiveTab("messages")}
//           >
//             <Mail className="me-2" />
//             Messages
//           </button>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-grow-1 p-4">
//         {/* Success Alert */}
//         <div
//           className="alert alert-success alert-dismissible fade show d-none"
//           role="alert"
//           id="success-alert"
//         >
//           Operation completed successfully!
//           <button
//             type="button"
//             className="btn-close"
//             data-bs-dismiss="alert"
//             aria-label="Close"
//           ></button>
//         </div>

//         {renderTabContent()}
//       </div>

//       {/* User Edit Modal */}
//       {showUserEditModal && editingUser && (
//         <div
//           className="modal show d-block"
//           tabIndex="-1"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Edit User</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowUserEditModal(false)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <div className="mb-3">
//                   <label className="form-label">User ID</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={editingUser._id}
//                     disabled
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={editedUserData.username}
//                     onChange={(e) =>
//                       setEditedUserData({
//                         ...editedUserData,
//                         name: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Email</label>
//                   <input
//                     type="email"
//                     disabled
//                     className="form-control"
//                     value={editedUserData.email}
//                   />
//                 </div>
//                 <div className="mb-3 d-flex align-items-center gap-2">
//                   <label className="form-label mt-1">Verified</label>
//                   <Switch
//                     id="accountVerified"
//                     onChange={(checked) =>
//                       setEditedUserData({
//                         ...editedUserData,
//                         isAccountVerified: checked, // Set true if checked, false if unchecked
//                       })
//                     }
//                     checked={editedUserData?.isAccountVerified}
//                     uncheckedIcon={false} // Optionally, you can hide text/icons for better visuals
//                     checkedIcon={false}
//                     offColor="#888" // Color for unchecked state
//                     onColor="#007bff" // Color for checked state (green for verified)
//                   />
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => setShowUserEditModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={handleSaveUserEdit}
//                 >
//                   Save changes
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add User Modal */}
//       {showAddUserModal && (
//         <div
//           className="modal show d-block"
//           tabIndex="-1"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Add New User</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowAddUserModal(false)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <div className="mb-3">
//                   <label className="form-label">Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={newUserData.username}
//                     onChange={(e) =>
//                       setNewUserData({ ...newUserData, username: e.target.value })
//                     }
//                     placeholder="Enter user name"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Email</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     value={newUserData.email}
//                     onChange={(e) =>
//                       setNewUserData({ ...newUserData, email: e.target.value })
//                     }
//                     placeholder="Enter user email"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     value={newUserData.password}
//                     onChange={(e) =>
//                       setNewUserData({
//                         ...newUserData,
//                         password: e.target.value,
//                       })
//                     }
//                     placeholder="Enter user password"
//                   />
//                 </div>
//                 <label className="form-label mt-1">User Verification</label>
//                 <div className="mb-2 d-flex align-items-center gap-2">
//                   <Switch
//                     id="accountVerified"
//                     onChange={(checked) =>
//                       setNewUserData({
//                         ...newUserData,
//                         isAccountVerified: checked, // Set true if checked, false if unchecked
//                       })
//                     }
//                     checked={newUserData?.isAccountVerified}
//                     uncheckedIcon={false} // Optionally, you can hide text/icons for better visuals
//                     checkedIcon={false}
//                     offColor="#888" // Color for unchecked state
//                     onColor="#007bff" // Color for checked state (green for verified)
//                   />
//                   <label className="mt-0">
//                     {newUserData.isAccountVerified ? "Verified" : "Unverified"}
//                   </label>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => setShowAddUserModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={handleAddUser}
//                   disabled={!newUserData.username || !newUserData.email}
//                 >
//                   Add User
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function App() {
//   return (
//     <div className="App">
//       <PolymartAdminDashboard />
//     </div>
//   );
// }

// export default App;

// // "use client"
// //
// // import { useState } from "react"
// // import {
// //   Home,
// //   Users,
// //   ShoppingCart,
// //   Mail,
// //   ArrowRight,
// //   ChevronRight,
// //   ChevronLeft,
// //   Paperclip,
// //   Send,
// //   Edit,
// //   Trash,
// //   Plus,
// //   Check,
// //   X,
// //   Recycle,
// // } from "lucide-react"
// // import {
// //   LineChart,
// //   PieChart,
// //   Pie,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// //   Cell,
// // } from "recharts"
// // import "bootstrap/dist/css/bootstrap.min.css"
// // import "./Dashboard.css"
// //
// // // Sample data for charts
// // const salesData = [
// //   { name: "Jan", sales: 4000, revenue: 3000 },
// //   { name: "Feb", sales: 3000, revenue: 2000 },
// //   { name: "Mar", sales: 5000, revenue: 4000 },
// //   { name: "Apr", sales: 2780, revenue: 3908 },
// //   { name: "May", sales: 1890, revenue: 4800 },
// //   { name: "Jun", sales: 2390, revenue: 3800 },
// //   { name: "Jul", sales: 3490, revenue: 4300 },
// // ]
// //
// // const vendorData = [
// //   { name: "Vendor A", value: 400 },
// //   { name: "Vendor B", value: 300 },
// //   { name: "Vendor C", value: 200 },
// //   { name: "Vendor D", value: 100 },
// // ]
// //
// // const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]
// //
// // // Sample data for tables
// // const recentOrders = [
// //   { id: "#ORD-001", customer: "John Doe", date: "2023-06-01", amount: "$120.00", status: "Completed" },
// //   { id: "#ORD-002", customer: "Jane Smith", date: "2023-06-02", amount: "$85.50", status: "Processing" },
// //   { id: "#ORD-003", customer: "Robert Johnson", date: "2023-06-03", amount: "$220.00", status: "Shipped" },
// //   { id: "#ORD-004", customer: "Emily Davis", date: "2023-06-04", amount: "$65.25", status: "Completed" },
// // ]
// //
// // const initialUsers = [
// //   { id: "USR-001", name: "John Doe", email: "john@example.com", status: "Active" },
// //   { id: "USR-002", name: "Jane Smith", email: "jane@example.com", status: "Active" },
// //   { id: "USR-003", name: "Robert Johnson", email: "robert@example.com", status: "Suspended" },
// //   { id: "USR-004", name: "Emily Davis", email: "emily@example.com", status: "Active" },
// // ]
// //
// // const messages = [
// //   {
// //     id: "MSG-001",
// //     from: "John Doe",
// //     subject: "Order Inquiry",
// //     date: "2023-06-01",
// //     read: false,
// //     content:
// //         "Hello, I have a question about my recent order #12345. Can you please provide an update on the shipping status?",
// //   },
// //   {
// //     id: "MSG-002",
// //     from: "Jane Smith",
// //     subject: "Product Feedback",
// //     date: "2023-06-02",
// //     read: true,
// //     content: "I recently purchased the XYZ product and wanted to share some feedback about my experience with it.",
// //   },
// //   {
// //     id: "MSG-003",
// //     from: "Robert Johnson",
// //     subject: "Account Issue",
// //     date: "2023-06-03",
// //     read: false,
// //     content: "I'm having trouble accessing my account. Every time I try to login, I get an error message.",
// //   },
// //   {
// //     id: "MSG-004",
// //     from: "Emily Davis",
// //     subject: "Partnership Proposal",
// //     date: "2023-06-04",
// //     read: true,
// //     content: "I represent ABC Company and we're interested in exploring partnership opportunities with Polymart.",
// //   },
// // ]
// //
// // // Plastic collection request data
// // const initialRequests = [
// //   {
// //     id: "REQ-001",
// //     userId: "USR-001",
// //     userName: "John Doe",
// //     date: "2023-06-10",
// //     plastics: [
// //       { type: "PET", kgs: 5 },
// //       { type: "HDPE", kgs: 3 },
// //       { type: "PP", kgs: 2 }
// //     ],
// //     status: "Pending",
// //     location: "123 Main St, New York",
// //     notes: "Collected from home pickup"
// //   },
// //   {
// //     id: "REQ-002",
// //     userId: "USR-002",
// //     userName: "Jane Smith",
// //     date: "2023-06-11",
// //     plastics: [
// //       { type: "PET", kgs: 8 },
// //       { type: "LDPE", kgs: 4 }
// //     ],
// //     status: "Pending",
// //     location: "456 Oak Ave, Boston",
// //     notes: "Community collection center"
// //   },
// //   {
// //     id: "REQ-003",
// //     userId: "USR-003",
// //     userName: "Robert Johnson",
// //     date: "2023-06-12",
// //     plastics: [
// //       { type: "HDPE", kgs: 6 },
// //       { type: "PP", kgs: 3 },
// //       { type: "PS", kgs: 1 }
// //     ],
// //     status: "Approved",
// //     location: "789 Pine Rd, Chicago",
// //     notes: "Corporate office collection"
// //   },
// //   {
// //     id: "REQ-004",
// //     userId: "USR-004",
// //     userName: "Emily Davis",
// //     date: "2023-06-13",
// //     plastics: [
// //       { type: "PET", kgs: 10 }
// //     ],
// //     status: "Rejected",
// //     location: "321 Elm Blvd, Seattle",
// //     notes: "Contaminated materials found"
// //   }
// // ]
// //
// // function PolymartAdminDashboard() {
// //   const [activeTab, setActiveTab] = useState("dashboard")
// //   const [searchQuery, setSearchQuery] = useState("")
// //   const [selectedMessage, setSelectedMessage] = useState(null)
// //   const [replyContent, setReplyContent] = useState("")
// //   const [isReplying, setIsReplying] = useState(false)
// //   const [attachments, setAttachments] = useState([])
// //   const [isSending, setIsSending] = useState(false)
// //   const [showUserEditModal, setShowUserEditModal] = useState(false)
// //   const [showAddUserModal, setShowAddUserModal] = useState(false)
// //   const [editingUser, setEditingUser] = useState(null)
// //   const [orders, setOrders] = useState(recentOrders)
// //   const [users, setUsers] = useState(initialUsers)
// //   const [requests, setRequests] = useState(initialRequests)
// //   const [selectedOrder, setSelectedOrder] = useState(null)
// //   const [selectedRequest, setSelectedRequest] = useState(null)
// //   const [userSearchQuery, setUserSearchQuery] = useState("")
// //   const [requestSearchQuery, setRequestSearchQuery] = useState("")
// //
// //   // Form states
// //   const [editedUserData, setEditedUserData] = useState({
// //     name: "",
// //     email: "",
// //     status: "Active",
// //   })
// //   const [newUserData, setNewUserData] = useState({
// //     name: "",
// //     email: "",
// //     status: "Active",
// //   })
// //   const [editedOrderData, setEditedOrderData] = useState({
// //     customer: "",
// //     date: "",
// //     amount: "",
// //     status: "Processing",
// //   })
// //
// //   const filteredMessages = messages.filter(
// //       (message) =>
// //           message.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //           message.subject.toLowerCase().includes(searchQuery.toLowerCase()),
// //   )
// //
// //   const filteredUsers = users.filter(
// //       (user) =>
// //           user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
// //           user.email.toLowerCase().includes(userSearchQuery.toLowerCase()),
// //   )
// //
// //   const filteredRequests = requests.filter(
// //       (request) =>
// //           request.userName.toLowerCase().includes(requestSearchQuery.toLowerCase()) ||
// //           request.id.toLowerCase().includes(requestSearchQuery.toLowerCase()) ||
// //           request.status.toLowerCase().includes(requestSearchQuery.toLowerCase()),
// //   )
// //
// //   const handleReply = () => {
// //     setIsSending(true)
// //     // Simulate API call
// //     setTimeout(() => {
// //       console.log("Reply sent:", {
// //         to: selectedMessage.from,
// //         subject: `Re: ${selectedMessage.subject}`,
// //         content: replyContent,
// //         attachments: attachments.map((file) => file.name),
// //       })
// //
// //       // Reset states
// //       setReplyContent("")
// //       setAttachments([])
// //       setIsReplying(false)
// //       setIsSending(false)
// //
// //       // Show success message
// //       showAlert("Reply sent successfully!")
// //     }, 1500)
// //   }
// //
// //   const handleAttachmentChange = (e) => {
// //     const files = Array.from(e.target.files)
// //     setAttachments(files)
// //   }
// //
// //   const removeAttachment = (index) => {
// //     setAttachments(attachments.filter((_, i) => i !== index))
// //   }
// //
// //   const handleEditUser = (user) => {
// //     setEditingUser(user)
// //     setEditedUserData({
// //       name: user.name,
// //       email: user.email,
// //       status: user.status,
// //     })
// //     setShowUserEditModal(true)
// //   }
// //
// //   const handleSaveUserEdit = () => {
// //     // Update user in the state
// //     const updatedUsers = users.map(user =>
// //         user.id === editingUser.id ? { ...user, ...editedUserData } : user
// //     )
// //     setUsers(updatedUsers)
// //
// //     // Close modal
// //     setShowUserEditModal(false)
// //
// //     showAlert("User updated successfully!")
// //   }
// //
// //   const handleAddUser = () => {
// //     // Generate a new user ID
// //     const newUserId = `USR-${(users.length + 1).toString().padStart(3, '0')}`
// //
// //     // Create new user object
// //     const newUser = {
// //       id: newUserId,
// //       ...newUserData
// //     }
// //
// //     // Add to users array
// //     setUsers([...users, newUser])
// //
// //     // Close modal and reset form
// //     setShowAddUserModal(false)
// //     setNewUserData({
// //       name: "",
// //       email: "",
// //       status: "Active",
// //     })
// //
// //     showAlert("User added successfully!")
// //   }
// //
// //   const handleEditOrder = (order) => {
// //     setSelectedOrder(order)
// //     setEditedOrderData({
// //       customer: order.customer,
// //       date: order.date,
// //       amount: order.amount,
// //       status: order.status,
// //     })
// //   }
// //
// //   const handleSaveOrderEdit = () => {
// //     // Update order in the state
// //     const updatedOrders = orders.map(order =>
// //         order.id === selectedOrder.id ? { ...order, ...editedOrderData } : order
// //     )
// //     setOrders(updatedOrders)
// //
// //     // Close the order view
// //     setSelectedOrder(null)
// //
// //     showAlert("Order updated successfully!")
// //   }
// //
// //   const handleRequestAction = (requestId, action) => {
// //     const updatedRequests = requests.map(request => {
// //       if (request.id === requestId) {
// //         return { ...request, status: action }
// //       }
// //       return request
// //     })
// //     setRequests(updatedRequests)
// //     showAlert(`Request ${action.toLowerCase()} successfully!`)
// //     setSelectedRequest(null)
// //   }
// //
// //   const showAlert = (message) => {
// //     const successAlert = document.getElementById("success-alert")
// //     if (successAlert) {
// //       successAlert.textContent = message
// //       successAlert.classList.remove("d-none")
// //       setTimeout(() => {
// //         successAlert.classList.add("d-none")
// //       }, 3000)
// //     }
// //   }
// //
// //   const renderOrderDetail = () => (
// //       <div className="mb-4">
// //         <div className="d-flex justify-content-between align-items-center mb-3">
// //           <button className="btn btn-outline-secondary" onClick={() => setSelectedOrder(null)}>
// //             <ChevronLeft className="me-2" />
// //             Back to orders
// //           </button>
// //         </div>
// //
// //         <div className="card">
// //           <div className="card-header">
// //             <h3 className="card-title">Order Details</h3>
// //             <p className="card-text">
// //               Order ID: {selectedOrder.id}
// //             </p>
// //           </div>
// //           <div className="card-body">
// //             <div className="mb-3">
// //               <label className="form-label">Customer</label>
// //               <input
// //                   type="text"
// //                   className="form-control"
// //                   value={editedOrderData.customer}
// //                   onChange={(e) => setEditedOrderData({...editedOrderData, customer: e.target.value})}
// //               />
// //             </div>
// //             <div className="mb-3">
// //               <label className="form-label">Date</label>
// //               <input
// //                   type="text"
// //                   className="form-control"
// //                   value={editedOrderData.date}
// //                   onChange={(e) => setEditedOrderData({...editedOrderData, date: e.target.value})}
// //               />
// //             </div>
// //             <div className="mb-3">
// //               <label className="form-label">Amount</label>
// //               <input
// //                   type="text"
// //                   className="form-control"
// //                   value={editedOrderData.amount}
// //                   onChange={(e) => setEditedOrderData({...editedOrderData, amount: e.target.value})}
// //               />
// //             </div>
// //             <div className="mb-3">
// //               <label className="form-label">Status</label>
// //               <select
// //                   className="form-select"
// //                   value={editedOrderData.status}
// //                   onChange={(e) => setEditedOrderData({...editedOrderData, status: e.target.value})}
// //               >
// //                 <option value="Processing">Processing</option>
// //                 <option value="Shipped">Shipped</option>
// //                 <option value="Completed">Completed</option>
// //               </select>
// //             </div>
// //           </div>
// //           <div className="card-footer d-flex justify-content-end">
// //             <button
// //                 className="btn btn-secondary me-2"
// //                 onClick={() => setSelectedOrder(null)}
// //             >
// //               Cancel
// //             </button>
// //             <button
// //                 className="btn btn-primary"
// //                 onClick={handleSaveOrderEdit}
// //             >
// //               Save Changes
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //   )
// //
// //   const renderRequestDetail = () => (
// //       <div className="mb-4">
// //         <div className="d-flex justify-content-between align-items-center mb-3">
// //           <button className="btn btn-outline-secondary" onClick={() => setSelectedRequest(null)}>
// //             <ChevronLeft className="me-2" />
// //             Back to requests
// //           </button>
// //         </div>
// //
// //         <div className="card">
// //           <div className="card-header">
// //             <h3 className="card-title">Plastic Collection Request</h3>
// //             <p className="card-text">
// //               Request ID: {selectedRequest.id}
// //             </p>
// //           </div>
// //           <div className="card-body">
// //             <div className="mb-3">
// //               <label className="form-label">User</label>
// //               <input
// //                   type="text"
// //                   className="form-control"
// //                   value={selectedRequest.userName}
// //                   readOnly
// //               />
// //             </div>
// //             <div className="mb-3">
// //               <label className="form-label">Date</label>
// //               <input
// //                   type="text"
// //                   className="form-control"
// //                   value={selectedRequest.date}
// //                   readOnly
// //               />
// //             </div>
// //             <div className="mb-3">
// //               <label className="form-label">Location</label>
// //               <input
// //                   type="text"
// //                   className="form-control"
// //                   value={selectedRequest.location}
// //                   readOnly
// //               />
// //             </div>
// //             <div className="mb-3">
// //               <label className="form-label">Notes</label>
// //               <textarea
// //                   className="form-control"
// //                   value={selectedRequest.notes}
// //                   readOnly
// //               />
// //             </div>
// //
// //             <div className="mb-3">
// //               <label className="form-label">Plastics Collected</label>
// //               <table className="table">
// //                 <thead>
// //                 <tr>
// //                   <th>Type</th>
// //                   <th>Quantity (kgs)</th>
// //                 </tr>
// //                 </thead>
// //                 <tbody>
// //                 {selectedRequest.plastics.map((plastic, index) => (
// //                     <tr key={index}>
// //                       <td>{plastic.type}</td>
// //                       <td>{plastic.kgs}</td>
// //                     </tr>
// //                 ))}
// //                 <tr className="fw-bold">
// //                   <td>Total</td>
// //                   <td>
// //                     {selectedRequest.plastics.reduce((total, plastic) => total + plastic.kgs, 0)} kgs
// //                   </td>
// //                 </tr>
// //                 </tbody>
// //               </table>
// //             </div>
// //
// //             <div className="mb-3">
// //               <label className="form-label">Status</label>
// //               <div className="d-flex align-items-center">
// //               <span className={`badge ${
// //                   selectedRequest.status === "Approved" ? "bg-success" :
// //                       selectedRequest.status === "Rejected" ? "bg-danger" : "bg-warning"
// //               } me-3`}>
// //                 {selectedRequest.status}
// //               </span>
// //               </div>
// //             </div>
// //           </div>
// //           <div className="card-footer d-flex justify-content-end">
// //             {selectedRequest.status === "Pending" && (
// //                 <>
// //                   <button
// //                       className="btn btn-success me-2"
// //                       onClick={() => handleRequestAction(selectedRequest.id, "Approved")}
// //                   >
// //                     <Check className="me-1" />
// //                     Approve
// //                   </button>
// //                   <button
// //                       className="btn btn-danger"
// //                       onClick={() => handleRequestAction(selectedRequest.id, "Rejected")}
// //                   >
// //                     <X className="me-1" />
// //                     Reject
// //                   </button>
// //                 </>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //   )
// //
// //   const renderMessageDetail = () => (
// //       <div className="mb-4">
// //         <div className="d-flex justify-content-between align-items-center mb-3">
// //           <button className="btn btn-outline-secondary" onClick={() => setSelectedMessage(null)}>
// //             <ChevronLeft className="me-2" />
// //             Back to messages
// //           </button>
// //         </div>
// //
// //         <div className="card">
// //           <div className="card-header">
// //             <h3 className="card-title">{selectedMessage.subject}</h3>
// //             <p className="card-text">
// //               From: {selectedMessage.from} | Date: {selectedMessage.date}
// //             </p>
// //           </div>
// //           <div className="card-body">
// //             <div className="border rounded p-3 bg-light">
// //               <p>{selectedMessage.content}</p>
// //             </div>
// //           </div>
// //           <div className="card-footer d-flex justify-content-end">
// //             <button
// //                 className={`btn ${isReplying ? "btn-secondary" : "btn-outline-secondary"} me-2`}
// //                 onClick={() => setIsReplying(!isReplying)}
// //             >
// //               {isReplying ? "Cancel Reply" : "Reply"}
// //             </button>
// //             <button className="btn btn-outline-secondary me-2">Forward</button>
// //             <button className="btn btn-danger">Delete</button>
// //           </div>
// //         </div>
// //
// //         {isReplying && (
// //             <div className="card mt-3">
// //               <div className="card-header">
// //                 <h3 className="card-title">Reply to Message</h3>
// //                 <p className="card-text">Replying to: {selectedMessage.from}</p>
// //               </div>
// //               <div className="card-body">
// //                 <div className="mb-3">
// //                   <label className="form-label">Subject</label>
// //                   <input type="text" className="form-control bg-light" value={`Re: ${selectedMessage.subject}`} readOnly />
// //                 </div>
// //
// //                 <div className="mb-3">
// //                   <label className="form-label">Your Reply</label>
// //                   <textarea
// //                       className="form-control min-h-200"
// //                       value={replyContent}
// //                       onChange={(e) => setReplyContent(e.target.value)}
// //                       placeholder="Type your reply here..."
// //                   ></textarea>
// //                 </div>
// //
// //                 <div className="mb-3">
// //                   <label className="form-label">Attachments</label>
// //                   <div className="mb-2">
// //                     <div className="d-flex align-items-center">
// //                       <label className="cursor-pointer">
// //                         <input type="file" className="d-none" multiple onChange={handleAttachmentChange} />
// //                         <button className="btn btn-outline-secondary" type="button">
// //                           <Paperclip className="me-2" />
// //                           Add Attachment
// //                         </button>
// //                       </label>
// //                     </div>
// //                   </div>
// //
// //                   {attachments.length > 0 && (
// //                       <div className="border rounded p-2">
// //                         {attachments.map((file, index) => (
// //                             <div
// //                                 key={index}
// //                                 className="d-flex justify-content-between align-items-center p-2 bg-light rounded mb-1"
// //                             >
// //                               <div className="d-flex align-items-center">
// //                                 <Paperclip className="text-muted me-2" />
// //                                 <span>{file.name}</span>
// //                                 <span className="text-muted ms-2">({(file.size / 1024).toFixed(1)} KB)</span>
// //                               </div>
// //                               <button className="btn btn-link btn-sm" onClick={() => removeAttachment(index)}>
// //                                 Remove
// //                               </button>
// //                             </div>
// //                         ))}
// //                       </div>
// //                   )}
// //                 </div>
// //               </div>
// //               <div className="card-footer d-flex justify-content-end">
// //                 <button className="btn btn-primary" onClick={handleReply} disabled={isSending || !replyContent.trim()}>
// //                   {isSending ? (
// //                       <>
// //                         <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
// //                         Sending...
// //                       </>
// //                   ) : (
// //                       <>
// //                         <Send className="me-2" />
// //                         Send Reply
// //                       </>
// //                   )}
// //                 </button>
// //               </div>
// //             </div>
// //         )}
// //       </div>
// //   )
// //
// //   const renderTabContent = () => {
// //     switch (activeTab) {
// //       case "dashboard":
// //         return (
// //             <div className="mb-4">
// //               <div className="row mb-4">
// //                 <div className="col-md-3">
// //                   <div className="card">
// //                     <div className="card-header">
// //                       <p className="card-text">Total Products</p>
// //                       <h3 className="card-title fs-1">1,234</h3>
// //                     </div>
// //                     <div className="card-body">
// //                       <div className="text-muted">+12% from last month</div>
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <div className="col-md-3">
// //                   <div className="card">
// //                     <div className="card-header">
// //                       <p className="card-text">Active Sellers</p>
// //                       <h3 className="card-title fs-1">56</h3>
// //                     </div>
// //                     <div className="card-body">
// //                       <div className="text-muted">+5% from last month</div>
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <div className="col-md-3">
// //                   <div className="card">
// //                     <div className="card-header">
// //                       <p className="card-text">Total Orders</p>
// //                       <h3 className="card-title fs-1">789</h3>
// //                     </div>
// //                     <div className="card-body">
// //                       <div className="text-muted">+18% from last month</div>
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <div className="col-md-3">
// //                   <div className="card">
// //                     <div className="card-header">
// //                       <p className="card-text">Revenue</p>
// //                       <h3 className="card-title fs-1">$45,678</h3>
// //                     </div>
// //                     <div className="card-body">
// //                       <div className="text-muted">+22% from last month</div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //
// //               <div className="row mb-4">
// //                 <div className="col-md-6">
// //                   <div className="card">
// //                     <div className="card-header">
// //                       <h3 className="card-title">Sales Overview</h3>
// //                     </div>
// //                     <div className="card-body" style={{ height: "300px" }}>
// //                       <ResponsiveContainer width="100%" height="100%">
// //                         <LineChart data={salesData}>
// //                           <CartesianGrid strokeDasharray="3 3" />
// //                           <XAxis dataKey="name" />
// //                           <YAxis />
// //                           <Tooltip />
// //                           <Legend />
// //                           <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
// //                           <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
// //                         </LineChart>
// //                       </ResponsiveContainer>
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <div className="col-md-6">
// //                   <div className="card">
// //                     <div className="card-header">
// //                       <h3 className="card-title">Sales Distribution</h3>
// //                     </div>
// //                     <div className="card-body" style={{ height: "300px" }}>
// //                       <ResponsiveContainer width="100%" height="100%">
// //                         <PieChart>
// //                           <Pie
// //                               data={vendorData}
// //                               cx="50%"
// //                               cy="50%"
// //                               labelLine={false}
// //                               outerRadius={80}
// //                               fill="#8884d8"
// //                               dataKey="value"
// //                               label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
// //                           >
// //                             {vendorData.map((entry, index) => (
// //                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //                             ))}
// //                           </Pie>
// //                           <Tooltip />
// //                         </PieChart>
// //                       </ResponsiveContainer>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //
// //               <div className="card">
// //                 <div className="card-header">
// //                   <div className="d-flex justify-content-between align-items-center">
// //                     <h3 className="card-title">Recent Orders</h3>
// //                     <button className="btn btn-link" onClick={() => setActiveTab("orders")}>
// //                       View all <ArrowRight className="ms-2" />
// //                     </button>
// //                   </div>
// //                 </div>
// //                 <div className="card-body">
// //                   <table className="table">
// //                     <thead>
// //                     <tr>
// //                       <th>Order ID</th>
// //                       <th>Customer</th>
// //                       <th>Date</th>
// //                       <th>Amount</th>
// //                       <th>Status</th>
// //                     </tr>
// //                     </thead>
// //                     <tbody>
// //                     {orders.slice(0, 4).map((order) => (
// //                         <tr key={order.id}>
// //                           <td>{order.id}</td>
// //                           <td>{order.customer}</td>
// //                           <td>{order.date}</td>
// //                           <td>{order.amount}</td>
// //                           <td>
// //                           <span
// //                               className={`badge ${
// //                                   order.status === "Completed"
// //                                       ? "bg-success"
// //                                       : order.status === "Processing"
// //                                           ? "bg-info"
// //                                           : "bg-warning"
// //                               }`}
// //                           >
// //                             {order.status}
// //                           </span>
// //                           </td>
// //                         </tr>
// //                     ))}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               </div>
// //
// //               <div className="card mt-4">
// //                 <div className="card-header">
// //                   <div className="d-flex justify-content-between align-items-center">
// //                     <h3 className="card-title">Recent Users</h3>
// //                     <button className="btn btn-link" onClick={() => setActiveTab("users")}>
// //                       View all <ArrowRight className="ms-2" />
// //                     </button>
// //                   </div>
// //                 </div>
// //                 <div className="card-body">
// //                   <table className="table">
// //                     <thead>
// //                     <tr>
// //                       <th>User ID</th>
// //                       <th>Name</th>
// //                       <th>Email</th>
// //                       <th>Status</th>
// //                     </tr>
// //                     </thead>
// //                     <tbody>
// //                     {users.slice(0, 4).map((user) => (
// //                         <tr key={user.id}>
// //                           <td>{user.id}</td>
// //                           <td>{user.name}</td>
// //                           <td>{user.email}</td>
// //                           <td>
// //                           <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-danger"}`}>
// //                             {user.status}
// //                           </span>
// //                           </td>
// //                         </tr>
// //                     ))}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               </div>
// //             </div>
// //         )
// //
// //       case "users":
// //         return (
// //             <div className="mb-4">
// //               <div className="d-flex justify-content-between align-items-center mb-3">
// //                 <h2 className="h4">User Management</h2>
// //                 <div className="d-flex">
// //                   <input
// //                       type="text"
// //                       className="form-control me-2"
// //                       placeholder="Search users..."
// //                       value={userSearchQuery}
// //                       onChange={(e) => setUserSearchQuery(e.target.value)}
// //                   />
// //                   <button
// //                       className="btn btn-primary"
// //                       onClick={() => setShowAddUserModal(true)}
// //                   >
// //                     <Plus size={16} className="me-1" />
// //                     Add User
// //                   </button>
// //                 </div>
// //               </div>
// //               <div className="card">
// //                 <div className="card-body">
// //                   <table className="table">
// //                     <thead>
// //                     <tr>
// //                       <th>User ID</th>
// //                       <th>Name</th>
// //                       <th>Email</th>
// //                       <th>Status</th>
// //                       <th>Actions</th>
// //                     </tr>
// //                     </thead>
// //                     <tbody>
// //                     {filteredUsers.map((user) => (
// //                         <tr key={user.id}>
// //                           <td>{user.id}</td>
// //                           <td>{user.name}</td>
// //                           <td>{user.email}</td>
// //                           <td>
// //                           <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-danger"}`}>
// //                             {user.status}
// //                           </span>
// //                           </td>
// //                           <td>
// //                             <div className="d-flex">
// //                               <button
// //                                   className="btn btn-outline-primary btn-sm me-2"
// //                                   onClick={() => handleEditUser(user)}
// //                               >
// //                                 <Edit size={16} className="me-1" />
// //                                 Edit
// //                               </button>
// //                               <button
// //                                   className="btn btn-outline-danger btn-sm"
// //                                   onClick={() => {
// //                                     setUsers(users.filter(u => u.id !== user.id))
// //                                     showAlert("User deleted successfully!")
// //                                   }}
// //                               >
// //                                 <Trash size={16} className="me-1" />
// //                                 Delete
// //                               </button>
// //                             </div>
// //                           </td>
// //                         </tr>
// //                     ))}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //                 <div className="card-footer d-flex justify-content-between">
// //                   <div className="text-muted">Showing 1 to {filteredUsers.length} of {users.length} entries</div>
// //                   <div className="d-flex">
// //                     <button className="btn btn-outline-secondary btn-sm me-2">
// //                       <ChevronLeft size={16} />
// //                     </button>
// //                     <button className="btn btn-outline-secondary btn-sm">
// //                       <ChevronRight size={16} />
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //         )
// //
// //       case "orders":
// //         return selectedOrder ? (
// //             renderOrderDetail()
// //         ) : (
// //             <div className="mb-4">
// //               <div className="d-flex justify-content-between align-items-center mb-3">
// //                 <h2 className="h4">Order Management</h2>
// //                 <div className="d-flex">
// //                   <input type="text" className="form-control me-2" placeholder="Search orders..." />
// //                 </div>
// //               </div>
// //               <div className="card">
// //                 <div className="card-body">
// //                   <table className="table">
// //                     <thead>
// //                     <tr>
// //                       <th>Order ID</th>
// //                       <th>Customer</th>
// //                       <th>Date</th>
// //                       <th>Amount</th>
// //                       <th>Status</th>
// //                       <th>Actions</th>
// //                     </tr>
// //                     </thead>
// //                     <tbody>
// //                     {orders.map((order) => (
// //                         <tr key={order.id}>
// //                           <td>{order.id}</td>
// //                           <td>{order.customer}</td>
// //                           <td>{order.date}</td>
// //                           <td>{order.amount}</td>
// //                           <td>
// //                           <span
// //                               className={`badge ${
// //                                   order.status === "Completed"
// //                                       ? "bg-success"
// //                                       : order.status === "Processing"
// //                                           ? "bg-info"
// //                                           : "bg-warning"
// //                               }`}
// //                           >
// //                             {order.status}
// //                           </span>
// //                           </td>
// //                           <td>
// //                             <div className="d-flex">
// //                               <button
// //                                   className="btn btn-outline-primary btn-sm me-2"
// //                                   onClick={() => handleEditOrder(order)}
// //                               >
// //                                 View
// //                               </button>
// //                               <button
// //                                   className="btn btn-outline-secondary btn-sm"
// //                                   onClick={() => handleEditOrder(order)}
// //                               >
// //                                 Edit
// //                               </button>
// //                             </div>
// //                           </td>
// //                         </tr>
// //                     ))}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //                 <div className="card-footer d-flex justify-content-between">
// //                   <div className="text-muted">Showing 1 to {orders.length} of {orders.length} entries</div>
// //                   <div className="d-flex">
// //                     <button className="btn btn-outline-secondary btn-sm me-2">
// //                       <ChevronLeft size={16} />
// //                     </button>
// //                     <button className="btn btn-outline-secondary btn-sm">
// //                       <ChevronRight size={16} />
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //         )
// //
// //       case "requests":
// //         return selectedRequest ? (
// //             renderRequestDetail()
// //         ) : (
// //             <div className="mb-4">
// //               <div className="d-flex justify-content-between align-items-center mb-3">
// //                 <h2 className="h4">Plastic Collection Requests</h2>
// //                 <div className="d-flex">
// //                   <input
// //                       type="text"
// //                       className="form-control me-2"
// //                       placeholder="Search requests..."
// //                       value={requestSearchQuery}
// //                       onChange={(e) => setRequestSearchQuery(e.target.value)}
// //                   />
// //                 </div>
// //               </div>
// //               <div className="card">
// //                 <div className="card-body">
// //                   <table className="table">
// //                     <thead>
// //                     <tr>
// //                       <th>Request ID</th>
// //                       <th>User</th>
// //                       <th>Date</th>
// //                       <th>Total Plastics (kgs)</th>
// //                       <th>Status</th>
// //                       <th>Actions</th>
// //                     </tr>
// //                     </thead>
// //                     <tbody>
// //                     {filteredRequests.map((request) => (
// //                         <tr key={request.id}>
// //                           <td>{request.id}</td>
// //                           <td>{request.userName}</td>
// //                           <td>{request.date}</td>
// //                           <td>
// //                             {request.plastics.reduce((total, plastic) => total + plastic.kgs, 0)} kgs
// //                           </td>
// //                           <td>
// //                           <span className={`badge ${
// //                               request.status === "Approved" ? "bg-success" :
// //                                   request.status === "Rejected" ? "bg-danger" : "bg-warning"
// //                           }`}>
// //                             {request.status}
// //                           </span>
// //                           </td>
// //                           <td>
// //                             <button
// //                                 className="btn btn-outline-primary btn-sm"
// //                                 onClick={() => setSelectedRequest(request)}
// //                             >
// //                               View Details
// //                             </button>
// //                           </td>
// //                         </tr>
// //                     ))}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //                 <div className="card-footer d-flex justify-content-between">
// //                   <div className="text-muted">
// //                     Showing 1 to {filteredRequests.length} of {requests.length} entries
// //                   </div>
// //                   <div className="d-flex">
// //                     <button className="btn btn-outline-secondary btn-sm me-2">
// //                       <ChevronLeft size={16} />
// //                     </button>
// //                     <button className="btn btn-outline-secondary btn-sm">
// //                       <ChevronRight size={16} />
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //         )
// //
// //       case "messages":
// //         return selectedMessage ? (
// //             renderMessageDetail()
// //         ) : (
// //             <div className="mb-4">
// //               <div className="d-flex justify-content-between align-items-center mb-3">
// //                 <h2 className="h4">Messages</h2>
// //                 <div className="d-flex">
// //                   <input
// //                       type="text"
// //                       className="form-control me-2"
// //                       placeholder="Search messages..."
// //                       value={searchQuery}
// //                       onChange={(e) => setSearchQuery(e.target.value)}
// //                   />
// //                 </div>
// //               </div>
// //               <div className="card">
// //                 <div className="card-body">
// //                   <table className="table">
// //                     <thead>
// //                     <tr>
// //                       <th>From</th>
// //                       <th>Subject</th>
// //                       <th>Date</th>
// //                       <th>Status</th>
// //                       <th>Actions</th>
// //                     </tr>
// //                     </thead>
// //                     <tbody>
// //                     {filteredMessages.map((message) => (
// //                         <tr key={message.id} className={!message.read ? "fw-bold" : ""}>
// //                           <td>{message.from}</td>
// //                           <td>{message.subject}</td>
// //                           <td>{message.date}</td>
// //                           <td>
// //                             {message.read ? (
// //                                 <span className="text-muted">Read</span>
// //                             ) : (
// //                                 <span className="text-primary">Unread</span>
// //                             )}
// //                           </td>
// //                           <td>
// //                             <button
// //                                 className="btn btn-outline-primary btn-sm"
// //                                 onClick={() => setSelectedMessage(message)}
// //                             >
// //                               View
// //                             </button>
// //                           </td>
// //                         </tr>
// //                     ))}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //                 <div className="card-footer d-flex justify-content-between">
// //                   <div className="text-muted">
// //                     Showing 1 to {filteredMessages.length} of {messages.length} entries
// //                   </div>
// //                   <div className="d-flex">
// //                     <button className="btn btn-outline-secondary btn-sm me-2">
// //                       <ChevronLeft size={16} />
// //                     </button>
// //                     <button className="btn btn-outline-secondary btn-sm">
// //                       <ChevronRight size={16} />
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //         )
// //
// //       default:
// //         return null
// //     }
// //   }
// //
// //   return (
// //       <div className="d-flex min-vh-100">
// //         {/* Sidebar */}
// //         <div className="bg-light border-end" style={{ width: "250px" }}>
// //           <div className="p-3">
// //             <h1 className="h5">Polymart Admin</h1>
// //           </div>
// //           <nav className="nav flex-column p-2">
// //             <button
// //                 className={`btn d-flex align-items-center mb-1 ${
// //                     activeTab === "dashboard" ? "btn-secondary" : "btn-link text-decoration-none text-dark"
// //                 }`}
// //                 onClick={() => setActiveTab("dashboard")}
// //             >
// //               <Home className="me-2" />
// //               Dashboard
// //             </button>
// //             <button
// //                 className={`btn d-flex align-items-center mb-1 ${
// //                     activeTab === "users" ? "btn-secondary" : "btn-link text-decoration-none text-dark"
// //                 }`}
// //                 onClick={() => setActiveTab("users")}
// //             >
// //               <Users className="me-2" />
// //               Users
// //             </button>
// //             <button
// //                 className={`btn d-flex align-items-center mb-1 ${
// //                     activeTab === "orders" ? "btn-secondary" : "btn-link text-decoration-none text-dark"
// //                 }`}
// //                 onClick={() => setActiveTab("orders")}
// //             >
// //               <ShoppingCart className="me-2" />
// //               Orders
// //             </button>
// //             <button
// //                 className={`btn d-flex align-items-center mb-1 ${
// //                     activeTab === "requests" ? "btn-secondary" : "btn-link text-decoration-none text-dark"
// //                 }`}
// //                 onClick={() => setActiveTab("requests")}
// //             >
// //               <Recycle className="me-2" />
// //               Plastic Requests
// //             </button>
// //             <button
// //                 className={`btn d-flex align-items-center mb-1 ${
// //                     activeTab === "messages" ? "btn-secondary" : "btn-link text-decoration-none text-dark"
// //                 }`}
// //                 onClick={() => setActiveTab("messages")}
// //             >
// //               <Mail className="me-2" />
// //               Messages
// //             </button>
// //           </nav>
// //         </div>
// //
// //         {/* Main Content */}
// //         <div className="flex-grow-1 p-4">
// //           {/* Success Alert */}
// //           <div className="alert alert-success alert-dismissible fade show d-none" role="alert" id="success-alert">
// //             Operation completed successfully!
// //             <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
// //           </div>
// //
// //           {renderTabContent()}
// //         </div>
// //
// //         {/* User Edit Modal */}
// //         {showUserEditModal && (
// //             <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
// //               <div className="modal-dialog">
// //                 <div className="modal-content">
// //                   <div className="modal-header">
// //                     <h5 className="modal-title">Edit User</h5>
// //                     <button type="button" className="btn-close" onClick={() => setShowUserEditModal(false)}></button>
// //                   </div>
// //                   <div className="modal-body">
// //                     <div className="mb-3">
// //                       <label className="form-label">User ID</label>
// //                       <input type="text" className="form-control" value={editingUser.id} disabled />
// //                     </div>
// //                     <div className="mb-3">
// //                       <label className="form-label">Name</label>
// //                       <input
// //                           type="text"
// //                           className="form-control"
// //                           value={editedUserData.name}
// //                           onChange={(e) => setEditedUserData({ ...editedUserData, name: e.target.value })}
// //                       />
// //                     </div>
// //                     <div className="mb-3">
// //                       <label className="form-label">Email</label>
// //                       <input
// //                           type="email"
// //                           className="form-control"
// //                           value={editedUserData.email}
// //                           onChange={(e) => setEditedUserData({ ...editedUserData, email: e.target.value })}
// //                       />
// //                     </div>
// //                     <div className="mb-3">
// //                       <label className="form-label">Status</label>
// //                       <select
// //                           className="form-select"
// //                           value={editedUserData.status}
// //                           onChange={(e) => setEditedUserData({ ...editedUserData, status: e.target.value })}
// //                       >
// //                         <option value="Active">Active</option>
// //                         <option value="Suspended">Suspended</option>
// //                       </select>
// //                     </div>
// //                   </div>
// //                   <div className="modal-footer">
// //                     <button type="button" className="btn btn-secondary" onClick={() => setShowUserEditModal(false)}>
// //                       Cancel
// //                     </button>
// //                     <button type="button" className="btn btn-primary" onClick={handleSaveUserEdit}>
// //                       Save changes
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //         )}
// //
// //         {/* Add User Modal */}
// //         {showAddUserModal && (
// //             <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
// //               <div className="modal-dialog">
// //                 <div className="modal-content">
// //                   <div className="modal-header">
// //                     <h5 className="modal-title">Add New User</h5>
// //                     <button type="button" className="btn-close" onClick={() => setShowAddUserModal(false)}></button>
// //                   </div>
// //                   <div className="modal-body">
// //                     <div className="mb-3">
// //                       <label className="form-label">Name</label>
// //                       <input
// //                           type="text"
// //                           className="form-control"
// //                           value={newUserData.name}
// //                           onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
// //                           placeholder="Enter user name"
// //                       />
// //                     </div>
// //                     <div className="mb-3">
// //                       <label className="form-label">Email</label>
// //                       <input
// //                           type="email"
// //                           className="form-control"
// //                           value={newUserData.email}
// //                           onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
// //                           placeholder="Enter user email"
// //                       />
// //                     </div>
// //                     <div className="mb-3">
// //                       <label className="form-label">Status</label>
// //                       <select
// //                           className="form-select"
// //                           value={newUserData.status}
// //                           onChange={(e) => setNewUserData({ ...newUserData, status: e.target.value })}
// //                       >
// //                         <option value="Active">Active</option>
// //                         <option value="Suspended">Suspended</option>
// //                       </select>
// //                     </div>
// //                   </div>
// //                   <div className="modal-footer">
// //                     <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)}>
// //                       Cancel
// //                     </button>
// //                     <button
// //                         type="button"
// //                         className="btn btn-primary"
// //                         onClick={handleAddUser}
// //                         disabled={!newUserData.name || !newUserData.email}
// //                     >
// //                       Add User
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //         )}
// //       </div>
// //   )
// // }
// //
// // function App() {
// //   return (
// //       <div className="App">
// //         <PolymartAdminDashboard />
// //       </div>
// //   )
// // }
// //
// // export default App