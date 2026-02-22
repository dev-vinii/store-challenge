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
      created_at: { type: 'date' as const },
      updated_at: { type: 'date' as const },
      deleted_at: { type: 'date' as const },
    },
  },
};
