export default (price: string | number | undefined): string => {
  if (typeof price === 'string' && price?.match(',')) {
    price = price.replace(',', '');
  }
  return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '';
};
