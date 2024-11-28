export const CONSTANTS = {
  MONTH_MAPPING: {
    1: 10,
    2: 11,
    3: 12,
  } as Record<number, number>,
  DISCOUNT_ZERO: 0,
  MONTHS_IN_YEAR: 12,
  DISCOUNT_PRECISION: 2,
  MAX_DISCOUNT_PERCENTAGE: 50,
  MIN_DISCOUNT_PERCENTAGE: 5,
}

export const FIELD_NAMES = {
  PRODUCT_ID: 'product_id',
  BRAND_NAME: 'brand_name',
  STOCK: 'stock',
  MERCHANT_ID: 'merchant_id',
  DESCRIPTION: 'description',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  BRAND_IMAGE_URL: 'brand_image_url',
  TOTAL_COUNT: 'totalCount',
}

export const RATING = {
  DEFAULT_RATING: null,
  PRECISION: 2,
}

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 9,
}
