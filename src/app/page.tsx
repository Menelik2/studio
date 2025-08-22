'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Phone, User } from 'lucide-react';
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
    title: "የባህርዳር ፈ/ገ/ቅ/ጊዮርጊስ ካ/ሰ/ት/ ቤት የኪነ ጥበብ ዝግጅት ክፍል",
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
    <div className="relative flex flex-col min-h-screen bg-background text-foreground overflow-hidden animated-gradient-bg">
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
            className="text-3xl md:text-4xl font-headline font-bold mb-4 bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent [text-shadow:2px_2px_4px_rgba(0,0,0,0.2)]"
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
      <motion.footer 
        initial="hidden"
        animate="visible"
        variants={FADE_IN_UP_VARIANTS}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        className="relative z-10 p-4 text-center text-sm text-muted-foreground bg-background/80 backdrop-blur-sm"
      >
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Developer: Menelik Admasu</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>Phone: 0918006053</span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
