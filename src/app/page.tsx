
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

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-image-main opacity-20 blur-sm"></div>
      <div className="absolute inset-0 bg-grid"></div>
      
      <header className="relative flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
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
      </header>
      <main className="relative flex-grow flex flex-col items-center justify-center text-center p-8">
        <div className="max-w-4xl bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
            {currentContent.title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            {currentContent.description}
          </p>
        </div>
      </main>
    </div>
  );
}

