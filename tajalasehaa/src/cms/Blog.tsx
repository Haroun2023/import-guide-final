import { ArrowLeft, CalendarDays, Info, Quote } from "lucide-react";
import { Link } from "wouter";
import { site } from "@/config/site";
import { useBooking } from "@/components/booking/BookingContext";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BookingSection } from "@/components/sections/BookingSection";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import NotFound from "@/pages/NotFound";
import { cmsRuntime } from "./flag";
import { useMediaSrc } from "./media";
import { getState } from "./store";
import type { Block, Post } from "./types";

/**
 * The articles written in the demo CMS: /blog and /blog/<slug>. Only in the
 * browser where the CMS is open; in production they would be prerendered
 * like every other page.
 */

const fmt = (iso: string) => new Date(iso).toLocaleDateString("ar-SA-u-ca-gregory-nu-latn", { day: "numeric", month: "long", year: "numeric" });

function Cover({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  const url = useMediaSrc(src);
  if (!url) return <div className={`bg-gradient-to-br from-brand-100 to-navy-100 ${className}`} aria-hidden />;
  return <img src={url} alt={alt} loading="lazy" decoding="async" className={`object-cover ${className}`} />;
}

function PostCard({ p, i }: { p: Post; i: number }) {
  return (
    <Reveal as="article" delay={(i % 3) * 0.06} className="glow-card group relative flex flex-col overflow-hidden">
      <Cover src={p.cover} alt="" className="aspect-[16/9] w-full transition-transform duration-700 group-hover:scale-[1.03]" />
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold text-brand-700">{p.category}</p>
        <h2 className="mt-2 text-xl font-bold leading-snug">
          <Link href={`/blog/${p.slug}`} className="after:absolute after:inset-0 after:z-[2] after:content-['']">
            {p.title}
          </Link>
        </h2>
        <p className="mt-2 leading-8 text-muted">{p.excerpt}</p>
        <p className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={15} aria-hidden /> {fmt(p.updatedAt)}
          </span>
          <span className="arrow-dot" aria-hidden>
            <ArrowLeft size={16} />
          </span>
        </p>
      </div>
    </Reveal>
  );
}

function BlockView({ b }: { b: Block }) {
  const { openBooking } = useBooking();
  const img = useMediaSrc(b.type === "image" ? b.src : undefined);
  switch (b.type) {
    case "h2":
      return <h2 className="mt-10 text-2xl font-bold">{b.text}</h2>;
    case "h3":
      return <h3 className="mt-8 text-xl font-bold">{b.text}</h3>;
    case "list":
      return (
        <ul className="mt-5 grid gap-2.5">
          {(b.items ?? []).filter(Boolean).map((it) => (
            <li key={it} className="flex gap-3 leading-8">
              <span className="mt-3 size-2 shrink-0 rounded-full bg-brand-500" aria-hidden />
              {it}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="relative mt-8 rounded-2xl bg-brand-50 px-6 py-5 text-lg font-semibold leading-9 text-brand-900 ring-1 ring-brand-100">
          <Quote size={22} className="mb-2 text-brand-400" aria-hidden />
          {b.text}
        </blockquote>
      );
    case "callout":
      return (
        <aside className="mt-8 flex gap-3 rounded-2xl bg-[#fff7e6] px-5 py-4 leading-8 text-[#6b4a10] ring-1 ring-[#f2dfb3]">
          <Info size={20} className="mt-1.5 shrink-0" aria-hidden />
          <p>{b.text}</p>
        </aside>
      );
    case "image":
      return img ? (
        <figure className="mt-8">
          <img src={img} alt={b.alt ?? ""} loading="lazy" className="w-full rounded-2xl" />
          {b.text ? <figcaption className="mt-2 text-center text-sm text-muted">{b.text}</figcaption> : null}
        </figure>
      ) : null;
    case "cta":
      return (
        <div className="mt-10 flex flex-col items-start gap-4 rounded-[1.5rem] bg-deep-radial p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-bold">تريد أن نفهم حالتك معًا؟</p>
          <button type="button" className="btn btn-leaf btn-shine" onClick={() => openBooking({ placement: "blog-cta" })}>
            {b.text || "احجز تقييمك"} <ArrowLeft size={18} aria-hidden />
          </button>
        </div>
      );
    default:
      return <p className="mt-5 text-[1.08rem] leading-9 text-ink/85">{b.text}</p>;
  }
}

function BlogIndex({ posts }: { posts: Post[] }) {
  return (
    <SiteLayout>
      <PageHero
        crumbs={[{ href: "/blog", label: "المقالات" }]}
        eyebrow="من فريقنا"
        title={"نصائح تفهم بها ألمك\n*قبل أن تزورنا*"}
        lead="شروح قصيرة يكتبها أخصائيونا عن الألم والتأهيل والزيارة الأولى. معلومات عامة لا تغني عن التقييم."
        booking={{ placement: "blog:hero" }}
      />
      <section className="py-16 md:py-24" aria-label="المقالات">
        <div className="container-x grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <PostCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </section>
      <BookingSection />
    </SiteLayout>
  );
}

function BlogPost({ post, others }: { post: Post; others: Post[] }) {
  return (
    <SiteLayout>
      <PageHero crumbs={[{ href: "/blog", label: "المقالات" }, { href: `/blog/${post.slug}`, label: post.title }]} eyebrow={post.category} title={post.title} lead={post.excerpt} booking={{ placement: `blog:${post.slug}` }}>
        <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/60">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={15} aria-hidden /> {fmt(post.updatedAt)}
          </span>
          <span>{post.author}</span>
        </p>
      </PageHero>
      <article className="py-14 md:py-20">
        <div className="container-x max-w-3xl">
          {post.cover ? <Cover src={post.cover} alt="" className="mb-4 aspect-[16/9] w-full rounded-[1.5rem]" /> : null}
          {post.blocks.map((b) => (
            <BlockView key={b.id} b={b} />
          ))}
          <p className="mt-10 border-t border-mist-200 pt-5 text-sm leading-7 text-muted">
            هذه معلومات عامة من فريق {site.name}، ولا تغني عن تقييم أخصائي يعرف حالتك.
          </p>
        </div>
      </article>
      {others.length ? (
        <section className="pb-16" aria-labelledby="more-posts">
          <div className="container-x">
            <h2 id="more-posts" className="text-2xl font-bold">
              اقرأ أيضًا
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {others.slice(0, 3).map((p, i) => (
                <PostCard key={p.id} p={p} i={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <BookingSection />
    </SiteLayout>
  );
}

export default function Blog({ slug }: { slug?: string }) {
  if (!cmsRuntime.active) return <NotFound />;
  const all = getState().posts;
  const posts = all.filter((p) => p.status === "published").sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  if (!slug) return posts.length ? <BlogIndex posts={posts} /> : <NotFound />;
  // ?preview=<id> shows a draft from the editor
  const preview = new URLSearchParams(location.search).get("preview");
  const post = posts.find((p) => p.slug === slug) ?? all.find((p) => p.id === preview);
  if (!post) return <NotFound />;
  return (
    <>
      {post.status !== "published" ? (
        <div className="fixed inset-x-0 bottom-0 z-[70] bg-[#8a5a12] px-4 py-2 text-center text-sm font-semibold text-white">معاينة مسودة: لا يراها الزوار حتى تُنشر</div>
      ) : null}
      <BlogPost post={post} others={posts.filter((p) => p.id !== post.id)} />
    </>
  );
}
