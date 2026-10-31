// Sample data mirroring the Figma frames. Replace with Supabase queries as you wire pages up.
import type { Currency } from "./format";

export type Product = {
  id: string; slug: string; sku: string; name: string; brand: string; category: string;
  price: number; currency: Currency; stock: number; reorderLevel: number; warranty: string; summary: string;
};

export const products: Product[] = [
  { id: "p1", slug: "bastion-x200-enterprise-firewall", sku: "AE-FW-X200", name: "Bastion X200 Enterprise Firewall", brand: "AegisEdge", category: "Cybersecurity", price: 2499, currency: "USD", stock: 24, reorderLevel: 8, warranty: "3-year warranty", summary: "12 Gbps firewall, 8 × GbE, 1U rack" },
  { id: "p2", slug: "pulse-v120-sensor", sku: "PL-SN-V120", name: "Pulse V120 Sensor", brand: "Pulse", category: "Traffic management", price: 619, currency: "USD", stock: 3, reorderLevel: 10, warranty: "2-year warranty", summary: "Radar vehicle detection sensor" },
  { id: "p3", slug: "shield-n400-ips", sku: "SH-IPS-N400", name: "Shield N400 IPS", brand: "Shield", category: "Cybersecurity", price: 3850, currency: "USD", stock: 12, reorderLevel: 5, warranty: "3-year warranty", summary: "Intrusion prevention appliance" },
  { id: "p4", slug: "axis-t800-signal-controller", sku: "AX-SC-T800", name: "Axis T800 Signal Controller", brand: "Axis", category: "Traffic management", price: 8950, currency: "USD", stock: 6, reorderLevel: 4, warranty: "5-year warranty", summary: "Adaptive traffic signal controller" },
];

export const orders = [
  { number: "SS-10482", customer: "Westbridge Systems", date: "Oct 21, 2026", total: 2698.92, currency: "USD" as Currency, payment: "Paid", status: "Confirmed" },
  { number: "SS-10481", customer: "Northgate IT", date: "Oct 21, 2026", total: 4156.92, currency: "USD" as Currency, payment: "Paid", status: "Processing" },
  { number: "SS-10480", customer: "City of Brookhaven", date: "Oct 20, 2026", total: 7441.2, currency: "USD" as Currency, payment: "Paid", status: "Shipped" },
];

export const quotes = [
  { number: "QT-2061", title: "North corridor signal upgrade", total: 35800, currency: "USD" as Currency, status: "Ready to review", validUntil: "Nov 3, 2026" },
];
