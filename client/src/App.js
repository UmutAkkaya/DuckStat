import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './App.css';
import { FeedList } from './components/feedlist/feedlist';
import { NewFeeding } from './components/newFeeding/newFeeding';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Tabs>
          <TabList>
            <Tab>Past Feedings</Tab>
            <Tab>Feed a Duck!</Tab>
          </TabList>

          <TabPanel>
            <FeedList></FeedList>
          </TabPanel>
          <TabPanel>
            <NewFeeding></NewFeeding>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default App;
