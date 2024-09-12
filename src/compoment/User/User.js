import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
export default function User(){
    const id_user = sessionStorage.getItem('user_id');


    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [cake, setCake] = useState([]);
    const [counts, setCounts] = useState({});
    const [typeIdCake, setTypeIdCake] = useState('');
    const [image, setImage] = useState([]);
    const [name, setName] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [editItemId, setEditItemId] = useState(null);
    const [newQuantity, setNewQuantity] = useState(1);
    const [order,setOrder] =useState([])
    const param = useParams();
    const [cartCakeIds, setCartCakeIds] = useState([]); // Track cake IDs in the cart
  
    async function getOrder(){
     const rep= await axios.post(`http://localhost:8080/api/cart/checkout/${id_user}`)
     setOrder(rep.data)
    }
  

  
    useEffect(() => {
      async function fetchCart() {
        try {
          const response = await axios.get(`http://localhost:8080/api/cart/${id_user}`);
          const cartItems = response.data;
          const uniqueItemsCount = cartItems.length; // Count the number of unique cake items
          setTotalQuantity(uniqueItemsCount);
          setCartCakeIds(cartItems.map(item => item.id_cake)); // Store the cake IDs in the cart
        } catch (error) {
          console.error('Error fetching cart data:', error);
        }
      }
  
      if (id_user) {
        fetchCart();
      }
    }, [id_user]);
  
  
    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };
  
    function formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    async function getDelete(id) {
      if (window.confirm("Are you sure you want to delete this item?")) {
        try {
          await axios.delete(`http://localhost:8080/api/cart/${id}`);
          window.location.reload();
        } catch (error) {
          console.error("Error deleting item:", error);
        }
      }
    }
  
    async function getOrder() {
      const rep= await axios.post(`http://localhost:8080/api/cart/checkout/${id_user}`)
      
    }
  
    const [cart, setCart] = useState([]);
    async function getList() {
      try {
        const rep = await axios.get(`http://localhost:8080/api/order/${id_user}`);
        setCart(rep.data);
        const initialCounts = rep.data.reduce((acc, item) => {
          const key = item.cake.id;
          if (!acc[key]) {
            acc[key] = item.quantity || 1;
          } else {
            acc[key] += item.quantity || 1;
          }
          return acc;
        }, {});
        setCounts(initialCounts);
        updateTotalPrice(rep.data, initialCounts);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    }
  
    useEffect(() => {
      if (id_user) {
        getList();
      } else {
        console.error('User ID is missing');
      }
    }, [id_user]);
  
    const updateTotalPrice = (cartItems, itemCounts) => {
      const total = cartItems.reduce((acc, item) => {
        const quantity = itemCounts[item.cake.id] || 1;
        return acc + (item.cake.price * quantity);
      }, 0);
      setTotalPrice(total);
    };
  
    const groupedCart = cart.reduce((acc, item) => {
      const key = item.cake.id;
      if (!acc[key]) {
        acc[key] = {
          ...item,
          quantity: counts[key] || 1
        };
      }
      return acc;
    }, {});
  
    const groupedCartArray = Object.values(groupedCart);
  

 
  
    
    return(
        <>
         <table className="cart-table">
              <thead>
                <tr className="row-with-border">
                  <th className="table-none col-3"></th>
                  <th className="table-none col-3"><h4>Thông tin chi tiết</h4></th>
                  <th className="table-none col-2"><h4>Đơn giá</h4></th>
                  <th className="table-none col-2"><h4>Số lượng</h4></th>
                  <th className="table-none col-2"><h4>Tổng giá</h4></th>
                </tr>
              </thead>
              <tbody>
                {groupedCartArray.map(item => (
                  <tr key={item.cake.id} className="row-with-border">
                    <td className="table-none1">
                      <img src={process.env.PUBLIC_URL + '/img/' + (item.cake.image[0]?.name || '')} alt={item.cake.description} />
                    </td>
                    <td className="table-none">
                      <p>{item.cake.description}</p>
                    </td>
                    <td className="table-none"><p>{formatPrice(item.cake.price)} VNĐ</p></td>
                    <td className="table-none">
                      <div className="table-none-accout">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span className="cart_span" style={{ width: '50px', textAlign: 'center' }}>{counts[item.cake.id] || 1}</span>
                          <input
                            type="hidden"
                            id="quantity"
                            name="quantity"
                            value={counts[item.cake.id] || 1}
                          />
                          <input
                            type="hidden"
                            id="id_user"
                            name="id_user"
                            value={id_user}
                          />
                          <input
                            type="hidden"
                            id="id_cake"
                            name="id_cake"
                            value={item.cake.id}
                          />
                          <input
                            type="hidden"
                            id="id_cart"
                            name="id_cart"
                            value={item.id}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="table-none"><p>{formatPrice((counts[item.cake.id] || 1) * item.cake.price)} VNĐ</p></td>
                  </tr>
                ))}
              </tbody>
            </table>
        </>
    )
}