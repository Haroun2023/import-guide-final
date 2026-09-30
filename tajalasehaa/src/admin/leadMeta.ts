import type { Lead, LeadStatus } from "@/cms/types";
import type { Tone } from "./ui";

export const STATUS: Record<LeadStatus, { label: string; tone: Tone }> = {
  new: { label: "جديد", tone: "blue" },
  contacted: { label: "تواصلنا", tone: "amber" },
  booked: { label: "موعد مؤكد", tone: "green" },
  attended: { label: "حضر", tone: "dark" },
  no_answer: { label: "لم يرد", tone: "gray" },
  cancelled: { label: "ألغى", tone: "red" },
};
export const STATUS_ORDER: LeadStatus[] = ["new", "contacted", "booked", "attended", "no_answer", "cancelled"];

export const isReal = (l: Lead) => !l.spam;
export const displayPhone = (e164: string) =>
  e164.startsWith("+966") ? `0${e164.slice(4, 6)} ${e164.slice(6, 9)} ${e164.slice(9)}` : e164.replace(/^\+(\d{1,3})(\d{3})(\d+)/, "+$1 $2 $3");

/** First reply time in minutes (from the first note), when there is one. */
export const firstReply = (l: Lead) => (l.notes[0] ? (new Date(l.notes[0].at).getTime() - new Date(l.createdAt).getTime()) / 60000 : null);
