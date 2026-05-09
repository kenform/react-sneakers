import { getSneakerImageUrl } from '../utils/imagePath'

export const fallbackSneakers = [
  { id: 1, title: 'Nike Air Flow', price: 12999 },
  { id: 2, title: 'Adidas Blue Run', price: 11299 },
  { id: 3, title: 'Puma City Sand', price: 9499 },
  { id: 4, title: 'New Balance Violet Step', price: 13999 },
  { id: 5, title: 'Nike Aqua Lite', price: 10499 },
  { id: 6, title: 'Reebok Rose Street', price: 8999 },
  { id: 7, title: 'Asics Green Pace', price: 11999 },
  { id: 8, title: 'Adidas Sun Walk', price: 9999 },
  { id: 9, title: 'Nike Mono Flex', price: 12499 },
  { id: 10, title: 'Puma Indigo Pro', price: 10999 },
  { id: 11, title: 'Fila Pink Pulse', price: 8499 },
  { id: 12, title: 'Saucony Cyan Move', price: 13499 },
].map((item) => ({
  ...item,
  imageUrl: getSneakerImageUrl(item.id),
}))
