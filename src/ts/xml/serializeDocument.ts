export const XML_PREAMBLE = '<?xml version="1.0" encoding="utf-8"?>\n';

export function serializeDocument(doc: Document): string {
  const serializer = new XMLSerializer();
  const xml = serializer.serializeToString(doc);
  return XML_PREAMBLE + xml;
}
