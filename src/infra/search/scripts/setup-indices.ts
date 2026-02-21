import { searchProvider } from '../search.provider'
import { productsIndex } from '../indices/products.index'

async function setup() {
  await searchProvider.initialize()
  const client = searchProvider.getClient()

  const exists = await client.indices.exists({ index: productsIndex.index })
  if (exists) {
    console.log(`Index "${productsIndex.index}" already exists, skipping.`)
  } else {
    await client.indices.create(productsIndex)
    console.log(`Index "${productsIndex.index}" created successfully.`)
  }

  await searchProvider.destroy()
}

setup().catch((err) => {
  console.error('Failed to setup indices:', err)
  process.exit(1)
})
