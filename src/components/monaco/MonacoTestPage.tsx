import { XmlEditor } from "./XmlEditor";

export function MonacoTestPage() {
  return <XmlEditor defaultValue={`<?xml version="1.0" encoding="UTF-8"?>
<Wrapper Id="abc">
  <Node Kg="12345">hi</Node>
  <Node Id="Hello" Other="Abc" />
</Wrapper>
`}/>
}