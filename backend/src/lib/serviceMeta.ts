const META: Record<
  string,
  {
    image: string
    tags: string[]
  }
> = {
  'hammam-royal': {
    image: '/img/royal.jpg',
    tags: ['Signature'],
  },
  'gommage-savon-noir': {
    image: '/img/gommage.jpg',
    tags: ['Best-seller'],
  },
  'massage-oriental': {
    image: '/img/massage.jpg',
    tags: ['Relax'],
  },
  'pack-detente': {
    image: '/img/pack.jpg',
    tags: ['Forfait'],
  },
}

export function getServiceMeta(slug: string) {
  return META[slug] ?? { image: '/img/service-default.svg', tags: [] }
}
