import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Landmark, LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "../../components/layout/Seo";
import { getPublicSchemes, type PublicScheme } from "../../services/scheme.service";

const excerpt = (html: string) => {
  const documentNode = new DOMParser().parseFromString(html, "text/html");
  return (documentNode.body.textContent || "").replace(/\s+/g, " ").trim();
};

export function AnudanYojana() {
  const [schemes, setSchemes] = useState<PublicScheme[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getPublicSchemes(page, 9)
      .then(({ schemes: records, pagination }) => {
        if (!active) return;
        setSchemes(records);
        setTotal(pagination?.total ?? records.length);
        setTotalPages(pagination?.totalPages ?? 1);
      })
      .catch((reason) => active && setError(reason?.response?.data?.message || "Unable to load schemes right now."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [page]);

  return <div className="min-h-[70vh] bg-muted/20">
    <Seo title="Anudan Yojana" description="Explore government agriculture schemes, benefits, eligibility, and application guidance." />
    <div className="border-b border-border bg-primary/5">
      <div className="container py-10">
        <p className="text-sm font-semibold text-primary">Farmer support</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold">Anudan Yojana</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Explore government support schemes, their benefits, eligibility, and application process.</p>
        {!loading && !error ? <p className="mt-4 text-xs font-medium text-muted-foreground">{total} schemes available</p> : null}
      </div>
    </div>

    <div className="container py-10">
      {loading ? <div className="grid min-h-60 place-items-center"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div> : null}
      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">{error}</div> : null}
      {!loading && !error && schemes.length === 0 ? <div className="rounded-2xl border border-border bg-card p-12 text-center"><Landmark className="mx-auto h-9 w-9 text-muted-foreground" /><h2 className="mt-4 font-display text-xl font-bold">No schemes available</h2><p className="mt-2 text-sm text-muted-foreground">New schemes will appear here when published.</p></div> : null}
      {!loading && !error && schemes.length > 0 ? <>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {schemes.map((scheme) => <article key={scheme._id} className="group flex min-h-64 flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
            <div className="flex min-h-20 items-center gap-3 rounded-xl bg-primary/[0.06] p-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-primary/15 bg-card text-primary shadow-sm"><Landmark className="h-[18px] w-[18px]" /></span>
              <h2 className="overflow-hidden font-display text-lg font-bold leading-6" style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}>{scheme.title}</h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">{scheme.tags?.slice(0, 4).map((tag) => <span key={tag} className="rounded-full border border-primary/25 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary">{tag}</span>)}</div>
            <p className="mt-3 h-12 overflow-hidden text-sm leading-6 text-muted-foreground" style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}>{excerpt(scheme.content)}</p>
            <Link to={`/anudan-yojana/${scheme.slug || scheme._id}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-primary">View details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
          </article>)}
        </div>
        {totalPages > 1 ? <div className="mt-10 flex items-center justify-center gap-3">
          <button type="button" disabled={page <= 1} onClick={() => { setPage((value) => value - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold disabled:opacity-40"><ChevronLeft className="h-4 w-4" />Previous</button>
          <span className="px-3 text-sm text-muted-foreground">Page <strong className="text-foreground">{page}</strong> of {totalPages}</span>
          <button type="button" disabled={page >= totalPages} onClick={() => { setPage((value) => value + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold disabled:opacity-40">Next<ChevronRight className="h-4 w-4" /></button>
        </div> : null}
      </> : null}
    </div>
  </div>;
}
