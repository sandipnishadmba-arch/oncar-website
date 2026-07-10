export interface ServiceArea {
  area: string;
  pincode: string;
}

export const SERVICE_AREAS: ServiceArea[] = [
  { area: "Adajan", pincode: "395009" },
  { area: "Vesu", pincode: "395007" },
  { area: "Piplod", pincode: "395007" },
  { area: "City Light", pincode: "395007" },
  { area: "Athwa", pincode: "395001" },
  { area: "Nanpura", pincode: "395001" },
  { area: "Ghod Dod Road", pincode: "395007" },
  { area: "Bhatar", pincode: "395017" },
  { area: "Althan", pincode: "395017" },
  { area: "Udhna", pincode: "394210" },
  { area: "Pandesara", pincode: "394221" },
  { area: "Limbayat", pincode: "395012" },
  { area: "Katargam", pincode: "395004" },
  { area: "Dabholi", pincode: "395004" },
  { area: "Singanpor", pincode: "395004" },
  { area: "Amroli", pincode: "394107" },
  { area: "Mota Varachha", pincode: "394101" },
  { area: "Nana Varachha", pincode: "395006" },
  { area: "Kapodra", pincode: "395006" },
  { area: "Sarthana", pincode: "395006" },
  { area: "Rander", pincode: "395005" },
  { area: "Jahangirpura", pincode: "395005" },
  { area: "Pal", pincode: "395009" },
  { area: "VIP Road", pincode: "395007" },
  { area: "Dumas Road", pincode: "395007" },
  { area: "Sachin", pincode: "394230" },
  { area: "Hazira", pincode: "394270" },
  { area: "Kadodara", pincode: "394327" },
  { area: "Palsana", pincode: "394315" },
  { area: "Olpad", pincode: "394540" },
  { area: "Masma", pincode: "394540" },
  { area: "Barbodhan", pincode: "394540" },
  { area: "Ichhapore", pincode: "394510" },
  { area: "Magdalla", pincode: "395007" },
  { area: "Mora Bhagal", pincode: "395005" },
  { area: "Bhimrad", pincode: "395007" },
  { area: "Vankaneda", pincode: "394105" },
  { area: "Kamrej", pincode: "394185" },
  { area: "Kosad", pincode: "394107" },
  { area: "Chalthan", pincode: "394305" },
  { area: "Parvat Patiya", pincode: "395010" },
  { area: "Godadara", pincode: "395010" },
  { area: "Bamroli", pincode: "394220" },
  { area: "Saroli", pincode: "395010" },
  { area: "Kumbharia", pincode: "395010" },
  { area: "Laskana", pincode: "395006" },
  { area: "Delad", pincode: "394327" },
  { area: "Bhestan", pincode: "395023" }
];

export function isSupportedPincode(pincode: string): boolean {
  const clean = pincode.replace(/\D/g, "");
  return SERVICE_AREAS.some((item) => item.pincode === clean);
}

export function findAreaByPincode(pincode: string): string | null {
  const clean = pincode.replace(/\D/g, "");
  const match = SERVICE_AREAS.find((item) => item.pincode === clean);
  return match ? match.area : null;
}

export function findPincodeByArea(areaName: string): string | null {
  const match = SERVICE_AREAS.find(
    (item) => item.area.toLowerCase() === areaName.toLowerCase()
  );
  return match ? match.pincode : null;
}
