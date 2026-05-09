export const getSneakerImageUrl = (id = 1) => {
  const numericId = Number(id)
  const safeId = Number.isFinite(numericId) && numericId > 0 ? ((numericId - 1) % 12) + 1 : 1

  return `img/sneakers/sneaker-${safeId}.svg`
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
