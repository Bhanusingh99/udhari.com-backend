export function getRandomColor() {
    const tailwindColors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500'
    ];
  
    const getRandomIndex = () => {
      const currentIndex = Math.floor(Math.random() * tailwindColors.length);
      return currentIndex === previousIndex ? getRandomIndex() : currentIndex;
    };
  
    let previousIndex = -1;
    const randomColorIndex = getRandomIndex();
    previousIndex = randomColorIndex;
  
    return tailwindColors[randomColorIndex];
  }
  