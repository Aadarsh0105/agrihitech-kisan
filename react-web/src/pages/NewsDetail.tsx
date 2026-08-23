import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, LoaderCircle, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { Link, useParams } from "react-router-dom";
import { Seo } from "../components/layout/Seo";
import { getPublicNewsBySlug, type PublicNews } from "../services/news.service";

const normalizeContent = (content: string) => content.replace(/\s(?:style|class|width)=("[^"]*"|'[^']*')/gi, "");

export function NewsDetail() {
  const { slug = "" } = useParams();
  const [article, setArticle] = useState<PublicNews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getPublicNewsBySlug(slug)
      .then((record) => active && setArticle(record))
      .catch(() => active && setError("News article not found or currently unavailable."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [slug]);

  if (loading) return <div className="grid min-h-[65vh] place-items-center"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error || !article) return <div className="container py-20 text-center"><Newspaper className="mx-auto h-10 w-10 text-muted-foreground" /><h1 className="mt-4 font-display text-2xl font-bold">News article not found</h1><p className="mt-2 text-sm text-muted-foreground">{error}</p><Link to="/news" className="mt-5 inline-block font-semibold text-primary">View all news</Link></div>;

  return <div className="min-h-[70vh] bg-background py-10 sm:py-14">
    <Seo title={article.title} description={`Read ${article.title} on AgriMandi.`} />
    <div className="container min-w-0 max-w-4xl">
      <Link to="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" />All news</Link>
      <article className="mt-7 min-w-0 max-w-full">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><CalendarDays className="h-4 w-4" />{format(new Date(article.createdAt), "d MMMM yyyy")}</span>
        <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">{article.title}</h1>
        <div className="mt-8 aspect-[16/7] overflow-hidden rounded-2xl bg-muted"><img src={article.image} alt={article.title} className="h-full w-full object-cover" /></div>
        <div className="mt-9 min-w-0 max-w-full whitespace-pre-wrap break-words text-base leading-8 text-muted-foreground [overflow-wrap:anywhere] [&_*]:!max-w-full [&_*]:!whitespace-pre-wrap [&_*]:break-words [&_*]:[overflow-wrap:anywhere] [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_h1]:mb-4 [&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_li]:mb-2 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-5 [&_ul]:ml-5 [&_ul]:list-disc" dangerouslySetInnerHTML={{ __html: normalizeContent(article.content) }} />
      </article>
    </div>
  </div>;
}
