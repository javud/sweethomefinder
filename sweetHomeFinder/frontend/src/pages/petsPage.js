import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import '../styles/petsPage.scss';

function PetsPage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const { getToken } = useAuth();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewingAllPets, setViewingAllPets] = useState(false);
    const blankImg = 'https://i.pinimg.com/originals/22/1c/20/221c2021c91d60b1eb13ea676460a92c.png';
    const [filters, setFilters] = useState({
        size: [],
        type: [],
        energy_level: [],
        age: []
    });
    const [selectedPet, setSelectedPet] = useState(null); // New state for selected pet
  
    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchPets();
        } else {
            setLoading(false);
        }
    }, [isLoaded, isSignedIn, user, viewingAllPets]);
  
    const fetchPets = async () => {
        try {
            const token = await getToken();
            const endpoint = viewingAllPets ? 'all' : `matched?clerkUserId=${user.id}`;
            const response = await fetch(`http://localhost:5001/api/pets/${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
  
            if (!response.ok) {
                throw new Error(`Failed to fetch ${viewingAllPets ? 'all' : 'matched'} pets`);
            }
  
            const data = await response.json();
            setPets(data);
        } catch (err) {
            console.error(`Error in fetch${viewingAllPets ? 'All' : 'Matched'}Pets:`, err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
  
    const toggleViewAllPets = () => {
        setViewingAllPets(!viewingAllPets);
    };

    const handleFilterChange = (category, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [category]: prevFilters[category].includes(value)
                ? prevFilters[category].filter(item => item !== value)
                : [...prevFilters[category], value]
        }));
    };

    const filterPets = (pet) => {
        if (!viewingAllPets) return true;
        return Object.entries(filters).every(([category, selectedValues]) => {
            if (selectedValues.length === 0) return true;
            if (category === 'age') {
                const petAge = parseInt(pet.age);
                return selectedValues.some(range => {
                    const [min, max] = range.split('-').map(Number);
                    return petAge >= min && petAge <= max;
                });
            }
            return selectedValues.includes(pet[category]);
        });
    };

    const openPetDialog = (pet) => {
        setSelectedPet(pet);
        console.log("Selected pet: " + pet.name);
    };

    const closePetDialog = () => {
        setSelectedPet(null);
    };

    if (!isLoaded || loading) {
        return <div className="pets-page">Loading...</div>;
    }
  
    function getMatchClass(match_score) {
        if(match_score >= 80) return "great";
        if(match_score >= 60) return "good";
        if(match_score >= 40) return "poor";
        return "bad";
    }
    
    if (error) {
        return <div className="pets-page">
            <h2>Error</h2>
            <p>{error}</p>
            <p>Please try refreshing the page or contact support if the problem persists.</p>
        </div>;
    }

    const filterOptions = {
        size: ['small', 'medium', 'large'],
        type: ['dog', 'cat', 'other'],
        energy_level: ['low_energy', 'moderate_energy', 'high_energy'],
        age: ['0-2', '3-7', '8+']
    };
  
    return (
        <div className="pets-page">
            <h1 className="title">{viewingAllPets ? 'All Available Pets' : '🏅Your Top 5 Matches🏅'}</h1>
            <h2 className="allPets" onClick={toggleViewAllPets}>
                {viewingAllPets ? 'View your matches' : 'View all pets'}
            </h2>
            <div className="pets-container">
                <div className="pets-list">
                    {pets.filter(filterPets).length === 0 ? (
                        <p>No {viewingAllPets ? '' : 'matching'} pets found. {!viewingAllPets && 'Try adjusting your preferences in the quiz.'}</p>
                    ) : (
                        <div className="pet-grid">
                            {pets.filter(filterPets).map((pet) => (
                                <div key={pet.pet_id} className="pet-card" onClick={() => openPetDialog(pet)}>
                                    <div className="pet-img">
                                        <img src={pet.image1 && pet.image1.length > 0 ? pet.image1 : blankImg} alt={pet.name}/>
                                        <h2 className="pet-name">{pet.name}</h2>
                                    </div>
                                    <div className="pet-desc">
                                        <p>{pet.breed}</p>
                                        <p>{pet.age} old</p>
                                        <p>{pet.size}</p>
                                        <p>{pet.energy_level.replaceAll("_"," ")}</p>
                                        {!viewingAllPets && (
                                            <span className={getMatchClass(pet.match_score)}>
                                                <p>{pet.match_score}% match</p>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {viewingAllPets && (
                    <div className="filters-container">
                        <div className="peeking-pets"></div>
                        <div className="filters">
                            <h3>Filters</h3>
                            {Object.entries(filterOptions).map(([category, options]) => (
                                <div key={category} className="filter-category">
                                    <h4>{category.replace('_', ' ')}</h4>
                                    {options.map(option => (
                                        <label key={option}>
                                            <input
                                                type="checkbox"
                                                checked={filters[category].includes(option)}
                                                onChange={() => handleFilterChange(category, option)}
                                            />
                                            {option.replace('_', ' ')}
                                        </label>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {selectedPet && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closePetDialog}>&times;</span>
                        <div className="nameAndBreed">
                            <h2>{selectedPet.name}</h2>
                            <p>{selectedPet.breed} {selectedPet.type} | {selectedPet.sex} </p>
                        </div>
                        <div className="info">
                            <div className="category">
                                <h3>Age</h3>
                                <p>{selectedPet.age}</p>
                            </div>
                            <div className="category">
                                <h3>Size</h3>
                                <p>{selectedPet.size}</p>
                            </div>
                            <div className="category">
                                <h3>Energy</h3>
                                <p>{selectedPet.energy_level.substring(0, selectedPet.energy_level.indexOf("_"))}</p>
                            </div>
                        </div>
                        <div className="section">
                            <h3>Bio</h3>
                            {selectedPet.bio ? (
                                <p>{selectedPet.bio}</p>
                                ) : (
                                    <p>No bio available.</p>
                                )
                            }
                        </div>
                            <div className="section">
                                <h3>Medical History</h3>
                            {selectedPet.medical_history ? (
                                <p>{selectedPet.medical_history}</p>
                                ) : (
                                    <p>No medical history available.</p>
                                )
                            }
                            </div>
                        <img src={selectedPet.image1 && selectedPet.image1.length > 0 ? selectedPet.image1 : blankImg} alt={selectedPet.name} />
                        <div className="inquiryBtn">Request to Adopt</div>
                    </div>
                </div>
            )}
        </div>
    );
}
  
export default PetsPage;