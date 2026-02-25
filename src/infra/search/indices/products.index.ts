export const productsIndex = {
  index: 'products',
  mappings: {
    properties: {
      id: { type: 'keyword' as const },
      name: { type: 'text' as const },
      description: { type: 'text' as const },
      category: { type: 'keyword' as const },
      price: { type: 'integer' as const },
      stock: { type: 'integer' as const },
      tags: { type: 'keyword' as const },
      createdAt: { type: 'date' as const },
      updatedAt: { type: 'date' as const },
      deletedAt: { type: 'date' as const },
    },
  },
};
