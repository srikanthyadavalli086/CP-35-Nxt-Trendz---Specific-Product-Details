import {Component} from 'react'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {Link} from 'react-router-dom'

import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// import {async} from 'rxjs'

class ProductItemDetails extends Component {
  state = {
    dataOne: {},
    dataTwo: [],
    apiStatus: apiStatusConstants[0],
    count: '',
  }

  componentDidMount() {
    this.getParticularProduct()
  }

  getParticularProduct = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const data1 = {
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        title: fetchedData.title,
        brand: fetchedData.brand,
        totalReviews: fetchedData.total_reviews,
        availability: fetchedData.availability,
        rating: fetchedData.rating,
        price: fetchedData.price,
        description: fetchedData.description,
      }
      const data2 = fetchedData.similar_products.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        title: each.title,
        brand: each.brand,
        totalReviews: each.total_reviews,
        availability: each.availability,
        rating: each.rating,
        style: each.style,
        description: each.description,
        price: each.price,
      }))
      console.log(data2)
      this.setState({
        dataOne: data1,
        dataTwo: data2,
        apiStatus: apiStatusConstants.success,
        count: 1,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onIncrease = () => {
    const {count} = this.state
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  onDecrease = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  renderProductDetailsView = () => {
    const {dataOne, dataTwo, count} = this.state
    const {
      title,
      brand,
      price,
      description,
      rating,
      availability,
      totalReviews,
      imageUrl,
    } = dataOne

    return (
      <>
        <div>
          <img src={imageUrl} alt="product" />
          <h1>{title}</h1>
          <p>Rs {price}/- </p>
          <p>{totalReviews}</p>
          <p>{rating}</p>
          <p>{description}</p>
          <p>Available: {availability}</p>
          <p>Brand: {brand}</p>
          <div>
            <button type="button" onClick={this.onDecrease} data-testid="minus">
              <BsDashSquare />
            </button>

            <p>{count}</p>
            <button type="button" onClick={this.onIncrease} data-testid="plus">
              <BsPlusSquare />
            </button>
          </div>
          <br />
          <button type="button">ADD TO CART</button>
        </div>
        <h1>Similar Products</h1>
        <ul>
          {dataTwo.map(each => (
            <li key={each.id}>
              <SimilarProductItem productsDetails={each} key={each.id} />
            </li>
          ))}
          ]
        </ul>
      </>
    )
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProductDetails()}
      </>
    )
  }
}
export default ProductItemDetails
