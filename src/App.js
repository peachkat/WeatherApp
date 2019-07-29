import React from 'react';
import './App.css';
//import Button from '@material-ui/core/Button';
import { Input, Button, Progress } from "antd";
//import OutlinedInput from '@material-ui/core/OutlinedInput';
//import TextField from '@material-ui/core/TextField';
//import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment'
import { Bar } from 'react-chartjs-2'

class App extends React.Component {

  state = {
    weather: null,
    loading: false,
    text: '',
  }

  getWeather = async (e) => {
    e.preventDefault()
    this.setState({ loading: true, weather: null })
    var key = '657d4c335154e8175a3ded8cf74ba786'
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${this.state.text}&units=imperial&APPID=${key}`
    var r = await fetch(url)
    var json = await r.json()

    if (r.status === 200) {
      this.setState({
        weather: json.list,
        loading: false,
        text: '',
        error: null
      })
    } else {
      this.setState({
        error: json.message,
        loading: false
      })
    }
  }

  render() {
    var { weather, loading, text, error } = this.state
    var data

    if (weather) {
      data = {
        labels: weather.map(w => moment(w.dt * 1000).format('11 hh:mm a')), //formats time properly with moment
        datasets: [{
          label: 'Tempurature',
          borderWidth: 1,
          data: weather.map(w => w.main.temp), //takes temperature out of the main in JSON data
          backgroundColor: 'rgba(132,99,255,0.2)',
          borderColor: 'rgba(132,99,255,1)',
          hoverBackgroundColor: 'rgba(132,99,255,0.4)',
          hoverBorderColor: 'rgba(132,99,255,1)'
        }]
      }
    }
    console.log(data)
    return (
      <div className="App">
        <form className="App-header" onSubmit={this.onSubmit}>
        <Progress //The progress bar here is useless and only a test
          strokeColor={{
          from: '#108ee9',
          to: '#87d068',
          }}
          percent={75}
          status="active" //End of test progress bar
        /> 
          <Input value={text}
            autoFocus
            size="large"
            placeholder="Enter a city to search for weather"
            onChange={e => this.setState({ text: e.target.value })}
            style={{ width: '100%', marginLeft: 8 }}
          />
          <Button disabled={loading || !text} type="primary" icon="search">
            Search
          </Button>
        </form>
        {loading && <Progress /> /* Actual progress bar that does not show up atm */ } 
        <main>
          {data && <Bar
            data={data}
            width={800}
            height={400}
          />}
          {error}
        </main>
      </div>
    );
  }
}

export default App;
