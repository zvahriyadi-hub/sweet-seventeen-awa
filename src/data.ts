import { AppConfig } from "./types";

export const DEFAULT_CONFIG: AppConfig = {
  recipientName: "Sayang",
  senderName: "Aku yang Menyayangimu",
  birthDate: "2009-06-09", // Standard sweet 17 calculation based on 2026 local time
  whatsappNumber: "+6281234567890",
  musicType: "youtube",
  musicUrl: "QYh6mYI-mG8", // Bazzi - Beautiful (Official Audio)
  slides: [
    {
      id: 1,
      title: "Happy Sweet 17th Birthday! 🎉",
      description: "Happy 17th birthday, sayang!🤍 CIEEEE yang udah bisa bikin KTP, aku gabisa ledekin kamu lagi deh, semoga di tahun ini dan seterusnya kamu dapet hal hal baik terus yaa sayang, AKU HAPPY sekali karena di usia kamu yang ke 17 ini aku bisa rayain ulang tahun pacal aku buat pertama kalinya, Di usia kamu yang sekarang udah masuk \"Sweet Seventeen\", aku doain semoga hari hari kamu selalu dipenuhi kebahagiaan, kesehatan, dan kebaikan yang terus menerus datang ke hidup kamu, dan semua mimpi dan wishlist yang kamu doakan dan cita citakan bisa perlahan jadi kenyataan suatua hari nanti ya sayang💗.",
      imageUrl: "/src/assets/images/regenerated_image_1781025159122.jpg",
      caption: "Selamat menyambut dunia baru dengan senyum tercantikmu! 🌸"
    },
    {
      id: 2,
      title: "My Fav Human💞",
      description: "Buat aku, kamu bukan cuma pasangan, tapi juga salah satu hal terbaik yang pernah hadir di hidup aku. Cara kamu peduli, selalu ada buat aku, selalu support aku dan masih banyak hal dari kamu yang selalu berhasil bikin hari hari aku kerasa lebih ringan. Makasih ya sayang karena udah tumbuh jadi pribadi yang hebat,baik dan dewasa yang pernah hadir di hidup aku tanpa disengaja dan aku harap kamu selalu bisa ngasih energi positif ke orang orang di sekitar kamu dengan cara kamu sendiri. 🤍",
      imageUrl: "/src/assets/images/regenerated_image_1781025410418.jpg",
      caption: "Melihatmu bahagia adalah definisi kedamaian bagiku. ❤️"
    },
    {
      id: 3,
      title: "My Safest Place 💖",
      description: "Happy Birthday My Safest Place, aku cuma mau bilang makasih karena kamu udah hadir di hidup aku. Maaci karena tanpa sadar kamu selalu jadi tempat paling nyaman buat aku cerita, ngeluh, ketawa, bahkan diem sekalipun.\n\nDi umur yang baru ini aku harap kamu nggak terlalu banyak overthinking yaa sayang. Jangan sering nganggap kalo kamu belum cukup buat aku, karena kehadiran kamu bener bener bikin hidup aku jadi lebih colorfull dan aku bangga sama kamu untuk semua hal yang berhasil kamu lewatin.",
      imageUrl: "/src/assets/images/regenerated_image_1781026769986.jpg",
      caption: "Every memory with you is my absolute favorite. 💫"
    },
    {
      id: 4,
      title: "Doa Dan Harapan Aku Buat Kamu",
      description: "Di usia baru ini aku berharap kamu selalu punya keberanian buat nyoba hal hal baru, tetap kuat walau keadaan ga sesuai harapan kamu, dan terus jalan ke semua tujuan yang kamu impikan yaa sayang. Aku disini selalu support kamu dalam kondisi apapun itu, im always here for u sayang, Jangan pernah ragu sama diri sendiri, karena aku yakin kamu punya kemampuan yang lebih besar dari yang kamu kira. Dan apa pun yang terjadi nanti, aku akan selalu jadi orang yang percaya sama kamu dan selalu ngedoain semua hal hal baik buat kamu ya cantik. 🤍",
      imageUrl: "/src/assets/images/regenerated_image_1781025029328.jpg",
      caption: "Selamanya bersamamu, merajut mimpi-mimpi indah kita. 🌸"
    }
  ]
};

// Pack and unpack URL safety configurations
export function encodeConfigToUrl(config: AppConfig): string {
  try {
    const compactObj = {
      n: config.recipientName,
      s: config.senderName,
      w: config.whatsappNumber,
      m: config.musicUrl,
      mt: config.musicType,
      sl: config.slides.map(s => ({
        t: s.title,
        d: s.description,
        i: s.imageUrl,
        c: s.caption
      }))
    };
    const jsonStr = JSON.stringify(compactObj);
    return btoa(unescape(encodeURIComponent(jsonStr)));
  } catch (e) {
    console.error("Failed to encode URL config:", e);
    return "";
  }
}

export function migrateConfig(config: AppConfig): AppConfig {
  if (!config || !config.slides || !Array.isArray(config.slides)) {
    return config;
  }
  
  const migratedSlides = config.slides.map(slide => {
    let imageUrl = slide.imageUrl;
    if (slide.id === 1 && imageUrl.includes("pastel_cake")) {
      imageUrl = "/src/assets/images/regenerated_image_1781025159122.jpg";
    } else if (slide.id === 2 && imageUrl.includes("cute_couple")) {
      imageUrl = "/src/assets/images/regenerated_image_1781025410418.jpg";
    } else if (slide.id === 3 && (imageUrl.includes("love_letter") || imageUrl.includes("regenerated_image_1781024898341.jpg") || imageUrl.includes("scout_hijab_girl_1781026420148.png") || imageUrl.includes("regenerated_image_1781026769986.jpg"))) {
      imageUrl = "/src/assets/images/regenerated_image_1781026769986.jpg";
    } else if (slide.id === 4 && (imageUrl.includes("unsplash") || imageUrl.includes("1781025159122.jpg"))) {
      imageUrl = "/src/assets/images/regenerated_image_1781025029328.jpg";
    }
    return {
      ...slide,
      imageUrl
    };
  });

  return {
    ...config,
    slides: migratedSlides
  };
}

export function decodeConfigFromUrl(base64Str: string): AppConfig | null {
  try {
    if (!base64Str) return null;
    const jsonStr = decodeURIComponent(escape(atob(base64Str)));
    const compactObj = JSON.parse(jsonStr);
    
    const decoded: AppConfig = {
      recipientName: compactObj.n || DEFAULT_CONFIG.recipientName,
      senderName: compactObj.s || DEFAULT_CONFIG.senderName,
      birthDate: DEFAULT_CONFIG.birthDate,
      whatsappNumber: compactObj.w || DEFAULT_CONFIG.whatsappNumber,
      musicType: compactObj.mt || "youtube",
      musicUrl: compactObj.m || DEFAULT_CONFIG.musicUrl,
      slides: compactObj.sl ? compactObj.sl.map((s: any, idx: number) => ({
        id: idx + 1,
        title: s.t,
        description: s.d,
        imageUrl: s.i,
        caption: s.c
      })) : DEFAULT_CONFIG.slides
    };
    return migrateConfig(decoded);
  } catch (e) {
    console.error("Failed to decode URL config:", e);
    return null;
  }
}
