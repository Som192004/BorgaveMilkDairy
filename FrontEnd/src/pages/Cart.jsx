// import React, { useContext } from "react";
// import { CartContext } from "../context/CartContext";
// import { useNavigate } from "react-router-dom";
// import { ShoppingCart } from "lucide-react";

// export const Cart = () => {
//   const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } =
//     useContext(CartContext);
//   const navigate = useNavigate();

//   const handleEnquireClick = () => {
//     navigate("/contact-us");
//   };

//   return (
//     <div className="p-6 md:p-8 bg-white rounded-lg shadow-md max-w-3xl mx-auto my-12">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
//         <ShoppingCart className="h-8 w-8 mr-2 text-blue-500" />
//         Cart
//       </h2>
//       {cartItems.length === 0 ? (
//         <p className="text-gray-600 text-lg text-center py-6">
//           Your cart is currently empty.
//         </p>
//       ) : (
//         <div className="space-y-6">
//           <ul className="divide-y divide-gray-300">
//             {cartItems.map((item) => (
//               <li
//                 key={`${item.id}-${item.selectedQuantity}`}
//                 className="flex items-center justify-between py-4"
//               >
//                 <div className="flex items-center space-x-4">
//                   <img
//                     src={item.imageUrl}
//                     alt={item.name}
//                     className="w-20 h-20 object-cover rounded-lg shadow-sm"
//                   />
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800">
//                       {item.name}
//                     </h3>
//                     <p className="text-gray-600 mt-1">Price: ${item.price}</p>

//                     {/* Display Selected Quantity */}
//                     <p className="text-gray-700 mt-1">
//                       <strong>Selected Quantity:</strong>{" "}
//                       {item.selectedQuantity}
//                     </p>

//                     {/* Quantity Controls */}
//                     <div className="flex items-center space-x-3 mt-2">
//                       <button
//                         onClick={() =>
//                           decreaseQuantity(item.id, item.selectedQuantity)
//                         }
//                         className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-lg"
//                       >
//                         -
//                       </button>
//                       <span className="text-lg font-medium">
//                         {item.quantity}
//                       </span>
//                       <button
//                         onClick={() =>
//                           increaseQuantity(item.id, item.selectedQuantity)
//                         }
//                         className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-lg"
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => removeFromCart(item.id, item.selectedQuantity)}
//                   className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300"
//                 >
//                   Remove
//                 </button>
//               </li>
//             ))}
//           </ul>
//           <div className="text-center">
//             <button
//               onClick={handleEnquireClick}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md"
//             >
//               Proceed to Enquiry
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;


import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export const Cart = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);
  const navigate = useNavigate();

  const handleEnquireClick = () => {
    navigate("/contact-us");
  };

  return (
    <div className="p-6 md:p-8 bg-white rounded-lg shadow-md max-w-3xl mx-auto my-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <ShoppingCart className="h-8 w-8 mr-2 text-blue-500" />
        Cart
      </h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-lg text-center py-6">
          Your cart is currently empty.
        </p>
      ) : (
        <div className="space-y-6">
          <ul className="divide-y divide-gray-300">
            {cartItems.map((item) => (
              <li
                key={item._id}
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.productName}
                    </h3>
                    <p className="text-gray-600 mt-1">Price: ${item.productPrice}</p>

                    {/* Display Quantity */}
                    <p className="text-gray-700 mt-1">
                    <strong>Branch:</strong> {item.branchName} (ID: {item.branchId})
                  </p>


                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3 mt-2">
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-lg"
                      >
                        -
                      </button>
                      <span className="text-lg font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item._id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="text-center">
            <button
              onClick={handleEnquireClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md"
            >
              Proceed to Enquiry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
