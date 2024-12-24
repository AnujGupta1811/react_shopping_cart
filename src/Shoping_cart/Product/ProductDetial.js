import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import Swal from "sweetalert2";

const ProductDetail = () => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    console.log("sjlkd",id)
    useEffect(() => {
        const fetchProductDetails = async () => {
            const token = localStorage.getItem('token');
            const url = `http://localhost:8000/api/product/${id}`;

            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }

                const data = await response.json();
                console.log(data); // Log the response data
                setProduct(data.product); // Set the product in state
            } catch (error) {
                console.error("Error fetching product:", error);
                Swal.fire({
                    title: "Error",
                    text: "Failed to load product details.",
                    icon: "error",
                });
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleIncrease = () => {
        if (quantity < product?.pstock) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <div className="container-fluid py-5">
            <div className="row px-xl-5">
                {/* Product Image Section */}
                <div className="col-lg-5 pb-5">
                    <div id="product-carousel" className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner border">
                            <div className="carousel-item active">
                                <img
                                    className="img-fluid w-100"
                                    src={`/${product?.pimage}`}
                                    alt={product?.pname}
                                    style={{ width: '100%', height: '300px', objectFit: 'fill' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Section */}
                <div className="col-lg-7 pb-5">
                    <h3 className="font-weight-semi-bold">{product?.pname}</h3>

                    {/* Product Reviews */}
                    <div className="d-flex mb-3">
                        <small className="pt-1">({product?.reviews_count} Reviews)</small>
                    </div>

                    {/* Product Description */}
                    <p className="mb-4">{product?.pdescription}</p>

                    {/* Product Sizes (If available) */}
                    <div className="d-flex mb-3">
                        <p className="text-dark font-weight-medium mb-0 mr-3">Sizes:</p>
                        {/* Map through available sizes if data contains size options */}
                    </div>

                    {/* Product Stock */}
                    <div className="d-flex mb-4">
                        <p className="text-dark font-weight-medium mb-0 mr-3">Stock: {product?.pstock}</p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="d-flex align-items-center mb-4 pt-2">
                        <div className="input-group quantity mr-3" style={{ width: '130px' }}>
                            <div className="input-group-btn">
                                <button className="btn btn-primary btn-minus" onClick={handleDecrease}>
                                    <i className="fa fa-minus"></i>
                                </button>
                            </div>
                            <input
                                type="text"
                                id="quantity"
                                className="form-control bg-secondary text-center"
                                value={quantity}
                                readOnly
                            />
                            <div className="input-group-btn">
                                <button className="btn btn-primary btn-plus" onClick={handleIncrease}>
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <form action={`/cart/${product?.id}`} method="POST" className="mr-2">
                            <Link key={product?.id} to={`/cart/${product?.id}`} className="btn btn-sm text-dark p-0">
                                <i className="fas fa-shopping-cart text-primary mr-1"></i>Add To Cart
                            </Link>
                        </form>

                        {/* Buy Now Button */}
                        <form action="/product/buy" method="POST" className="ml-2">
                            <input type="hidden" name="product_id" value={product?.id} />
                            <input type="hidden" name="quantity" value={quantity} />
                            <button type="submit" className="btn btn-primary px-3">
                                <i className="fas fa-credit-card mr-1"></i> Buy Now
                            </button>
                        </form>
                    </div>

                    {/* Social Media Share Links */}
                    <div className="d-flex pt-2">
                        <p className="text-dark font-weight-medium mb-0 mr-2">Share on:</p>
                        <div className="d-inline-flex">
                            <a className="text-dark px-2" href="#">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a className="text-dark px-2" href="#">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a className="text-dark px-2" href="#">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a className="text-dark px-2" href="#">
                                <i className="fab fa-pinterest"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ProductDetail;