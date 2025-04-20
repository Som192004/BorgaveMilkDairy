// import React, { createContext, useState, useEffect } from "react";

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState(() => {
//     const storedCart = localStorage.getItem("cartItems");
//     return storedCart ? JSON.parse(storedCart) : [];
//   });

//   // Persist cart items to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem("cartItems", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (product) => {
//     console.log("product: " , product)
//     setCartItems((prevItems) => {
//       const existingItem = prevItems.find(
//         (item) =>
//           item.id === product.id &&
//           item.selectedQuantity === product.selectedQuantity
//       );

//       if (existingItem) {
//         return prevItems.map((item) =>
//           item.id === product.id &&
//           item.selectedQuantity === product.selectedQuantity
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         return [...prevItems, { ...product, quantity: 1 }];
//       }
//     });
//   };

//   const removeFromCart = (productId, selectedQuantity) => {
//     setCartItems((prevItems) =>
//       prevItems.filter(
//         (item) =>
//           !(item.id === productId && item.selectedQuantity === selectedQuantity)
//       )
//     );
//   };

//   const increaseQuantity = (productId, selectedQuantity) => {
//     setCartItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === productId && item.selectedQuantity === selectedQuantity
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       )
//     );
//   };

//   const decreaseQuantity = (productId, selectedQuantity) => {
//     setCartItems((prevItems) =>
//       prevItems
//         .map((item) =>
//           item.id === productId && item.selectedQuantity === selectedQuantity
//             ? { ...item, quantity: item.quantity - 1 }
//             : item
//         )
//         .filter((item) => item.quantity > 0)
//     );
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         increaseQuantity,
//         decreaseQuantity,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // ✅ Persist cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Add product to cart (with branch information)
  const addToCart = (product) => {
    const storedBranch = JSON.parse(localStorage.getItem("selectedBranch")) || {};
    const branchId = storedBranch.branchId || "unknown";
    const branchName = storedBranch.branchName || "Unknown Branch";

    console.log("Adding product:", product);
    console.log("Branch ID:", branchId, "Branch Name:", branchName);

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item._id === product._id && item.branchId === branchId
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id && item.branchId === branchId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1, branchId, branchName }];
      }
    });
  };

  // ✅ Remove product from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  // ✅ Increase product quantity
  const increaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // ✅ Decrease product quantity (removes item if quantity is 0)
  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
