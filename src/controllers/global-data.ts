export const ITEMS_PER_PAGE = 8;

export const ITEM_SORT: any = {
    'low-price-first': { price: 1 },
    'higher-price-first': { price: -1 },
    'most-relevant-first': { likes: -1 },
    'most-recent-first': { 'date_created': -1},
}