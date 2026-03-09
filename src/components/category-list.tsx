import React from 'react';
import { Box, Text } from 'zmp-ui';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryListProps {
  categories: Category[];
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  return (
    <Box className="w-full overflow-x-auto whitespace-nowrap pb-4 hide-scrollbar">
      <div className="flex space-x-4 px-4">
        {categories.map((cat) => (
          <div key={cat.id} className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
              <span className="text-2xl">{cat.icon}</span>
            </div>
            <Text size="xxSmall" className="font-medium text-gray-600">
              {cat.name}
            </Text>
          </div>
        ))}
      </div>
    </Box>
  );
};
