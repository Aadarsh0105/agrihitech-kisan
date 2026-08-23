import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, LoaderCircle, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Seo } from "../components/layout/Seo";
import { getPublicNews, type PublicNews } from "../services/news.service";

const excerpt = (html: string) => new DOMParser().parseFromString(html, "text/html").body.textContent?.trim() || "";

export function News() {
  const [articles, setArticles] = useState<PublicNews[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getPublicNews(page, 9)
      .then(({ news, pagination }) => {
        if (!active) return;
        setArticles(news);
        setTotalPages(pagination?.totalPages ?? 1);
      })
      .catch((reason) => active && setError(reason?.response?.data?.message || "Unable to load news right now."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [page]);

  return <>
    <Seo title="Agriculture News" description="Latest agriculture news and updates for Indian farmers." />
    <div className="border-b border-border bg-secondary/30"><div className="container py-8"><h1 className="font-display text-3xl font-extrabold text-foreground">Agriculture News</h1><p className="mt-1 text-muted-foreground">Latest agriculture updates, newest first.</p></div></div>
    <div className="container py-8">
      {loading ? <div className="grid min-h-64 place-items-center"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div> : null}
      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">{error}</div> : null}
      {!loading && !error && articles.length === 0 ? <div className="rounded-2xl border border-border bg-card p-12 text-center"><Newspaper className="mx-auto h-9 w-9 text-muted-foreground" /><h2 className="mt-4 font-display text-xl font-bold">No news available</h2></div> : null}
      {!loading && !error && articles.length > 0 ? <>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => <motion.article key={article._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:shadow-soft-lg">
            <div className="aspect-[16/9] overflow-hidden bg-muted"><img src={article.image} alt={article.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
            <div className="p-5"><span className="flex items-center gap-1 text-xs text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" />{format(new Date(article.createdAt), "d MMM yyyy")}</span><h2 className="mt-2 overflow-hidden font-display text-lg font-bold leading-snug text-foreground" style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}>{article.title}</h2><p className="mt-2 h-[4.5rem] overflow-hidden text-sm leading-6 text-muted-foreground" style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 3 }}>{excerpt(article.content)}</p><Link to={`/news/${article.slug || article._id}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">Read more<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></div>
          </motion.article>)}
        </div>
        {totalPages > 1 ? <div className="mt-10 flex items-center justify-center gap-3"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold disabled:opacity-40"><ChevronLeft className="h-4 w-4" />Previous</button><span className="px-3 text-sm text-muted-foreground">Page <strong className="text-foreground">{page}</strong> of {totalPages}</span><button type="button" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold disabled:opacity-40">Next<ChevronRight className="h-4 w-4" /></button></div> : null}
      </> : null}
    </div>
  </>;
}
