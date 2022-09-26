import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstants = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  loading: 'LOADING',
}

class ProjectShowCase extends Component {
  state = {
    apiStatus: apiConstants.initial,
    activeId: categoriesList[0].id,
    data: [],
  }

  componentDidMount() {
    this.getDataWithApiCall()
  }

  onChangeActiveId = event => {
    this.setState({activeId: event.target.value}, () => {
      this.getDataWithApiCall()
    })
  }

  onRetry = () => {
    this.getDataWithApiCall()
  }

  getDataWithApiCall = async () => {
    this.setState({apiStatus: apiConstants.loading})
    const {activeId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()

    const updatedData = data.projects.map(eachItem => ({
      id: eachItem.id,
      name: eachItem.name,
      imgUrl: eachItem.image_url,
    }))
    console.log(response)
    if (response.ok === true) {
      this.setState({data: updatedData, apiStatus: apiConstants.success})
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {data} = this.state
    return (
      <ul className="unorder-list-container">
        {data.map(eachItem => (
          <li key={eachItem.id} className="list-item">
            <img
              className="list-item-image"
              src={eachItem.imgUrl}
              alt={eachItem.name}
            />
            <p className="list-item-name">{eachItem.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderLoaderView = () => (
    <div testid="loader" className="loader">
      <Loader type="ThreeDots" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-background">
      <img
        className="failure-view-image"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="oops-heading">Oops! Something Went Wrong</h1>
      <p className="not-found-paragraph">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.onRetry} className="retry-button">
        Retry
      </button>
    </div>
  )

  renderWithSwitch = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.loading:
        return this.renderLoaderView()
      case apiConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar-background">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div className="select-background">
          <select className="select" onChange={this.onChangeActiveId}>
            {categoriesList.map(eachItem => (
              <option key={eachItem.id} value={eachItem.id}>
                {eachItem.displayText}
              </option>
            ))}
          </select>
          {this.renderWithSwitch()}
        </div>
      </div>
    )
  }
}
export default ProjectShowCase
