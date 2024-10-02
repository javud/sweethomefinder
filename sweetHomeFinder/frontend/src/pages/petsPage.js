import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import '../styles/petsPage.scss';

function PetsPage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const { getToken } = useAuth();
    const [matchedPets, setMatchedPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (isLoaded && isSignedIn) {
        fetchMatchedPets();
      } else {
        setLoading(false);
      }
    }, [isLoaded, isSignedIn, user]);
  
    const fetchMatchedPets = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`http://localhost:5001/api/pets/matched?clerkUserId=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch matched pets');
        }
  
        const data = await response.json();
        setMatchedPets(data);
      } catch (err) {
        console.error('Error in fetchMatchedPets:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (!isLoaded || loading) {
      return <div className="pets-page">Loading...</div>;
    }
  
    
  
    if (error) {
      return <div className="pets-page">
        <h2>Error</h2>
        <p>{error}</p>
        <p>Please try refreshing the page or contact support if the problem persists.</p>
      </div>;
    }
  
    return (
      <div className="pets-page">
        <h1>Your Top 5 Matches</h1>
        {matchedPets.length === 0 ? (
          <p>No matching pets found. Try adjusting your preferences in the quiz.</p>
        ) : (
          <div className="pet-grid">
            {matchedPets.map((pet) => (
              <div key={pet.pet_id} className="pet-card">
                <h2>{pet.name}</h2>
                <p>Breed: {pet.breed}</p>
                <p>Age: {pet.age} years</p>
                <p>Size: {pet.size}</p>
                <p>Energy Level: {pet.energy_level}</p>
                <p>Living Environment: {pet.living_environment}</p>
                <p>Type: {pet.type}</p>
                <p>Match Score: {pet.match_score}%</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  export default PetsPage;