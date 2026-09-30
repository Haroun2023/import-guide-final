import { Clock, MapPin, Navigation } from "lucide-react";
import { centerPhotos, type CenterPhoto } from "@/config/content";
import { site } from "@/config/site";
import { trackEngagement } from "@/lib/tracking";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

function Photo({ photo, sizes, className = "", eager = false }: { photo: CenterPhoto; sizes: string; className?: string; eager?: boolean }) {
  const largest = photo.widths[photo.widths.length - 1];
  return (
    <figure className={`group relative overflow-hidden rounded-[1.25rem] bg-mist-200 ${className}`}>
      <img
        src={`/photos/${photo.id}-${photo.widths.includes(960) ? 960 : largest}.webp`}
        srcSet={photo.widths.map((w) => `/photos/${photo.id}-${w}.webp ${w}w`).join(", ")}
        sizes={sizes}
        width={4}
        height={3}
        alt={photo.alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep/75 to-transparent px-4 pb-3 pt-10 text-sm font-medium text-white">
        {photo.caption}
      </figcaption>
    </figure>
  );
}

/** «زُر مركزنا»: real photos of the Madinah center + how to get there. */
export function Visit({ heading = true }: { heading?: boolean }) {
  const branch = site.branches[0];
  const [hero, ...rest] = centerPhotos;
  const grid = rest.slice(0, 4);
  return (
    <section id="visit" className={heading ? "py-20 md:py-28" : "py-12 md:py-16"} aria-labelledby={heading ? "visit-title" : undefined} aria-label={heading ? undefined : "صور المركز والوصول إليه"}>
      {heading ? (
        <div className="container-x">
          <SectionHeading
            id="visit-title"
            eyebrow="زُر مركزنا"
            title={"مكان هادئ\n*تستريح فيه من أول خطوة*"}
            lead={`صور حقيقية من مركزنا في ${site.city}: استقبال واسع، وصالات انتظار مريحة، وفريق يرتّب معك موعدك قبل أن تصل.`}
          />
        </div>
      ) : null}

      {/* Phones: swipeable strip */}
      <ul className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:px-6 md:hidden" aria-label="صور المركز">
        {centerPhotos.map((p) => (
          <li key={p.id} className="w-[82%] shrink-0 snap-center">
            <Photo photo={p} sizes="82vw" className="aspect-[4/3]" />
          </li>
        ))}
      </ul>

      <div className="container-x mt-6 grid gap-5 md:mt-10 lg:grid-cols-[1.7fr_1fr]">
        {/* Tablets/desktop: bento grid */}
        <Reveal className="hidden gap-3 md:grid md:h-[24rem] md:grid-cols-4 md:grid-rows-2 lg:h-auto lg:min-h-[26rem]">
          <Photo photo={hero} sizes="(min-width: 1024px) 40vw, 50vw" className="col-span-2 row-span-2" />
          {grid.map((p) => (
            <Photo key={p.id} photo={p} sizes="(min-width: 1024px) 20vw, 25vw" />
          ))}
        </Reveal>

        {branch ? (
          <Reveal delay={0.08} className="card flex flex-col justify-between gap-6 p-6 sm:p-7">
            <div>
              <h3 className="text-xl font-bold">كيف تصل إلينا؟</h3>
              <ul className="mt-5 grid gap-4 text-[0.98rem]">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="mt-1 shrink-0 text-brand-600" aria-hidden />
                  <span>
                    <strong className="block">{branch.name}</strong>
                    <span className="text-muted">{branch.address}</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={20} className="mt-1 shrink-0 text-brand-600" aria-hidden />
                  <span>
                    {site.hours.map((h) => (
                      <span key={h.days} className="block">
                        <strong>{h.days}:</strong> <span className="text-muted">{h.time}</span>
                      </span>
                    ))}
                    <OpenStatus className="mt-1.5 text-sm text-brand-700" />
                  </span>
                </li>
              </ul>
            </div>
            <div className="grid gap-3">
              <a
                href={branch.directionsUrl ?? branch.mapsUrl}
                target="_blank"
                rel="noopener"
                className="btn btn-primary"
                onClick={() => trackEngagement("get_directions", { placement: "visit" })}
              >
                <Navigation size={18} aria-hidden /> خذني إلى المركز (خرائط Google)
              </a>
              <a href={branch.mapsUrl} target="_blank" rel="noopener" className="btn btn-ghost" onClick={() => trackEngagement("open_map", { placement: "visit" })}>
                <MapPin size={18} aria-hidden /> صفحة المركز على الخريطة
              </a>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
