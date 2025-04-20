export const fadout = (direction, delay) => {
  return {
    hidden: {
      y: direction === 'up' ? -10 : direction === 'down' ? 10 : 0, // Smaller value to avoid hiding elements
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'tween',
        duration: 1.2,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75], // Make the transition feel smooth
      },
    },
  };
};
