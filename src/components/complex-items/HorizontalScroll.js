import React, { useRef, useState } from 'react';

const HorizontalScroll = ({ children, className }) => {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartX(event.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    return;
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - startX;
    scrollContainerRef.current.scrollLeft -= deltaX;
    setStartX(event.clientX); // Update startX for next drag movement
  };

  const handleWheel = (event) => {
    if (event.deltaY === 0) return;
    scrollContainerRef.current.scrollBy(event.deltaY/8, 0);
  };

  return (
    <div
      ref={scrollContainerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      style={{
        overflowX: 'scroll',
        display: 'flex',
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export default HorizontalScroll;