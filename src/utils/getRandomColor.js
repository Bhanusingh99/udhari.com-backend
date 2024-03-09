export function getRandomColor() {
    const tailwindColors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-purple-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-gray-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-black-500',
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
  