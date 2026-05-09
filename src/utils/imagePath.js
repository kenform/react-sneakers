const SNEAKER_IMAGES = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
  "10.jpg"
]

export const getSneakerImageUrl = (id = 1) => {
  const numericId = Number(id)
  const safeIndex = Number.isFinite(numericId) && numericId > 0 ? (numericId - 1) % SNEAKER_IMAGES.length : 0

  return `img/sneakers/${SNEAKER_IMAGES[safeIndex]}`
}

export const getPublicImageUrl = (imageUrl, id = 1) => {
  const fallback = getSneakerImageUrl(id)
  const path = imageUrl || fallback

  if (path.startsWith('http')) return path
  return `${process.env.PUBLIC_URL}/${path.replace(/^\//, '')}`
}

export const withLocalSneakerImage = (item, index = 0) => ({
  ...item,
  imageUrl: getSneakerImageUrl(item?.id || index + 1),
})
