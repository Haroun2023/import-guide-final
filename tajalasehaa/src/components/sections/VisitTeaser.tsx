import { ArrowLeft, Clock, MapPin, Navigation } from "lucide-react";
import { Link } from "wouter";
import { centerPhotos } from "@/config/content";
import { copy, fill } from "@/config/copy";
import { site } from "@/config/site";
import { trackEngagement } from "@/lib/tracking";
import { Note } from "@/components/ui/Note";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { Reveal } from "@/components/ui/Reveal";

/** The prints on the wall: which photo, its handwritten caption and how it hangs. */
const SNAPS = [
  { id: "storefront", caption: "ابحث عن هذه اللافتة", hang: "rotate-[2.5deg]" },
  { id: "reception", caption: "هنا نستقبلك", hang: "-rotate-[3deg] sm:mt-6 lg:mt-8" },
  { id: "lounge", caption: "ركن هادئ حتى موعدك", hang: "-rotate-[1deg] col-span-2 mx-auto w-[58%] sm:col-span-1 sm:mt-2 sm:w-auto lg:col-span-2 lg:-mt-4 lg:w-[56%]" },
];

/** Home: real photos of the center pinned like prints, the address and the way there. */
export function VisitTeaser() {
  const branch = site.branches[0];
  const snaps = SNAPS.flatMap((s) => {
    const photo = centerPhotos.find((p) => p.id === s.id);
    return photo ? [{ ...s, photo }] : [];
  });
  if (!branch || !snaps.length) return null;
  return (
    <section className="py-20 md:py-24" aria-labelledby="visit-teaser-title">
      <div className="container-x">
        <Reveal className="card grid overflow-hidden p-0 lg:grid-cols-[1.2fr_1fr]">
          <div className="bg-[linear-gradient(135deg,var(--color-mist-100),var(--color-brand-50))] px-5 pb-8 pt-5 sm:px-8 lg:py-8">
            <Note arrow="curve" className="relative z-10 mb-4 me-12 ms-auto w-fit" arrowClassName="-scale-y-100 top-4 right-[-3.1rem]">
              صور حقيقية من مركزنا
            </Note>
            <div className="grid grid-cols-2 items-start gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-2">
              {snaps.map(({ id, caption, hang, photo }) => (
                <figure key={id} className={`polaroid hover:rotate-0 hover:-translate-y-1 ${hang}`}>
                  <img
                    src={`/photos/${id}-480.webp`}
                    srcSet={photo.widths.map((w) => `/photos/${id}-${w}.webp ${w}w`).join(", ")}
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 30vw, 46vw"
                    width={4}
                    height={3}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full rounded-[2px] object-cover"
                  />
                  <figcaption>{caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="p-7 sm:p-10">
            <p className="eyebrow">{copy.visit.eyebrow}</p>
            <h2 id="visit-teaser-title" className="mt-3 text-2xl font-bold md:text-3xl">
              {fill(copy.visit.title, { city: site.city })}
            </h2>
            <p className="mt-3 leading-8 text-muted">{fill(copy.visit.lead, { city: site.city })}</p>
            <ul className="mt-6 grid gap-3.5">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="mt-1 shrink-0 text-brand-600" aria-hidden />
                <span>{branch.address}</span>
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
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={branch.directionsUrl ?? branch.mapsUrl}
                target="_blank"
                rel="noopener"
                className="btn btn-primary"
                onClick={() => trackEngagement("get_directions", { placement: "visit-teaser" })}
              >
                <Navigation size={18} aria-hidden /> خذني إلى المركز
              </a>
              <Link href="/visit" className="btn btn-ghost">
                صور المركز وطرق التواصل <ArrowLeft size={18} aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
