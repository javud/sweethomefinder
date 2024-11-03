import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { PlusCircle, MessageCircle, ListChecks, BarChart3, Users, PawPrint } from 'lucide-react';
import '../styles/adminPortal.scss';

function AdminPortal() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('applications');
  const [applications, setApplications] = useState([
    // Sample data need mf actual api
    {
      id: 1,
      applicantName: "Graz",
      petName: "Rex",
      status: "Pending",
      date: "2024-03-01",
      quizResults: "85% match",
      message: "I would love to cook this bitch ass dog"
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "Graz",
      subject: "Question about Rex",
      date: "2024-03-01",
      unread: true
    }
  ]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const response = await fetch(
            `http://localhost:5001/api/users/check-admin?clerkUserId=${user.id}`
          );
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        } catch (error) {
          console.error('Error checking admin status:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    checkAdminStatus();
  }, [user]);

  const renderApplications = () => (
    <div className="content-section">
      <div className="section-header">
        <h2>Pet Applications</h2>
        <div className="filters">
          <select defaultValue="all">
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div className="applications-list">
        {applications.map(app => (
          <div key={app.id} className="application-card">
            <div className="application-header">
              <h3>{app.applicantName}'s Application for {app.petName}</h3>
              <span className={`status ${app.status.toLowerCase()}`}>{app.status}</span>
            </div>
            <div className="application-details">
              <p><strong>Date:</strong> {app.date}</p>
              <p><strong>Quiz Match:</strong> {app.quizResults}</p>
              <p><strong>Message:</strong> {app.message}</p>
            </div>
            <div className="application-actions">
              <button className="approve-btn">Approve</button>
              <button className="reject-btn">Reject</button>
              <button className="message-btn">Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPetManagement = () => (
    <div className="content-section">
      <div className="section-header">
        <h2>Pet Management</h2>
        <button className="add-pet-btn">
          + Add New Pet
        </button>
      </div>
      <div className="pet-management-tools">
        <div className="tool-section">
          <h3>List New Pet</h3>
          <form className="pet-form">
            <input type="text" placeholder="Pet Name" />
            
            <select defaultValue="">
              <option value="" disabled>Select Species</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
            </select>
            
            <input type="text" placeholder="Breed" />
            <input type="number" placeholder="Age" />
            
            <select defaultValue="">
              <option value="" disabled>Select Size</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
  
            {/**/}
            <select defaultValue="">
              <option value="" disabled>Select Energy Level</option>
              <option value="low_energy">Low Energy</option>
              <option value="moderate_energy">Moderate Energy</option>
              <option value="high_energy">High Energy</option>
            </select>
  
            {/**/}
            <select defaultValue="">
              <option value="" disabled>Select Living Environment</option>
              <option value="apartment_friendly">Apartment Friendly</option>
              <option value="house_with_yard">House with Yard</option>
            </select>
            
            <textarea placeholder="Description"></textarea>
            
            <div className="form-section">
              <h4>Medical Records</h4>
              <div className="checkbox-group">
                <label>
                  <input type="checkbox" /> Vaccinated
                </label>
                <label>
                  <input type="checkbox" /> Neutered/Spayed
                </label>
                <label>
                  <input type="checkbox" /> Microchipped
                </label>
              </div>
            </div>
            
            <div className="photo-upload">
              <button type="button">Upload Photos</button>
            </div>
            
            <button type="submit" className="submit-btn">List Pet</button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="content-section">
      <div className="section-header">
        <h2>Messages</h2>
      </div>
      <div className="messages-list">
        {messages.map(message => (
          <div key={message.id} className={`message-card ${message.unread ? 'unread' : ''}`}>
            <div className="message-info">
              <h3>{message.from}</h3>
              <p>{message.subject}</p>
              <span className="date">{message.date}</span>
            </div>
            <div className="message-actions">
              <button className="reply-btn">Reply</button>
              <button className="view-btn">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAdmin) {
    return <div className="unauthorized">Unauthorized: Admin access only</div>;
  }

  return (
    <div className="admin-portal">
      <div className="admin-sidebar">
        <div className="admin-info">
          <div className="admin-avatar">
            {user?.firstName?.charAt(0) || 'A'}
          </div>
          <div className="admin-name">
            {user?.firstName || 'Admin'} {user?.lastName || ''}
          </div>
        </div>
        <nav className="admin-nav">
          <button 
            className={`nav-item ${activeSection === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveSection('applications')}
          >
            <ListChecks size={20} />
            Applications
          </button>
          <button 
            className={`nav-item ${activeSection === 'pets' ? 'active' : ''}`}
            onClick={() => setActiveSection('pets')}
          >
            <PawPrint size={20} />
            Pet Management
          </button>
          <button 
            className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveSection('messages')}
          >
            <MessageCircle size={20} />
            Messages
          </button>
          <button 
            className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveSection('analytics')}
          >
            <BarChart3 size={20} />
            Analytics
          </button>
        </nav>
      </div>
      
      <div className="admin-content">
        {activeSection === 'applications' && renderApplications()}
        {activeSection === 'pets' && renderPetManagement()}
        {activeSection === 'messages' && renderMessages()}
        {activeSection === 'analytics' && (
          <div className="content-section">
            <h2>Analytics Dashboard</h2>
            {/* Add analytics could be amount of new inqueries or sum*/}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPortal;