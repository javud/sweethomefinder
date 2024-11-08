import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { MessageCircle, ListChecks, BarChart3, PawPrint, RotateCw, SendHorizonal, ArrowUpFromDot, ArrowDownToDot } from 'lucide-react';
import '../styles/adminPortal.scss';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from './supabaseClient';

function AdminPortal() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('applications');
  const [successMessage, setSuccessMessage] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showNewPetForm, setShowNewPetForm] = useState(true);
  const [existingPets, setExistingPets] = useState([]);
  const [editingPet, setEditingPet] = useState(null);
  const [listingStats, setListingStats] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({ monthlyStats: [], totalListings: 0 });
  const [sending, setSending] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [showingConversation, setShowingConversation] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    sex: '',
    ageUnit: 'years',
    size: '',
    energy_level: '',
    living_environment: '',
    bio: '',
    medical_history: '',
    is_available: '',
    image1: 'https://i.pinimg.com/originals/22/1c/20/221c2021c91d60b1eb13ea676460a92c.png'
  });

  const [applications, setApplications] = useState([]);

  const [messages, setMessages] = useState([]);

  const [replyContent, setReplyContent] = useState({}); // Track reply for each message

  // Update reply content based on message ID
  const handleReplyChange = (msgID, value) => {
      setReplyContent(prev => ({
          ...prev,
          [msgID]: value
      }));
  };

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

  useEffect(() => {
    if (isAdmin) {
      fetchExistingPets();
    }
  }, [isAdmin]);

  const toggleSending = (status) => {
      setSending(status);
  }

  const fetchApplications = async () => {
    setSending('Fetching...');
    try {
      const { data, error } = await supabase
        .from('AdoptionRequests')
        .select(`
          request_id,
          clerk_user_id,
          clerk_user_name,
          pet_id,
          pet_name,
          quiz_match_score,
          timestamp,
          status
        `)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Transform the data if needed, e.g., reformat dates or calculate percentages.
      const formattedData = data.map(request => ({
        id: request.request_id,
        applicantID: request.clerk_user_id,
        applicantName: request.clerk_user_name,
        petID: request.pet_id,
        petName: request.pet_name,
        quizScore: request.quiz_match_score,
        date: new Date(request.timestamp).toString(),
        status: request.status,
      }));

      setApplications(formattedData);
      setSending('');
    } catch (error) {
      console.error("Error fetching adoption requests:", error.message);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchMessages = async () => {
    setSending('Fetching...');
    try {
      const { data, error } = await supabase
        .from('Msg')
        .select(`
          msg_id,
          clerk_user_id,
          clerk_user_name,
          content,
          timestamp,
          from_user
        `)
        .order('timestamp', { ascending: false });
      if (error) throw error;
    
      data.forEach(item => item.time = new Date(item.timestamp).toLocaleString());

      setMessages(data);
      setSending('');
    } catch (error) {
      console.error("Error fetching messages", error.message);
    }
  };

  useEffect(() => {
      fetchMessages();
  }, []);

  function handleKeyDown(e, userID, userName, msgID) {
    if (e.key === 'Enter') {
      sendMessage(userID, userName, msgID);
    }
  };

  const sendMessage = async (userID, userName, msgID) => {
    setSending('Sending...');
    const msgContent = replyContent[msgID];

    if (!user || !msgContent) return;
    try {
        const { data, error } = await supabase
            .from('Msg')
            .insert([
                {
                    clerk_user_id: userID,
                    clerk_user_name: userName,
                    content: msgContent,
                    timestamp: new Date(),
                    from_user: 0,
                },
            ]);
            fetchMessages();
        if (error) {
            console.error('Error inserting data:', error);
            alert('Failed to send message. Please try again.');
        } else {
            console.log('Message sent successfully:', data);
            setReplyContent(prev => ({ ...prev, [msgID]: '' })); // Clear input
            setSending('');
        }
    } catch (error) {
        console.error('Unexpected error:', error);
    } 
  };

  useEffect(() => {
    const fetchListingStats = async () => {
      if (activeSection === 'analytics') {
        try {
          const response = await fetch('http://localhost:5001/api/pets/all');
          const pets = await response.json();
          
          const monthlyStats = {};
          pets.forEach(pet => {
            const month = new Date().toLocaleString('default', { month: 'long' });
            monthlyStats[month] = (monthlyStats[month] || 0) + 1;
          });
  
          const statsArray = Object.entries(monthlyStats).map(([month, count]) => ({
            month,
            listings: count
          }));
  
          setAnalyticsData({
            monthlyStats: statsArray,
            totalListings: pets.length
          });
  
        } catch (error) {
          console.error('Error fetching listing stats:', error);
        }
      }
    };
  
    fetchListingStats();
  }, [activeSection]);

  const fetchExistingPets = async () => {
    try {
      setSending('Fetching...');
      const response = await fetch('http://localhost:5001/api/pets/admin');
      if (response.ok) {
        const data = await response.json();
        setExistingPets(data);
      }
      setSending('');
    } catch (error) {
      console.error('Error fetching existing pets:', error);
    }
  };

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
        if (editingPet) {
          setEditingPet(prev => ({
            ...prev,
            image1: data.url
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            image1: data.url
          }));
        }
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
    if (editingPet) {
      setEditingPet(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleDeletePet = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/pets/${petId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccessMessage('Pet deleted successfully!');
        fetchExistingPets();
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        throw new Error('Failed to delete pet');
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      setSuccessMessage('Error: Failed to delete pet');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submissionData = {
        ...formData,
        age: `${formData.age} ${formData.ageUnit}`,
      };

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
        setFormData({
          name: '',
          type: '',
          breed: '',
          age: '',
          sex: '',
          ageUnit: 'years',
          size: '',
          energy_level: '',
          living_environment: '',
          bio: '',
          medical_history: '',
          image1: 'https://i.pinimg.com/originals/22/1c/20/221c2021c91d60b1eb13ea676460a92c.png'
        });
        setSelectedImage(null);
        fetchExistingPets();

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

  const handleUpdatePet = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        ...editingPet,
        age: `${editingPet.age} ${editingPet.ageUnit}`,
      };
      delete updateData.ageUnit;

      const response = await fetch(`http://localhost:5001/api/pets/${editingPet.pet_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        setSuccessMessage('Pet updated successfully!');
        setEditingPet(null);
        fetchExistingPets();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Failed to update pet');
      }
    } catch (error) {
      console.error('Error updating pet:', error);
      setSuccessMessage('Error: Failed to update pet');
    }
  };

  const handleEditPet = (pet) => {
    const ageInfo = pet.age.split(' ');
    setEditingPet({
      ...pet,
      age: ageInfo[0],
      ageUnit: ageInfo[1]
    });
    setShowNewPetForm(false);
  };

  const handleRequestAction = async (requestId, userID, userName, petID, petName, newStatus) => {
    try {
      const { data, error } = await supabase
        .from('AdoptionRequests')
        .update( { status: newStatus })
        .eq('request_id', requestId);  
  
      if (error) throw error;
      if(newStatus === 'Accepted') {
        const { data: petData, error: petError } = await supabase
          .from('Pets')
          .update({ is_available: "FALSE" })
          .match({ pet_id: petID }); 

          const { data, error } = await supabase
            .from('Msg')
            .insert([
                {
                    clerk_user_id: userID,
                    clerk_user_name: userName,
                    content: `Good news! Your application for ${petName} was accepted!`,
                    timestamp: new Date(),
                    from_user: 0,
                },
          ]);

        if (petError) throw petError;
      }
      else if(newStatus == 'Declined') {
        const { data, error } = await supabase
            .from('Msg')
            .insert([
                {
                    clerk_user_id: userID,
                    clerk_user_name: userName,
                    content: `Sad news. Unfortunately your application for ${petName} was declined.`,
                    timestamp: new Date(),
                    from_user: 0,
                },
          ]);
        if (error) throw error;
      }
      setSuccessMessage('Successful');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error with request:', error);
      setSuccessMessage('Error: Failed to process request');
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
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>
      <div className="applications-list">
        <div className="statusDiv">
            <button className="refreshBtn" onClick={() => fetchApplications()}>
            <RotateCw size={20} />
            Refresh Requests
            </button>
            <p>{sending}</p>
        </div>
        {applications.length > 0 ? (
          applications.map(app => (
            <div key={app.id} className="application-card">
              <div className="application-header">
                <h3>{app.applicantName}'s Adoption Request for {app.petName}</h3>
                <span className={`status ${app.status.toLowerCase()}`}>{app.status}</span>
              </div>
              <div className="application-details">
                <p><strong>User ID:</strong> {app.applicantID}</p>
                <p><strong>Timestamp:</strong> {app.date}</p>
                <p><strong>Pet ID:</strong> {app.petID}</p>
                <p><strong>Pet Quiz Match:</strong> {app.quizScore}%</p>
              </div>
              {app.status === "Pending" && (
                <div className="application-actions">
                  <button className="approve-btn" onClick={() => {
                    if (window.confirm('Are you sure you want to accept this request?')) {
                      app.status = "Accepted";
                      handleRequestAction(app.id, app.applicantID, app.applicantName, app.petID, app.petName, app.status);
                    }
                  }}>Accept</button>
                  <button className="reject-btn" onClick={() => {
                    if (window.confirm('Are you sure you want to decline this request?')) {
                      app.status = "Declined";
                      handleRequestAction(app.id, app.applicantID, app.applicantName, app.petID, app.petName, app.status);
                    }
                  }}>Decline</button>
                </div>
              )}
            </div>
          )) ) : (<p>There are no current pet adoption requests.</p>)
        }
      </div>
    </div>
  );

  const renderPetForm = (data, submitHandler) => (
    <form className="pet-form" onSubmit={submitHandler}>
      <input
        type="text"
        name="name"
        placeholder="Pet Name"
        value={data.name}
        onChange={handleInputChange}
        required
      />
      
      <select
        name="type"
        value={data.type}
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
        value={data.breed}
        onChange={handleInputChange}
        required
      />
      
      <div className="age-input-group">
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={data.age}
          onChange={handleInputChange}
          required
          style={{ flex: '1' }}
        />
        <select
          name="ageUnit"
          value={data.ageUnit}
          onChange={handleInputChange}
          required
          style={{ flex: '1' }}
        >
          <option value="years">Years</option>
          <option value="months">Months</option>
        </select>
      </div>
      
      <select
        name="sex"
        value={data.sex}
        onChange={handleInputChange}
        required
      >
        <option value="">Select Sex</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <select
        name="size"
        value={data.size}
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
        value={data.energy_level}
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
        value={data.living_environment}
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
        value={data.bio}
        onChange={handleInputChange}
      />
      
      <textarea
        name="medical_history"
        placeholder="Medical History"
        value={data.medical_history}
        onChange={handleInputChange}
      />

      <select
        name="is_available"
        value={data.is_available}
        onChange={handleInputChange}
        defaultValue={true}
        required
      >
        <option value="">Select Pet Availability</option>
        <option value="true">Available</option>
        <option value="false">Not Available</option>
      </select>
      
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
          value={data.image1}
          onChange={handleInputChange}
          readOnly
          style={{ marginTop: '0.5rem' }}
        />
      </div>
      
      <button type="submit" className="submit-btn">
        {editingPet ? 'Update Pet' : 'List Pet'}
      </button>
      {editingPet && (
        <button 
          type="button" 
          className="cancel-btn" 
          onClick={() => {
            setEditingPet(null);
            setShowNewPetForm(true);
          }}
        >
          Cancel Edit
        </button>
      )}
    </form>
  );

  const renderPetManagement = () => (
    <div className="content-section">
      <div className="section-header">
        <h2>Pet Management</h2>
        <div className="management-buttons">
          <button 
            className={`add-pet-btn ${showNewPetForm ? 'active' : ''}`}
            onClick={() => {
              setShowNewPetForm(true);
              setEditingPet(null);
            }}
          >
            Add New
          </button>
          <button 
            className={`edit-pets-btn ${!showNewPetForm ? 'active' : ''}`}
            onClick={() => {
              setShowNewPetForm(false);
              setEditingPet(null);
            }}
          >
            Edit Existing
          </button>
        </div>
      </div>
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      <div className="pet-management-tools">
        {showNewPetForm ? (
          <div className="tool-section">
            <h3>List New Pet</h3>
            {renderPetForm(formData, handleSubmit)}
          </div>
        ) : (
          <div className="existing-pets-section">
            <div className="statusDiv">
                <button className="refreshBtn" onClick={() => fetchExistingPets()}>
                <RotateCw size={20} />
                Refresh Pet Listings
                </button>
                <p>{sending}</p>
            </div>
            <h3>Edit Existing Pets</h3>
            {editingPet ? (
              <div className="edit-form-container">
                <h4>Editing: {editingPet.name}</h4>
                {renderPetForm(editingPet, handleUpdatePet)}
              </div>
            ) : (
              <div className="pets-grid">
                {existingPets.map(pet => (
                  <div key={pet.pet_id} className="pet-edit-card">
                    <img 
                      src={pet.image1 || 'https://i.pinimg.com/originals/22/1c/20/221c2021c91d60b1eb13ea676460a92c.png'} 
                      alt={pet.name}
                    />
                    <div className="pet-info">
                      <h4>{pet.name}</h4>
                      <p>ID: {pet.pet_id}</p>
                      <p>{pet.breed} | {pet.sex}</p>
                      <p>{pet.age} old</p>
                      {pet.is_available ? (
                        <p className="available">Available</p>
                      ) : (
                        <p className="unavailable">Unavailable</p>
                      )}
                      <div className="pet-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditPet(pet)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this pet?')) {
                              fetch(`http://localhost:5001/api/pets/${pet.pet_id}`, {
                                method: 'DELETE',
                              })
                              .then(response => {
                                if (response.ok) {
                                  setSuccessMessage('Pet deleted successfully!');
                                  fetchExistingPets();
                                  setTimeout(() => {
                                    setSuccessMessage('');
                                  }, 3000);
                                } else {
                                  throw new Error('Failed to delete pet');
                                }
                              })
                              .catch(error => {
                                console.error('Error deleting pet:', error);
                                setSuccessMessage('Error: Failed to delete pet');
                              });
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="content-section">
      <h2>Analytics Dashboard</h2>
      <div className="analytics-summary">
        <div className="analytics-card summary-card">
          <div className="stat-value">{analyticsData.totalListings}</div>
          <div className="stat-label">Total Pet Listings</div>
        </div>
      </div>
      <div className="analytics-card">
        <h3>Monthly Pet Listings</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={analyticsData.monthlyStats}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="listings"
                stroke="#5c13df"
                activeDot={{ r: 8 }}
                name="New Listings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderMessages = () => {
  
    const fetchLatestMessages = async () => {
      setSending('Fetching...');
      try {
        const { data, error } = await supabase
          .from('Msg')
          .select('*')
          .order('timestamp', { ascending: false });
        
        if (error) throw error;
    
        // Create a map to store the latest message for each unique user
        const userMessages = new Map();
        
        data.forEach(message => {
          // Only store the first (latest) message for each user
          if (!userMessages.has(message.clerk_user_name)) {
            message.time = new Date(message.timestamp).toLocaleString();
            userMessages.set(message.clerk_user_name, message);
          }
        });
    
        // Convert map values to array
        const latestMessages = Array.from(userMessages.values());
        setMessages(latestMessages);
        setSending('');
      } catch (error) {
        console.error("Error fetching messages", error);
        setSending('');
      }
    };
    
    const sendMessage = async (userID, userName, msgID) => {
      setSending('Sending...');
      const msgContent = replyContent[selectedConversation];
    
      if (!user || !msgContent) return;
      
      try {
        const { data, error } = await supabase
          .from('Msg')
          .insert([
            {
              clerk_user_id: userID,
              clerk_user_name: userName,
              content: msgContent,
              timestamp: new Date(),
              from_user: 0,
            },
          ]);
    
        if (error) {
          throw error;
        }
    
        // Clear the input field
        setReplyContent(prev => ({ ...prev, [selectedConversation]: '' }));
        
        // Refresh the conversation to show the new message
        await fetchConversation(userID);
        
        setSending('');
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
        setSending('');
      }
    };
  
    const fetchConversation = async (userId) => {
      setSending('Fetching conversation...');
      try {
        const { data, error } = await supabase
          .from('Msg')
          .select('*')
          .eq('clerk_user_id', userId)
          .order('timestamp', { ascending: true });
  
        if (error) throw error;
        data.forEach(item => item.time = new Date(item.timestamp).toLocaleString());
        setConversationMessages(data);
        setSelectedConversation(userId);
        setShowingConversation(true);
        setSending('');
      } catch (error) {
        console.error("Error fetching conversation", error);
        setSending('');
      }
    };
  
    return (
      <div className="content-section">
        <div className="section-header">
          <h2>Messages</h2>
          {showingConversation && (
            <button 
              className="back-button" 
              onClick={() => {
                setShowingConversation(false);
                setSelectedConversation(null);
              }}
            >
              Back to All Messages
            </button>
          )}
        </div>
        <div className="applications-list">
          <div className="statusDiv">
            <button className="refreshBtn" onClick={() => showingConversation ? fetchConversation(selectedConversation) : fetchLatestMessages()}>
              <RotateCw size={20} />
              Refresh Messages
            </button>
            <p>{sending}</p>
          </div>
  
          {!showingConversation ? (
            // Latest messages view
            messages.length > 0 ? (
              messages.map(msg => (
                <div key={msg.msg_id} className="application-card clickable" onClick={() => fetchConversation(msg.clerk_user_id)}>
                  <div className="application-header">
                    <h3>{msg.clerk_user_name}</h3>
                    <p>{msg.time}</p>
                  </div>
                  <div className="application-details">
                    <p className="latest-message">
                      {msg.from_user ? 'User: ' : 'Admin: '}
                      {msg.content}
                    </p>
                    <button className="view-conversation">View Conversation</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No messages to display.</p>
            )
          ) : (
            // Full conversation view
            <>
              <div className="conversation-container">
                {conversationMessages.map(msg => (
                  <div key={msg.msg_id} className="message-bubble">
                    <div className={`message ${msg.from_user ? 'user' : 'admin'}`}>
                      <div className="message-header">
                        <span>{msg.from_user ? msg.clerk_user_name : 'Admin'}</span>
                        <span className="timestamp">{msg.time}</span>
                      </div>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="reply-container">
                <input
                  type="text"
                  className="reply-input"
                  placeholder="Type your reply..."
                  value={replyContent[selectedConversation] || ''}
                  onChange={(e) => handleReplyChange(selectedConversation, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(
                        selectedConversation,
                        conversationMessages[0]?.clerk_user_name,
                        conversationMessages[0]?.msg_id
                      );
                    }  
                  }}
                />
                <button 
                  className="send-button"
                  onClick={() => {
                    if (replyContent[selectedConversation]?.trim()) {
                      sendMessage(
                        selectedConversation,conversationMessages[0]?.clerk_user_name,conversationMessages[0]?.msg_id
                      );
                    }
                  }}  
                >
                  <SendHorizonal />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

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
            onClick={() => {setActiveSection('applications'); fetchApplications();}}
          >
            <ListChecks size={20} />
            Applications
          </button>
          <button 
            className={`nav-item ${activeSection === 'pets' ? 'active' : ''}`}
            onClick={() => {setActiveSection('pets'); fetchExistingPets();}}
          >
            <PawPrint size={20} />
            Pet Management
          </button>
          <button 
            className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`}
            onClick={() => {setActiveSection('messages'); fetchMessages();}}
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
        {activeSection === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
}

export default AdminPortal;