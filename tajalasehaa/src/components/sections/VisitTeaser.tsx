import { ArrowLeft, Clock, MapPin, Navigation } from "lucide-react";
import { Link } from "wouter";
import { centerPhotos } from "@/config/content";
import { site } from "@/config/site";
import { trackEngagement } from "@/lib/tracking";
import { Reveal } from "@/components/ui/Reveal";

/** Home: one real photo of the center, the address and the way there. */
export function VisitTeaser() {
  const branch = site.branches[0];
  const photo = centerPhotos.find((p) => p.id === "hall") ?? centerPhotos[0];
  if (!branch || !photo) return null;
  return (
    <section className="py-20 md:py-24" aria-labelledby="visit-teaser-title">
      <div className="container-x">
        <Reveal className="card grid overflow-hidden p-0 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative min-h-64 bg-mist-200">
            <img
              src={`/photos/${photo.id}-960.webp`}
              srcSet={photo.widths.map((w) => `/photos/${photo.id}-${w}.webp ${w}w`).join(", ")}
              sizes="(min-width: 1024px) 55vw, 100vw"
              width={4}
              height={3}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
          <div className="p-7 sm:p-10">
            <p className="eyebrow">زُر مركزنا</p>
            <h2 id="visit-teaser-title" className="mt-3 text-2xl font-bold md:text-3xl">
              مكان هادئ في {site.city}، وفريق ينتظرك
            </h2>
            <p className="mt-3 leading-8 text-muted">صالات انتظار مريحة، وخصوصية في غرف العلاج، واستقبال يرتّب معك كل شيء قبل أن تصل.</p>
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
