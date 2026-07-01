import laptop1 from "@/assets/product-laptop-1.jpg";
import laptop2 from "@/assets/product-laptop-2.jpg";
import desktop1 from "@/assets/product-desktop-1.jpg";
import monitor1 from "@/assets/product-monitor-1.jpg";
import accessories1 from "@/assets/product-accessories-1.jpg";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: "Laptops" | "Desktops" | "Monitors" | "Accessories";
  processor: string;
  ram: string;
  storage: string;
  gpu: string;
  price: number;
  original: number;
  condition: "Grade A" | "Grade A+" | "Grade B";
  availability: "In stock" | "Low stock" | "Out of stock";
  image: string;
  tagline: string;
  rating: number;
  reviews: number;
};

export const products: Product[] = [
  { id: "dz-thinkpad-x1", name: "ThinkPad X1 Carbon Gen 9", brand: "Lenovo", category: "Laptops", processor: "Intel Core i7-1165G7", ram: "16 GB LPDDR4x", storage: "512 GB NVMe SSD", gpu: "Intel Iris Xe", price: 62999, original: 129999, condition: "Grade A+", availability: "In stock", image: laptop2, tagline: "Business-grade ultrabook. Certified refurbished.", rating: 4.8, reviews: 214 },
  { id: "dz-rog-strix", name: "ROG Strix G15 Gaming", brand: "ASUS", category: "Laptops", processor: "AMD Ryzen 7 5800H", ram: "16 GB DDR4", storage: "1 TB NVMe SSD", gpu: "NVIDIA RTX 3060 6GB", price: 74999, original: 149999, condition: "Grade A", availability: "Low stock", image: laptop1, tagline: "Play harder. For less.", rating: 4.7, reviews: 168 },
  { id: "dz-optiplex-7080", name: "OptiPlex 7080 Micro Desktop", brand: "DELL", category: "Desktops", processor: "Intel Core i5-10500", ram: "16 GB DDR4", storage: "512 GB SSD", gpu: "Intel UHD 630", price: 34999, original: 79999, condition: "Grade A+", availability: "In stock", image: desktop1, tagline: "Small form. Serious work.", rating: 4.9, reviews: 92 },
  { id: "dz-ultrasharp-27", name: "UltraSharp U2721DE 27\"", brand: "DELL", category: "Monitors", processor: "—", ram: "—", storage: "—", gpu: "IPS · QHD · USB-C", price: 22999, original: 49999, condition: "Grade A", availability: "In stock", image: monitor1, tagline: "A calm canvas for real work.", rating: 4.8, reviews: 76 },
  { id: "dz-elitebook-840", name: "EliteBook 840 G7", brand: "HP", category: "Laptops", processor: "Intel Core i5-10310U", ram: "8 GB DDR4", storage: "256 GB SSD", gpu: "Intel UHD", price: 32999, original: 89999, condition: "Grade A", availability: "In stock", image: laptop2, tagline: "Elite build. Everyday price.", rating: 4.6, reviews: 143 },
  { id: "dz-wireless-combo", name: "Wireless Keyboard + Mouse Combo", brand: "HP", category: "Accessories", processor: "—", ram: "—", storage: "—", gpu: "Bluetooth 5.0", price: 1999, original: 3499, condition: "Grade A+", availability: "In stock", image: accessories1, tagline: "Silent switches. All-day battery.", rating: 4.5, reviews: 58 },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);