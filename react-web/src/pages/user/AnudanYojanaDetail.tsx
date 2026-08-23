import { useEffect, useState } from "react";
import { ArrowLeft, Landmark, LoaderCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Seo } from "../../components/layout/Seo";
import { getPublicScheme, type PublicScheme } from "../../services/scheme.service";

const withoutStoredHeading = (content: string, heading: string) => content.replace(
  new RegExp(`^\\s*<h[1-3][^>]*>\\s*${heading}\\s*</h[1-3]>`, "i"),
  ""
).replace(/\s(?:style|class|width)=("[^"]*"|'[^']*')/gi, "");

function RichSection({ title, content }: { title: string; content?: string }) {
  if (!content?.replace(/<[^>]+>/g, "").trim()) return null;
  return <section className="min-w-0 max-w-full py-9 first:pt-0 last:pb-0"><h2 className="mb-5 font-display text-2xl font-bold text-foreground">{title}</h2><div className="scheme-content min-w-0 max-w-full whitespace-pre-wrap break-words text-sm leading-7 text-muted-foreground [overflow-wrap:anywhere] [&_*]:!max-w-full [&_*]:!whitespace-pre-wrap [&_*]:break-words [&_*]:[overflow-wrap:anywhere] [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_h1]:mb-4 [&_h1]:font-display [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-foreground [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_li]:mb-2 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-4 [&_ul]:ml-5 [&_ul]:list-disc" dangerouslySetInnerHTML={{ __html: withoutStoredHeading(content, title) }} /></section>;
}

export function AnudanYojanaDetail() {
  const { slug = "" } = useParams();
  const [scheme, setScheme] = useState<PublicScheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    getPublicScheme(slug).then((record) => active && setScheme(record)).catch(() => active && setError("Scheme not found or currently unavailable.")).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [slug]);

  if (loading) return <div className="grid min-h-[65vh] place-items-center"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error || !scheme) return <div className="container py-20 text-center"><Landmark className="mx-auto h-10 w-10 text-muted-foreground" /><h1 className="mt-4 font-display text-2xl font-bold">Scheme not found</h1><p className="mt-2 text-sm text-muted-foreground">{error}</p><Link to="/anudan-yojana" className="mt-5 inline-block font-semibold text-primary">View all schemes</Link></div>;

  return <div className="min-h-[70vh] bg-background py-10 sm:py-14">
    <Seo title={scheme.title} description={`Eligibility, benefits and application details for ${scheme.title}.`} />
    <div className="container min-w-0 max-w-4xl">
      <Link to="/anudan-yojana" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" />All schemes</Link>
      <header className="mt-6 pb-4">
        <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">{scheme.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2">{scheme.tags?.map((tag) => <span key={tag} className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">{tag}</span>)}</div>
      </header>
      <article className="min-w-0 max-w-full pb-10 pt-6">
        <RichSection title="Details" content={scheme.content} />
        <RichSection title="Benefits" content={scheme.benefits} />
        <RichSection title="Eligibility" content={scheme.eligibility} />
        <RichSection title="Application Process" content={scheme.applicationProcess} />
        <RichSection title="Documents Required" content={scheme.requiredDocuments} />
      </article>
    </div>
  </div>;
}
