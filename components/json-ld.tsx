import { jsonLdGraph, serializeJsonLd } from "@/lib/seo";

/*
 * Structured data for search engines. A plain <script> rather than next/script:
 * JSON-LD is data, not code to run. The nodes come from our own content files.
 */
export function JsonLd({ nodes }: { nodes: object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLdGraph(nodes)) }}
    />
  );
}
