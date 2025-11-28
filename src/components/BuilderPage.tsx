import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { NuqsAdapter } from 'nuqs/adapters/react'
import { useQueryState } from 'nuqs';

import { TabContent } from './TabContent';
import { BuilderGrid } from './builder/BuilderGrid';
import { BuilderCsvEditor } from './builder/BuilderCsvEditor';
import { SystemXmlEditor } from './builder/SystemXmlEditor';
import { BuilderInstructions } from './builder/BuilderInstructions';
import { BuilderSystemSettings } from './builder/BuilderSystemSettings';
import { BuilderCrafts } from './builder/BuilderCrafts';
import { BuilderSelection } from './builder/BuilderSelection';
import { CandyCane, Cat, CodeXml, FileText, Flame, NotebookPen, Orbit } from 'lucide-react';


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
            <TabContent label="Instructions" step={<NotebookPen />} />
          </Tab>
          <Tab id="csv">
            <TabContent label="Primary CSV Data" step={<FileText />} />
          </Tab>
          <Tab id="grid">
            <TabContent label="Pick Celestials" step={<Orbit />} />
          </Tab>
          <Tab id="crafts">
            <TabContent label="Pick Crafts &amp; Kittenauts" step={<Cat />} />
          </Tab>
          <Tab id="other">
            <TabContent label="Other... things" step={<CandyCane />} />
          </Tab>
          <Tab id="systemxml">
            <TabContent label="Your <System /> XML" step={<CodeXml />} />
          </Tab>
          <Tab id="logs">
            <TabContent label="Logs" step={<Flame />} />
          </Tab>
        </TabList>

        <TabPanel id="instructions">
          <BuilderInstructions />
        </TabPanel>

        <TabPanel id="csv">
          <BuilderCsvEditor />
        </TabPanel>

        <TabPanel id="grid">
          <BuilderGrid />
        </TabPanel>

        <TabPanel id="crafts">
          <BuilderCrafts />
        </TabPanel>

        <TabPanel id="other">
          <BuilderSystemSettings />
        </TabPanel>

        <TabPanel id="systemxml">
          <SystemXmlEditor />
        </TabPanel>

        <TabPanel id="logs">
          logs go here Soon(tm)
        </TabPanel>

      </Tabs>

      <section id="info" className="page-container">

        <BuilderSelection />

      </section>

    </div>

  )
}