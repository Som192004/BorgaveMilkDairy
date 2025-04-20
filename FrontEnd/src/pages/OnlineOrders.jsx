// import React from "react";

// const orders = [
//   {
//     orderId: "ORD12345",
//     customerName: "John Doe",
//     mobileNumber: "9876543210",
//     address: "123, ABC Street, Pune",
//     products: [
//       {
//         productName: "Milk 1Litre",
//         productPrice: 100,
//         quantity: 1,
//         productImage:
//           "https://res.cloudinary.com/dycmoosac/image/upload/v1742193435/subadmin_profiles/trtuzfo8e2jlaomnvvjt.jpg",
//       },
//       {
//         productName: "Lassi",
//         productPrice: 20,
//         quantity: 2,
//         productImage:
//           "https://res.cloudinary.com/dycmoosac/image/upload/v1742193435/subadmin_profiles/trtuzfo8e2jlaomnvvjt.jpg",
//       },
//       {
//         productName: "Dahi 500 ML",
//         productPrice: 20,
//         quantity: 1,
//         productImage:
//           "https://res.cloudinary.com/dycmoosac/image/upload/v1742193435/subadmin_profiles/trtuzfo8e2jlaomnvvjt.jpg",
//       },
//       {
//         productName: "Basundi (500ML)",
//         productPrice: 75,
//         quantity: 1,
//         productImage:
//           "https://res.cloudinary.com/dycmoosac/image/upload/v1742193435/subadmin_profiles/trtuzfo8e2jlaomnvvjt.jpg",
//       },
//     ],
//     totalAmount: 215,
//   },
// ];

// const OnlineOrders = () => {
//   return (
//     <div className="p-4 bg-gray-100 min-h-screen">
//       <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//         Online Orders
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {orders.map((order) => (
//           <div
//             key={order.orderId}
//             className="bg-white shadow-md rounded-lg p-6 w-full"
//           >
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">
//               Order ID: {order.orderId}
//             </h3>
//             <p className="text-md text-gray-700">
//               <strong>Customer:</strong> {order.customerName}
//             </p>
//             <p className="text-md text-gray-700">
//               <strong>Mobile:</strong> {order.mobileNumber}
//             </p>
//             <p className="text-md text-gray-700 mb-4">
//               <strong>Address:</strong> {order.address}
//             </p>
//             <div className="space-y-4">
//               {order.products.map((product, index) => (
//                 <div key={index} className="flex items-center gap-4">
//                   <img
//                     src={product.productImage}
//                     alt={product.productName}
//                     className="w-16 h-16 rounded-md object-cover"
//                   />
//                   <div>
//                     <h4 className="text-md font-medium text-gray-700">
//                       {product.productName}
//                     </h4>
//                     <p className="text-sm text-gray-600">
//                       Price: ₹{product.productPrice} | Quantity: {product.quantity}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4 text-right text-lg font-semibold text-gray-800">
//               Total: ₹{order.totalAmount}
//             </div>
//             <div className="mt-4 flex justify-between">
//               <button className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition">
//                 Place Order
//               </button>
//               <button className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition">
//                 Cancel Order
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OnlineOrders;


import React, { useEffect, useState } from "react";
import axios from "axios";

const OnlineOrders = () => {
  const [orders, setOrders] = useState([]); // State to store fetched orders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch orders from the backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/online-order/get-all-orders" , {
        withCredentials : true
      }) // Adjust this API endpoint as needed
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleOrder = async (orderId) =>
  {
    axios
      .get(`http://localhost:8000/api/v1/online-order/place-order/:${orderId}` , {
        withCredentials : true
      }) // Adjust this API endpoint as needed
      .then((response) => {
        const updatedOrder = response.data;
        
        setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
        setLoading(false);
      });
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Online Orders
      </h2>

      {loading ? (
        <p className="text-center text-gray-700">Loading orders...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.length === 0 ? (
            <p className="text-center col-span-full text-gray-700">
              No orders available for today
            </p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-white shadow-md rounded-lg p-6 w-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Order ID: {order._id}
                </h3>
                <p className="text-md text-gray-700">
                  <strong>Customer:</strong> {order.customerName}
                </p>
                <p className="text-md text-gray-700">
                  <strong>Mobile:</strong> {order.mobileNumber}
                </p>
                <p className="text-md text-gray-700 mb-4">
                  <strong>Address:</strong> {order.address}
                </p>
                <div className="space-y-4">
                  {order?.products?.map((product, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <img
                        src={product.productImage}
                        alt={product.productName}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                      <div>
                        <h4 className="text-md font-medium text-gray-700">
                          {product.productName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Price: ₹{product.productPrice} | Quantity: {product.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* <div className="mt-4 text-right text-lg font-semibold text-gray-800">
                  Total: ₹{order.totalAmount}
                </div> */}
                <div className="mt-4 flex justify-between">
                  {
                    order.isPlaced ? <>Order Placed</> : <button className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition" onClick={() => handleOrder(order._id)}>
                    Place Order
                  </button>
                  }
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OnlineOrders;
