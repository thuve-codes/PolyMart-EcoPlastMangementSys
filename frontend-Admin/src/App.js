"use client"

import { useState, useEffect } from "react"
import { Home, Users, ShoppingCart, Mail, ArrowRight, ChevronRight, ChevronLeft, Paperclip, Send, Edit, Trash, Plus, Check, X, Recycle } from 'lucide-react'
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
} from "recharts"
import "bootstrap/dist/css/bootstrap.min.css"
import "./Dashboard.css"

const API_BASE_URL = "http://localhost:5000/api"; // Update with your backend URL

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

function PolymartAdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [replyContent, setReplyContent] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [attachments, setAttachments] = useState([])
  const [isSending, setIsSending] = useState(false)
  const [showUserEditModal, setShowUserEditModal] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [requests, setRequests] = useState([])
  const [messages, setMessages] = useState([]) // Added messages state
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [requestSearchQuery, setRequestSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState({
    users: false,
    orders: false,
    requests: false,
    messages: false,
    stats: false
  })
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeSellers: 0,
    totalOrders: 0,
    revenue: 0
  })
  
  // Form states
  const [editedUserData, setEditedUserData] = useState({
    name: "",
    email: "",
    status: "Active",
  })
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    status: "Active",
  })
  const [editedOrderData, setEditedOrderData] = useState({
    customer: "",
    date: "",
    amount: "",
    status: "Processing",
  })

  // Fetch data from backend
  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
    fetchOrders();
    fetchRequests();
    fetchMessages(); // Added messages fetch
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(prev => ({...prev, stats: true}));
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();
      setStats({
        totalProducts: data.totalProducts || 0,
        activeSellers: data.activeSellers || 0,
        totalOrders: data.totalOrders || 0,
        revenue: data.revenue || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      showAlert("Failed to load dashboard statistics");
    } finally {
      setIsLoading(prev => ({...prev, stats: false}));
    }
  }

  const fetchUsers = async () => {
    try {
      setIsLoading(prev => ({...prev, users: true}));
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
      setIsLoading(prev => ({...prev, users: false}));
    }
  }

  const fetchOrders = async () => {
    try {
      setIsLoading(prev => ({...prev, orders: true}));
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
      setIsLoading(prev => ({...prev, orders: false}));
    }
  }

  const fetchRequests = async () => {
    try {
      setIsLoading(prev => ({...prev, requests: true}));
      const response = await fetch(`${API_BASE_URL}/requests`);
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      showAlert("Failed to load plastic collection requests");
    } finally {
      setIsLoading(prev => ({...prev, requests: false}));
    }
  }

  const fetchMessages = async () => {
    try {
      setIsLoading(prev => ({...prev, messages: true}));
      const response = await fetch(`${API_BASE_URL}/messages`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      showAlert("Failed to load messages");
    } finally {
      setIsLoading(prev => ({...prev, messages: false}));
    }
  }

  const filteredMessages = messages.filter(
    (message) =>
      message.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchQuery.toLowerCase()),
  )

  const filteredRequests = requests.filter(
    (request) =>
      request.userName?.toLowerCase().includes(requestSearchQuery.toLowerCase()) ||
      request.id?.toLowerCase().includes(requestSearchQuery.toLowerCase()) ||
      request.status?.toLowerCase().includes(requestSearchQuery.toLowerCase()),
  )

  const handleReply = async () => {
    if (!selectedMessage) return;
    
    setIsSending(true)
    try {
      const response = await fetch(`${API_BASE_URL}/messages/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: selectedMessage.from,
          subject: `Re: ${selectedMessage.subject}`,
          content: replyContent,
          attachments: attachments.map((file) => file.name),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reply");
      }

      // Reset states
      setReplyContent("");
      setAttachments([]);
      setIsReplying(false);
      showAlert("Reply sent successfully!");
    } catch (error) {
      console.error("Error sending reply:", error);
      showAlert("Failed to send reply");
    } finally {
      setIsSending(false);
    }
  }

  const handleAttachmentChange = (e) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files)
    setAttachments(files)
  }

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setEditedUserData({
      name: user.name || "",
      email: user.email || "",
      status: user.status || "Active",
    })
    setShowUserEditModal(true)
  }

  const handleSaveUserEdit = async () => {
    if (!editingUser) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/${editingUser.id}`, {
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
      const updatedUsers = users.map(user => 
        user.id === editingUser.id ? { ...user, ...editedUserData } : user
      )
      setUsers(updatedUsers)
      
      // Close modal
      setShowUserEditModal(false)
      showAlert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      showAlert("Failed to update user");
    }
  }

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
        throw new Error("Failed to add user");
      }

      const newUser = await response.json();
      
      // Add to users array
      setUsers([...users, newUser])
      
      // Close modal and reset form
      setShowAddUserModal(false)
      setNewUserData({
        name: "",
        email: "",
        status: "Active",
      })

      showAlert("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error);
      showAlert("Failed to add user");
    }
  }

  const handleEditOrder = (order) => {
    setSelectedOrder(order)
    setEditedOrderData({
      customer: order.customer || "",
      date: order.date || "",
      amount: order.amount || "",
      status: order.status || "Processing",
    })
  }

  const handleSaveOrderEdit = async () => {
    if (!selectedOrder) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedOrderData),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      // Update order in the state
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id ? { ...order, ...editedOrderData } : order
      )
      setOrders(updatedOrders)
      
      // Close the order view
      setSelectedOrder(null)
      showAlert("Order updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
      showAlert("Failed to update order");
    }
  }

  const handleRequestAction = async (requestId, action) => {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action.toLowerCase()} request`);
      }

      const updatedRequests = requests.map(request => {
        if (request.id === requestId) {
          return { ...request, status: action }
        }
        return request
      })
      setRequests(updatedRequests)
      showAlert(`Request ${action.toLowerCase()} successfully!`)
      setSelectedRequest(null)
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing request:`, error);
      showAlert(`Failed to ${action.toLowerCase()} request`);
    }
  }

  const showAlert = (message) => {
    const successAlert = document.getElementById("success-alert")
    if (successAlert) {
      successAlert.textContent = message
      successAlert.classList.remove("d-none")
      setTimeout(() => {
        successAlert.classList.add("d-none")
      }, 3000)
    }
  }

  const renderOrderDetail = () => {
    if (!selectedOrder) return null;
    
    return (
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-outline-secondary" onClick={() => setSelectedOrder(null)}>
            <ChevronLeft className="me-2" />
            Back to orders
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Order Details</h3>
            <p className="card-text">
              Order ID: {selectedOrder.id}
            </p>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Customer</label>
              <input
                type="text"
                className="form-control"
                value={editedOrderData.customer}
                onChange={(e) => setEditedOrderData({...editedOrderData, customer: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="text"
                className="form-control"
                value={editedOrderData.date}
                onChange={(e) => setEditedOrderData({...editedOrderData, date: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Amount</label>
              <input
                type="text"
                className="form-control"
                value={editedOrderData.amount}
                onChange={(e) => setEditedOrderData({...editedOrderData, amount: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={editedOrderData.status}
                onChange={(e) => setEditedOrderData({...editedOrderData, status: e.target.value})}
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Completed">Completed</option>
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
            <button 
              className="btn btn-primary"
              onClick={handleSaveOrderEdit}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderRequestDetail = () => {
    if (!selectedRequest) return null;
    
    return (
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-outline-secondary" onClick={() => setSelectedRequest(null)}>
            <ChevronLeft className="me-2" />
            Back to requests
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Plastic Collection Request</h3>
            <p className="card-text">
              Request ID: {selectedRequest.id}
            </p>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">User</label>
              <input
                type="text"
                className="form-control"
                value={selectedRequest.userName}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="text"
                className="form-control"
                value={selectedRequest.date}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                value={selectedRequest.location}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Notes</label>
              <textarea
                className="form-control"
                value={selectedRequest.notes}
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
                  {selectedRequest.plastics && selectedRequest.plastics.map((plastic, index) => (
                    <tr key={index}>
                      <td>{plastic.type}</td>
                      <td>{plastic.kgs}</td>
                    </tr>
                  ))}
                  <tr className="fw-bold">
                    <td>Total</td>
                    <td>
                      {selectedRequest.plastics ? 
                        selectedRequest.plastics.reduce((total, plastic) => total + (plastic.kgs || 0), 0) : 0} kgs
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Status</label>
              <div className="d-flex align-items-center">
                <span className={`badge ${
                  selectedRequest.status === "Approved" ? "bg-success" :
                  selectedRequest.status === "Rejected" ? "bg-danger" : "bg-warning"
                } me-3`}>
                  {selectedRequest.status}
                </span>
              </div>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-end">
            {selectedRequest.status === "Pending" && (
              <>
                <button
                  className="btn btn-success me-2"
                  onClick={() => handleRequestAction(selectedRequest.id, "Approved")}
                >
                  <Check className="me-1" />
                  Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRequestAction(selectedRequest.id, "Rejected")}
                >
                  <X className="me-1" />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const renderMessageDetail = () => {
    if (!selectedMessage) return null;
    
    return (
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-outline-secondary" onClick={() => setSelectedMessage(null)}>
            <ChevronLeft className="me-2" />
            Back to messages
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{selectedMessage.subject}</h3>
            <p className="card-text">
              From: {selectedMessage.from} | Date: {selectedMessage.date}
            </p>
          </div>
          <div className="card-body">
            <div className="border rounded p-3 bg-light">
              <p>{selectedMessage.content}</p>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-end">
            <button
              className={`btn ${isReplying ? "btn-secondary" : "btn-outline-secondary"} me-2`}
              onClick={() => setIsReplying(!isReplying)}
            >
              {isReplying ? "Cancel Reply" : "Reply"}
            </button>
            <button className="btn btn-outline-secondary me-2">Forward</button>
            <button className="btn btn-danger">Delete</button>
          </div>
        </div>

        {isReplying && (
          <div className="card mt-3">
            <div className="card-header">
              <h3 className="card-title">Reply to Message</h3>
              <p className="card-text">Replying to: {selectedMessage.from}</p>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Subject</label>
                <input type="text" className="form-control bg-light" value={`Re: ${selectedMessage.subject}`} readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label">Your Reply</label>
                <textarea
                  className="form-control min-h-200"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply here..."
                  style={{ minHeight: "200px" }}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Attachments</label>
                <div className="mb-2">
                  <div className="d-flex align-items-center">
                    <label className="cursor-pointer">
                      <input type="file" className="d-none" multiple onChange={handleAttachmentChange} />
                      <button className="btn btn-outline-secondary" type="button">
                        <Paperclip className="me-2" />
                        Add Attachment
                      </button>
                    </label>
                  </div>
                </div>

                {attachments.length > 0 && (
                  <div className="border rounded p-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center p-2 bg-light rounded mb-1"
                      >
                        <div className="d-flex align-items-center">
                          <Paperclip className="text-muted me-2" />
                          <span>{file.name}</span>
                          <span className="text-muted ms-2">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button className="btn btn-link btn-sm" onClick={() => removeAttachment(index)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="card-footer d-flex justify-content-end">
              <button className="btn btn-primary" onClick={handleReply} disabled={isSending || !replyContent.trim()}>
                {isSending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="me-2" />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="mb-4">
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
                    <p className="card-text">Active Sellers</p>
                    <h3 className="card-title fs-1">{stats.activeSellers}</h3>
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
                    <h3 className="card-title fs-1">{stats.totalOrders}</h3>
                  </div>
                  <div className="card-body">
                    <div className="text-muted">+18% from last month</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-header">
                    <p className="card-text">Revenue</p>
                    <h3 className="card-title fs-1">${stats.revenue.toLocaleString()}</h3>
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
                        <LineChart data={orders}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Sales Distribution</h3>
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
                            data={requests}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="totalKgs"
                            label={({ userName, percent }) => `${userName}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {requests.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
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
                  <button className="btn btn-link" onClick={() => setActiveTab("orders")}>
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
                      {orders.slice(0, 4).map((order) => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{order.date}</td>
                          <td>${order.amount}</td>
                          <td>
                            <span
                              className={`badge ${
                                order.status === "Completed"
                                  ? "bg-success"
                                  : order.status === "Processing"
                                    ? "bg-info"
                                    : "bg-warning"
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
                  <button className="btn btn-link" onClick={() => setActiveTab("users")}>
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
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-danger"}`}>
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )

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
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-danger"}`}>
                                {user.status}
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
                                      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
                                        method: "DELETE"
                                      });
                                      
                                      if (!response.ok) {
                                        throw new Error("Failed to delete user");
                                      }
                                      
                                      setUsers(users.filter(u => u.id !== user.id))
                                      showAlert("User deleted successfully!")
                                    } catch (error) {
                                      console.error("Error deleting user:", error);
                                      showAlert("Failed to delete user");
                                    }
                                  }}
                                >
                                  <Trash size={16} className="me-1" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="card-footer d-flex justify-content-between">
                      <div className="text-muted">Showing 1 to {filteredUsers.length} of {users.length} entries</div>
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
        )

      case "orders":
        return selectedOrder ? (
          renderOrderDetail()
        ) : (
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h4">Order Management</h2>
              <div className="d-flex">
                <input type="text" className="form-control me-2" placeholder="Search orders..." />
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
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.date}</td>
                            <td>${order.amount}</td>
                            <td>
                              <span
                                className={`badge ${
                                  order.status === "Completed"
                                    ? "bg-success"
                                    : order.status === "Processing"
                                      ? "bg-info"
                                      : "bg-warning"
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
                                  View
                                </button>
                                <button 
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => handleEditOrder(order)}
                                >
                                  Edit
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="card-footer d-flex justify-content-between">
                      <div className="text-muted">Showing 1 to {orders.length} of {orders.length} entries</div>
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
        )

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
                          <tr key={request.id}>
                            <td>{request.id}</td>
                            <td>{request.userName}</td>
                            <td>{request.date}</td>
                            <td>
                              {request.plastics ? 
                                request.plastics.reduce((total, plastic) => total + (plastic.kgs || 0), 0) : 0} kgs
                            </td>
                            <td>
                              <span className={`badge ${
                                request.status === "Approved" ? "bg-success" :
                                request.status === "Rejected" ? "bg-danger" : "bg-warning"
                              }`}>
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
                        Showing 1 to {filteredRequests.length} of {requests.length} entries
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
        )

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
                {isLoading.messages ? (
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
                          <th>From</th>
                          <th>Subject</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMessages.map((message) => (
                          <tr key={message.id} className={!message.read ? "fw-bold" : ""}>
                            <td>{message.from}</td>
                            <td>{message.subject}</td>
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
                  </>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

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
              activeTab === "dashboard" ? "btn-secondary" : "btn-link text-decoration-none text-dark"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Home className="me-2" />
            Dashboard
          </button>
          <button
            className={`btn d-flex align-items-center mb-1 ${
              activeTab === "users" ? "btn-secondary" : "btn-link text-decoration-none text-dark"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users className="me-2" />
            Users
          </button>
          <button
            className={`btn d-flex align-items-center mb-1 ${
              activeTab === "orders" ? "btn-secondary" : "btn-link text-decoration-none text-dark"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart className="me-2" />
            Orders
          </button>
          <button
            className={`btn d-flex align-items-center mb-1 ${
              activeTab === "requests" ? "btn-secondary" : "btn-link text-decoration-none text-dark"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            <Recycle className="me-2" />
            Plastic Requests
          </button>
          <button
            className={`btn d-flex align-items-center mb-1 ${
              activeTab === "messages" ? "btn-secondary" : "btn-link text-decoration-none text-dark"
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
        <div className="alert alert-success alert-dismissible fade show d-none" role="alert" id="success-alert">
          Operation completed successfully!
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>

        {renderTabContent()}
      </div>

      {/* User Edit Modal */}
      {showUserEditModal && editingUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={() => setShowUserEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">User ID</label>
                  <input type="text" className="form-control" value={editingUser.id} disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedUserData.name}
                    onChange={(e) => setEditedUserData({ ...editedUserData, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editedUserData.email}
                    onChange={(e) => setEditedUserData({ ...editedUserData, email: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={editedUserData.status}
                    onChange={(e) => setEditedUserData({ ...editedUserData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUserEditModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveUserEdit}>
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New User</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddUserModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    placeholder="Enter user name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    placeholder="Enter user email"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={newUserData.status}
                    onChange={(e) => setNewUserData({ ...newUserData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleAddUser}
                  disabled={!newUserData.name || !newUserData.email}
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <PolymartAdminDashboard />
    </div>
  )
}

export default App