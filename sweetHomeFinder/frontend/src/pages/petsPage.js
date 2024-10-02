import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import '../styles/petsPage.scss';
import { useUser, useAuth } from '@clerk/clerk-react';


function PetsPage() {
    let { isSignedIn, user, isLoaded } = useUser();

    if (!isLoaded) {
        return (
            <div className="pets-page">
                <div className='title'>
                <h2>Loading...</h2>
                </div>
            </div>
        );
    }

    if(isSignedIn) {
        console.log(isSignedIn);
        return (
            <div className="pets-page">
                <div className='title'>
                <h1>Browse Pets for {user.firstName}</h1>
                <img height="200px" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/01b961e0-4683-4bdd-8fa7-a1bb6d1c00a8/dfmhefv-5d3f1ef3-9769-4507-ba54-b79d7fd92ef1.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzAxYjk2MWUwLTQ2ODMtNGJkZC04ZmE3LWExYmI2ZDFjMDBhOFwvZGZtaGVmdi01ZDNmMWVmMy05NzY5LTQ1MDctYmE1NC1iNzlkN2ZkOTJlZjEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.z8dVOUufq3yzbdUAnN6Zt07BBh1n1KAIJagxBONwdzg" />
                </div>
            </div>
        );
    } else {
        return <Navigate to="/login" />;
    }
    
}

export default PetsPage;