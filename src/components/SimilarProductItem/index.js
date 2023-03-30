// Write your code here
const SimilarProductItem = props => {
  const {productsDetails} = props
  const {title, brand, rating, imageUrl, price} = productsDetails

  return (
    <div>
      <img src={imageUrl} alt="similar product" />
      <p>{title}</p>
      <p>by {brand}</p>
      <p>{price}</p>
      <p>{rating}</p>
    </div>
  )
}
export default SimilarProductItem
