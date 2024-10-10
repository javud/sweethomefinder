import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import '../styles/petsPage.scss';

function PetsPage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const { getToken } = useAuth();
    const [matchedPets, setMatchedPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const blankImg = 'https://i.pinimg.com/originals/22/1c/20/221c2021c91d60b1eb13ea676460a92c.png';
  
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
  
    function getMatchClass(match_score) {
      if(match_score >= 80) {
        return "great";
      }
      if(match_score >= 60) {
        return "good";
      }
      if(match_score >= 40) {
        return "poor";
      }
      if(match_score <= 40) {
        return "bad";
      }
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
        <h1 className="title">🏅Your Top 5 Matches🏅</h1>
        <h2 className="allPets">View all pets</h2>
        {matchedPets.length === 0 ? (
          <p>No matching pets found. Try adjusting your preferences in the quiz.</p>
        ) : (
          <div className="pet-grid">
            {matchedPets.map((pet) => (
              <div key={pet.pet_id} className="pet-card">
                <div className="pet-img">
                  <img src={pet.image1 && pet.image1.length > 0 ? pet.image1 : blankImg}/>
                  <h2 className="pet-name">{pet.name}</h2>
                </div>
                <div className = "pet-desc">
                  <p>{pet.breed}</p>
                  <p>{pet.age} {pet.type}</p>
                  <p>{pet.size}</p>
                  <p>{pet.energy_level.replaceAll("_"," ")}</p>
                  <span className={getMatchClass(pet.match_score)}><p>{pet.match_score}% match</p></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  export default PetsPage;