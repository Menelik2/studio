'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';

const content = {
  en: {
    title: "Bahir Dar St. George's K.S.T. School of Arts Preparation Department",
    description: "A comprehensive application to organize and manage your collection of literary works, including poems, essays, readings, dramas, and articles.",
    dashboardButton: "Go to Dashboard",
    headerTitle: "Digital Library",
    headerSubtitle: "Management System",
    language: "Language"
  },
  am: {
    title: "የባህርዳር ባህርዳር ፈ/ገ/ቅ/ጊዮርጊስ ፈ/ገ/ቅ/ጊዮርጊስ ካ/ሰ/ት ካ/ሰ/ት/ ቤት የማነ ጥበብ ዝግጅት ክፍል",
    description: "ግጥሞችን፣ ወግ ፣ መነባነብ ፤ ጽሑፎችን፣ ድራማዎችን እና መጣጥፎች ጨምሮ የእርስዎን የስነ-ጽሁፍ ስራዎች ስብስብ ለማደራጀት እና ለማስተዳደር አጠቃላይ የሆነ መተግበሪያ።",
    dashboardButton: "ወደ ዳሽቦርድ ይሂዱ",
    headerTitle: "ዲጂታል ቤተ-መጽሐፍት",
    headerSubtitle: "የአስተዳደር ስርዓት",
    language: "ቋንቋ"
  }
};


export default function WelcomePage() {
  const [language, setLanguage] = useState<'en' | 'am'>('am');

  const currentContent = content[language];

  const FADE_IN_UP_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      <div className="absolute inset-0 z-0">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 700 700" width="100%" height="100%" opacity="0.38" className="absolute w-full h-full object-cover">
          <defs>
            <radialGradient id="ffflux-gradient">
              <stop offset="0%" stopColor="hsl(315, 100%, 72%)"></stop>
              <stop offset="100%" stopColor="hsl(227, 100%, 50%)"></stop>
            </radialGradient>
            <filter id="ffflux-filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.003 0.003" numOctaves="1" seed="18" stitchTiles="stitch" x="0%" y="0%" width="100%" height="100%" result="turbulence"></feTurbulence>
              <feGaussianBlur stdDeviation="20 0" x="0%" y="0%" width="100%" height="100%" in="turbulence" edgeMode="duplicate" result="blur"></feGaussianBlur>
              <feBlend mode="screen" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" in2="blur" result="blend"></feBlend>
            </filter>
          </defs>
          <rect width="700" height="700" fill="url(#ffflux-gradient)" filter="url(#ffflux-filter)"></rect>
        </svg>
      </div>
      
      <motion.header 
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, ease: "easeOut" }}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        className="relative z-10 flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold">{currentContent.headerTitle}</h1>
            <p className="text-sm text-muted-foreground">{currentContent.headerSubtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select onValueChange={(value: 'en' | 'am') => setLanguage(value)} defaultValue={language}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={currentContent.language} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="am">አማርኛ</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/login">{currentContent.dashboardButton}</Link>
          </Button>
        </div>
      </motion.header>
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center p-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={FADE_IN_UP_VARIANTS}
          transition={{ duration: 0.6, ease: "easeOut", staggerChildren: 0.2 }}
          className="max-w-4xl bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-xl"
        >
          <motion.h2 
            variants={FADE_IN_UP_VARIANTS}
            className="text-3xl md:text-4xl font-headline font-bold mb-4"
          >
            {currentContent.title}
          </motion.h2>
          <motion.p 
            variants={FADE_IN_UP_VARIANTS}
            className="text-lg md:text-xl text-muted-foreground"
          >
            {currentContent.description}
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}
