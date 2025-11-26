import { Button, SelectionIndicator, Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { BuilderGrid } from '../BuilderGrid';


import systemDataJson from "../../data/earth_system_data.json";
import systemDataCsv from "../../data/earth_system_data.csv?raw";

import type { SystemEntry } from '../../ts/data/SystemEntry';
import { XmlEditor } from '../monaco/XmlEditor';
import { CsvEditor } from '../monaco/CsvEditor';

const systemData = systemDataJson as SystemEntry[];


export function ReactAriaTestPage() {
  return (

    <div id="page">

      <div id="header" className="page-container">
        header
      </div>

      <Tabs orientation='vertical' defaultSelectedKey="Celestials Grid">
        <TabList aria-label="History of Ancient Rome">
          <Tab id="Celestials Grid">
            <span>Celestials Grid</span>
            <SelectionIndicator />
          </Tab>
          <Tab id="Crafts">
            <span>Crafts</span>
            <SelectionIndicator />
          </Tab>
          <Tab id="Source CSV Data">
            <span>Source CSV Data</span>
            <SelectionIndicator />
          </Tab>
          <Tab id="Other Stuff">
            <span>Other Stuff</span>
            <SelectionIndicator />
          </Tab>
        </TabList>
        <TabPanel id="Celestials Grid">
          <BuilderGrid data={systemData} quickfilterText='' />
        </TabPanel>
        <TabPanel id="Crafts">
          <XmlEditor defaultValue={`<?xml version="1.0" encoding="UTF-8"?>
<Wrapper Id="abc">
  <Node Kg="12345">hi</Node>
  <Node Id="Hello" Other="Abc" />
</Wrapper>
`} />
        </TabPanel>
        <TabPanel id="Source CSV Data">
          <CsvEditor defaultValue={systemDataCsv} />
        </TabPanel>
        <TabPanel id="Other Stuff">
          body: Other Stuff
        </TabPanel>
      </Tabs>

      <div id="info" className="page-container">

        <Button onPress={() => alert('Hello world!')}>Generate XML 🚀</Button>


      </div>

    </div>


  )
}