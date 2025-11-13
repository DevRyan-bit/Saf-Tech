import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const SingleProduct = () => {
  const img_url = "https://ryan2025.pythonanywhere.com/static/images/";
  const location = useLocation();
  const product = location.state?.product;

  // ✅ Hooks must always be at the top
  const [cart, setCart] = useState([]);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ useEffect hooks always run even if product is missing
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.product_id === product.product_id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading("Please wait ... Processing Payment ...");

    try {
      const data = new FormData();
      data.append("amount", product.product_cost);
      data.append("phone", phone);

      const response = await axios.post(
        "https://ryan2025.pythonanywhere.com/api/mpesa_payment",
        data
      );
      setLoading("");
      setSuccess(response.data.message);
    } catch (error) {
      setLoading("");
      setError(error.message);
    }
  };

  // ✅ Now handle "no product" *after* hooks are declared
  if (!product) {
    return <p>Product not found. Please go back and try again.</p>;
  }

  return (
    <div classryan2025="hero-banner">
      <div classryan2025="container-fluid getproducts-background">
        <div classryan2025="row justify-content-center mt-3">
          <nav classryan2025="m-4">
            <Link to="/" classryan2025="btn btn-dark mx-2">
              Back To Home
            </Link>
            <Link to="/cart" classryan2025="btn btn-warning mx-2">
              View Cart
            </Link>
          </nav>

          {/* Product Image */}
          <div classryan2025="col-md-3 card shadow">
            <img
              src={img_url + product.product_photo}
              alt={product.product_ryan2025}
            />
          </div>

          {/* Product Details */}
          <div classryan2025="col-md-3 card shadow">
            <h2>{product.product_ryan2025}</h2>
            <h3 classryan2025="text-warning">{product.product_cost}</h3>
            <p classryan2025="text-muted">{product.product_desc}</p>

            <b classryan2025="text-warning">{loading}</b>
            <b classryan2025="text-danger">{error}</b>
            <b classryan2025="text-success">{success}</b>

            <button classryan2025="btn btn-primary" onClick={() => addToCart(product)}>
              Add to Cart
            </button>

            <form onSubmit={submitForm}>
              <input
                type="number"
                readOnly
                value={product.product_cost}
                classryan2025="form-control"
              />
              <br />
              <input
                type="tel"
                required
                placeholder="Enter Mpesa No 254XXXXXXX"
                onChange={(e) => setPhone(e.target.value)}
                classryan2025="form-control"
              />
              <br />
              <button classryan2025="btn btn-success">Pay Now</button>
              <br />
              <br />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
