// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const response = await axios.get('http://localhost:5000/api/auth/users');
        setUsers(response.data);
      } else if (activeTab === 'contacts') {
        const response = await axios.get('http://localhost:5000/api/contacts/all');
        setContacts(response.data);
      } else if (activeTab === 'orders') {
        const response = await axios.get('http://localhost:5000/api/orders');
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const updateOrder = async (id, orderStatus, paymentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, { orderStatus, paymentStatus });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`http://localhost:5000/api/contacts/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };
  const deleteUser = async (id) => {
  if (window.confirm("Delete this user?")) {
    try {
      await axios.delete(
        `http://localhost:5000/api/auth/users/${id}`
      );

      fetchData();
    } catch (error) {
      console.log(error);
    }
  }
};

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/contacts/${id}/read`);
      fetchData();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return (
    <div className="admin-dashboard">
    <div className="stats">
  <div className="stat-card">
    <h2>{users.length}</h2>
    <p>Total Users</p>
  </div>

  <div className="stat-card">
    <h2>{contacts.length}</h2>
    <p>Total Messages</p>
  </div>
</div>
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="tab-buttons">
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => setActiveTab('users')}
          >
            Users ({users.length})
          </button>
          <button 
            className={activeTab === 'contacts' ? 'active' : ''} 
            onClick={() => setActiveTab('contacts')}
          >
            Contact Messages ({contacts.length})
          </button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            Orders ({orders.length})
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
    <th>Name</th>
    <th>Email</th>
    <th>Actions</th>
  </tr>
</thead>
                  <tbody>
  {users.map((user) => (
    <tr key={user._id}>
      <td>{user.name}</td>
      <td>{user.email}</td>

      <td>
        <button
          className="delete-btn"
          onClick={() => deleteUser(user._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
                </table>
              </div>
            )}

            
            {activeTab === 'orders' && (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th><th>Name</th><th>Email</th><th>Amount</th><th>Payment</th><th>Payment Status</th><th>Order Status</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order)=>(
                      <tr key={order._id}>
                        <td>{order.orderId}</td>
                        <td>{order.user?.name}</td>
                        <td>{order.user?.email}</td>
                        <td>₹{order.totalAmount}</td>
                        <td>{order.paymentMethod}</td>
                        <td>{order.paymentStatus}</td>
                        <td>{order.orderStatus}</td>
                        <td><button className="mark-read-btn" onClick={()=>updateOrder(order._id,'delivered',order.paymentStatus)}>Delivered</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}


            {activeTab === 'contacts' && (
              <div className="contacts-list">
                {contacts.map(contact => (
                  <div key={contact._id} className={`contact-card ${!contact.isRead ? 'unread' : ''}`}>
                    <div className="contact-header">
                      <h3>{contact.subject}</h3>
                      <div className="contact-actions">
                        {!contact.isRead && (
                          <button onClick={() => markAsRead(contact._id)} className="mark-read-btn">
                            Mark as Read
                          </button>
                        )}
                        <button onClick={() => deleteContact(contact._id)} className="delete-btn">
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="contact-details">
                      <p><strong>From:</strong> {contact.name} ({contact.email})</p>
                      <p><strong>Date:</strong> {new Date(contact.createdAt).toLocaleString()}</p>
                      <p><strong>Message:</strong></p>
                      <p className="message">{contact.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;