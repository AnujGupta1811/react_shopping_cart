import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from "sweetalert2";

function ProductItem({ product }) {
    const [loading, setLoading] = useState(false);
    const { id, email } = useParams();
    useEffect(() => {
        if (!id) {
            console.error('Product ID is missing:', {id});
            return;
        }
        console.log({id});

        const addToCart = async () => {
                console.log('Adding to cart...');
        
                const token = localStorage.getItem('token');
        
                if (!token) {
                    Swal.fire({
                        title: "Error",
                        text: "You need to be logged in to add items to your cart.",
                        icon: "error",
                    });
                    return;
                }
                    const response = await axios.post(
                    `https://anuj.freelogomaker.in/api/cart/${id}`,
                    { email, quantity: 1 },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`, 
                            'Content-Type': 'application/json',
                        },
                    }
                );
                console.log('Response:', response);    
                if (response.data.success) {
                    setLoading(true);
                    Swal.fire({
                        title: "Success",
                        text: response.data.message || "Item added to cart successfully!",
                        icon: "success",
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: response.data.message || "Something went wrong.",
                        icon: "error",
                    });
                }          
        };
        addToCart();
    }, [id,email]); 

    return (
        <div className="product-item">
            {loading ? (
                <Navigate to="/shop" />
            ) : (
                <Navigate to="/" />
            )}
        </div>
    );
}

export default ProductItem;
