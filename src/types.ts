export interface Slide {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  caption: string;
}

export interface AppConfig {
  recipientName: string;
  senderName: string;
  birthDate: string;
  slides: Slide[];
  whatsappNumber: string;
  musicType: "youtube" | "direct";
  musicUrl: string; // Direct audio URL or YouTube Video ID
}
