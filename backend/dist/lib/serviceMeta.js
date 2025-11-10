"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceMeta = getServiceMeta;
const META = {
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
};
function getServiceMeta(slug) {
    return META[slug] ?? { image: '/img/service-default.svg', tags: [] };
}
//# sourceMappingURL=serviceMeta.js.map