import { SelectionIndicator, Tab, TabList, TabPanel, Tabs } from 'react-aria-components';


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
          <Tab id="CSV Data">
            <span>CSV Data</span>
            <SelectionIndicator />
          </Tab>
          <Tab id="Other Stuff">
            <span>Other Stuff</span>
            <SelectionIndicator />
          </Tab>
        </TabList>
        <TabPanel id="Celestials Grid">
          body: Celestials Grid
        </TabPanel>
        <TabPanel id="Crafts">
          body: Crafts
        </TabPanel>
        <TabPanel id="CSV Data">
          body: CSV Data
        </TabPanel>
        <TabPanel id="Other Stuff">
          body: Other Stuff
        </TabPanel>
      </Tabs>

      <div id="info" className="page-container">
        info !
      </div>

    </div>


  )
}