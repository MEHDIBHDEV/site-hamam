import { Service } from '../types'

export const services: Service[] = [
  {
    id: 'srv-royal',
    title: 'Hammam Royal',
    slug: 'hammam-royal',
    description: 'Rituel traditionnel avec vapeur et repos.',
    durationMin: 60,
    price: 55,
    image: '/img/royal.jpg',
    tags: ['Signature'],
    isSignature: true,
  },
  {
    id: 'srv-savon',
    title: 'Gommage au Savon Noir',
    slug: 'gommage-savon-noir',
    description: 'Gommage au kessa et savon noir.',
    durationMin: 45,
    price: 45,
    image: '/img/gommage.jpg',
    tags: ['Best-seller'],
    isSignature: false,
  },
  {
    id: 'srv-massage',
    title: 'Massage Oriental',
    slug: 'massage-oriental',
    description: 'Massage relaxant aux huiles.',
    durationMin: 60,
    price: 65,
    image: '/img/massage.jpg',
    tags: ['Relax'],
    isSignature: false,
  },
  {
    id: 'srv-pack',
    title: 'Pack Détente',
    slug: 'pack-detente',
    description: 'Hammam + Massage (90 min).',
    durationMin: 90,
    price: 99,
    image: '/img/pack.jpg',
    tags: ['Forfait'],
    isSignature: false,
  },
]

export function getServiceById(id: string) {
  return services.find((s) => s.id === id)
}
