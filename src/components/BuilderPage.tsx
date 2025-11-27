import { Button, Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { NuqsAdapter } from 'nuqs/adapters/react'
import { useQueryState } from 'nuqs';

import { TabContent } from './TabContent';
import { BuilderGrid } from './builder/BuilderGrid';
import { BuilderCsvEditor } from './builder/BuilderCsvEditor';
import { SystemXmlEditor } from './builder/SystemXmlEditor';


export function BuilderPage() {
  return (
    <NuqsAdapter>
      <Inner />
    </NuqsAdapter>
  )
}

export function Inner() {

  const [tab, setTab] = useQueryState('tab')

  return (

    <div id="page">

      <div id="header" className="page-container">
        <div className="links">
          <a href="/pebkac/">Home</a>
        </div>
        <span className="logo">PEBKAC</span>
      </div>

      <Tabs className="nav-tabs" orientation='vertical' selectedKey={tab} onSelectionChange={e => setTab(e as string)}>

        <TabList aria-label="Page Navigation">
          <Tab id="instructions">
            <TabContent label="Instructions" step="ℹ" />
          </Tab>
          <Tab id="csv">
            <TabContent label="Primary CSV Data" step="💿" />
          </Tab>
          <Tab id="grid">
            <TabContent label="Pick Celestials" step="🌏" />
          </Tab>
          <Tab id="crafts">
            <TabContent label="Pick Crafts &amp; Kittenauts" step="😺" />
          </Tab>
          <Tab id="other">
            <TabContent label="Other... things" step="🤔" />
          </Tab>
          <Tab id="systemxml">
            <TabContent label="Your <System /> XML" step="🪐" />
          </Tab>
          <Tab id="logs">
            <TabContent label="Logs" step="💥" />
          </Tab>
        </TabList>

        <TabPanel id="instructions">
          do stuff
        </TabPanel>

        <TabPanel id="csv">
          <BuilderCsvEditor />
        </TabPanel>

        <TabPanel id="grid">
          <BuilderGrid />
        </TabPanel>

        <TabPanel id="crafts">

        </TabPanel>

        <TabPanel id="other">
          body: Other Stuff
        </TabPanel>

        <TabPanel id="systemxml">
          <SystemXmlEditor />
        </TabPanel>

        <TabPanel id="logs">
          body: Other Stuff
        </TabPanel>

      </Tabs>

      <section id="info" className="page-container">
        <Button >Generate XML   🚀</Button>
      </section>

    </div>

  )
}