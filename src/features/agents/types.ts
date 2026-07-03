// Mirrors the backend agent snapshot.
export type Agent = {
  id: string; // e.g. "A-1"
  organization_id: string;
  name: string;
  description: string;
  vm_type: string | null; // template name, e.g. "base" | "developer"
  active: boolean;
  vm_id: string | null;
  guest_ip: string | null;
};
