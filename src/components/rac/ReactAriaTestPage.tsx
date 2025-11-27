import { Button, SelectionIndicator, Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { BuilderGrid } from '../BuilderGrid';


import systemDataJson from "../../data/earth_system_data.json";
import systemDataCsv from "../../data/earth_system_data.csv?raw";

import type { SystemEntry } from '../../ts/data/SystemEntry';
import { XmlEditor } from '../monaco/XmlEditor';
import { CsvEditor } from '../monaco/CsvEditor';
import { TabContent } from './TabContent';

const systemData = systemDataJson as SystemEntry[];


export function ReactAriaTestPage() {
  return (

    <div id="page">

      <div id="header" className="page-container">
        header
      </div>

      <div id="tabs-wrapper"></div>
      <Tabs className="nav-tabs" orientation='vertical' defaultSelectedKey="instructions">
        <TabList aria-label="History of Ancient Rome">

          <Tab id="instructions">
            <TabContent label="Instructions" step="1" />
          </Tab>
          <Tab id="csv">
            <TabContent label="Primary CSV Data"  step="2" />
          </Tab>
          <Tab id="json">
            <TabContent label="JSON Data"  step="3" />
          </Tab>
          <Tab id="grid">
            <TabContent label="Pick Celestials" step="4"  />
          </Tab>
          <Tab id="crafts">
            <TabContent label="Pick Crafts &amp; Kittenauts"  step="5" />
          </Tab>
          <Tab id="other">
            <TabContent label="Other... things"  step="6" />
          </Tab>
        </TabList>
        <TabPanel id="instructions">
          do stuff
        </TabPanel>
        <TabPanel id="grid">
          <BuilderGrid data={systemData} quickfilterText='' />
        </TabPanel>
        <TabPanel id="crafts">
          <XmlEditor defaultValue={`<?xml version="1.0" encoding="UTF-8"?>
<Wrapper Id="abc">
  <Node Kg="12345">hi</Node>
  <Node Id="Hello" Other="Abc" />
</Wrapper>
`} />
        </TabPanel>
        <TabPanel id="csv">
          <CsvEditor defaultValue={systemDataCsv} />
        </TabPanel>
        <TabPanel id="other">
          body: Other Stuff
        </TabPanel>
      </Tabs>

      <div id="info" className="page-container">

        <Button onPress={() => alert('Hello world!')}>Generate XML 🚀</Button>


      </div>

    </div>


  )
}