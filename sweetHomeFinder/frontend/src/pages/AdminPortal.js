import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { PlusCircle, MessageCircle, ListChecks, BarChart3, Users, PawPrint } from 'lucide-react';
import '../styles/adminPortal.scss';

function AdminPortal() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('applications');
  const [successMessage, setSuccessMessage] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    ageUnit: 'years',
    size: '',
    energy_level: '',
    living_environment: '',
    bio: '',
    medical_history: '',
    image1: 'https://i.pinimg.com/originals/22/1c/20/221c2021c91d60b1eb13ea676460a92c.png'
  });

  const [applications, setApplications] = useState([
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5001/api/pets/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          image1: data.url
        }));
        setSelectedImage(URL.createObjectURL(file));
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submissionData = {
        ...formData,
        age: `${formData.age} ${formData.ageUnit}`, // Combine age and unit
      };

      // Remove ageUnit from the final submission
      delete submissionData.ageUnit;

      const response = await fetch('http://localhost:5001/api/pets/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        setSuccessMessage('Successfully listed new pet!');
        
        // Reset form with ageUnit included
        setFormData({
          name: '',
          type: '',
          breed: '',
          age: '',
          ageUnit: 'years',
          size: '',
          energy_level: '',
          living_environment: '',
          bio: '',
          medical_history: '',
          image1: 'https://i.pinimg.com/originals/22/1c/20/221c2021c91d60b1eb13ea676460a92c.png'
        });
        setSelectedImage(null);

        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        throw new Error('Failed to list pet');
      }
    } catch (error) {
      console.error('Error listing pet:', error);
      setSuccessMessage('Error: Failed to list pet');
    }
  };

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
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      <div className="pet-management-tools">
        <div className="tool-section">
          <h3>List New Pet</h3>
          <form className="pet-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Pet Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Species</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
            </select>
            
            <input
              type="text"
              name="breed"
              placeholder="Breed"
              value={formData.breed}
              onChange={handleInputChange}
              required
            />
            
            <div className="age-input-group">
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleInputChange}
                required
                style={{ flex: '1' }}
              />
              <select
                name="ageUnit"
                value={formData.ageUnit}
                onChange={handleInputChange}
                required
                style={{ flex: '1' }}
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
            
            <select
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Size</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>

            <select
              name="energy_level"
              value={formData.energy_level}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Energy Level</option>
              <option value="low_energy">Low Energy</option>
              <option value="moderate_energy">Moderate Energy</option>
              <option value="high_energy">High Energy</option>
            </select>

            <select
              name="living_environment"
              value={formData.living_environment}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Living Environment</option>
              <option value="apartment_friendly">Apartment Friendly</option>
              <option value="house_with_yard">House with Yard</option>
            </select>
            
            <textarea
              name="bio"
              placeholder="Description"
              value={formData.bio}
              onChange={handleInputChange}
              required
            />
            
            <textarea
              name="medical_history"
              placeholder="Medical History"
              value={formData.medical_history}
              onChange={handleInputChange}
              required
            />
            
            <div className="photo-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={imageUploading}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-button">
                {imageUploading ? 'Uploading...' : 'Upload Pet Photo'}
              </label>
              {selectedImage && (
                <div className="image-preview">
                  <img src={selectedImage} alt="Pet preview" />
                </div>
              )}
              <input
                type="text"
                name="image1"
                placeholder="Image URL (will be set automatically after upload)"
                value={formData.image1}
                onChange={handleInputChange}
                readOnly
                style={{ marginTop: '0.5rem' }}
              />
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