import React, {Component} from 'react';
import './App.scss';
import firebase from './firebase/firebase';
import FiltersWrapper from './Components/Filters-Wrapper/filters-wrapper.component';
import ResultsWrapper from './Components/Results-Wrapper/results-wrapper.component';
import Header from './Components/Header/header.component';
import { Loader } from './Components/Loader/loader.component';
import { LocationTitle } from './Components/Location-Title/location-title.component';
import Footer from './Components/Footer/footer.component';
import ArrowUp from './Components/Arrow-Up/arrow-up.component';

class App extends Component {
  constructor(){
    super()

    this.state = {
      isLoading: true,
      data: [],
      location: 'toronto',
      type: ''
    }

    this.onLocationChange = this.onLocationChange.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
  }

  onLocationChange(e){
    const selectedLocation = e.value;

    this.setState({
      location: selectedLocation,
      type: ''
    })

    this.fetchData(selectedLocation, '');
  }

  onTypeChange(e){
    const selectedType = e.value;

    this.setState({
      type: selectedType
    })
  }

  fetchData = async(location, type) => {
    this.setState({
      isLoading: true
    })

    const db = firebase.firestore()
    const dataRaw = await db.collection(location).get()
    const data = dataRaw.docs.map(doc => doc.data());
    this.setState({
      data: data,
      type: type,
      isLoading: false
    })
  }

  componentDidMount(){
    this.fetchData('toronto', '');
  }

  render(){
    const {data, location, type, isLoading} = this.state;
    const sortedData = data.sort((a, b) => (a.displayName > b.displayName) ? 1 : -1);

    let filteredData = sortedData.slice();
    if (type) {
      filteredData = sortedData.filter(item =>
        item.type.includes(type)
      );
    }

    return (
      <div className="app">
        <Header />
        <FiltersWrapper 
          location={location}
          type={type}
          handleLocationChange={this.onLocationChange}
          handleTypeChange={this.onTypeChange}
        />
        <LocationTitle 
          location={location}
        />
        {
          isLoading ?
          <Loader />
          :
          <ResultsWrapper 
            data={filteredData}
          />
        }
        <Footer />
        <ArrowUp />
      </div>
    )
  }
}

export default App;
