import { useStore } from "@nanostores/react";
import { XmlEditor } from "../monaco/XmlEditor";
import { $generatedSystemXml } from "../../state/builder-state";

export function SystemXmlEditor() {

  const xml = useStore($generatedSystemXml);

  return (
    <XmlEditor value={xml} />
  );
}