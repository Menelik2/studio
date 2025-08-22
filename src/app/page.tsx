
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Phone, User, ArrowRight, BookCheck, Target, Goal, ShieldCheck, Info, Library, CalendarDays, ScrollText, MoreHorizontal, User as UserIcon, Wind, Heart } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


const content = {
  en: {
    title: "Bahir Dar St. George's K.S.T. School of Arts Preparation Department",
    description: "A comprehensive application to organize and manage your collection of literary works, including poems, essays, readings, dramas, and articles.",
    dashboardButton: "Go to Dashboard",
    headerTitle: "Digital Library",
    headerSubtitle: "Management System",
    language: "Language",
    aboutUs: "About Us",
  },
  am: {
    title: "የባህርዳር ፈ/ገ/ቅ/ጊዮርጊስ ካ/ሰ/ት/ ቤት የኪነ ጥበብ ዝግጅት ክፍል",
    description: "ግጥሞችን፣ ወግ ፣ መነባነብ ፤ ጽሑፎችን፣ ድራማዎችን እና መጣጥፎች ጨምሮ የእርስዎን የስነ-ጽሁፍ ስራዎች ስብስብ ለማደራጀት እና ለማስተዳደር አጠቃላይ የሆነ መተግበሪያ።",
    dashboardButton: "ወደ ዳሽቦርድ ይሂዱ",
    headerTitle: "ዲጂታል ቤተ-መጽሐፍት",
    headerSubtitle: "የአስተዳደር ስርዓት",
    language: "ቋንቋ",
    aboutUs: "ስለ እኛ",
  }
};


export default function WelcomePage() {
  const [language, setLanguage] = useState<'en' | 'am'>('am');

  const currentContent = content[language];

  const FADE_IN_UP_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  const cardItems = [
    "አዕማደ ምስጢር",
    "ነገረ ሃይማኖት መግቢያ",
    "የነገረ ድኅነት መግቢያ",
    "እና ሌሎችም"
  ];
  
  const sacramentsItems = [
    "ምሥጢረ ጥምቀት፡- መንፈሳዊ ልደት",
    "ምሥጢረ ሜሮን፡- መንፈሳዊ ዕድገት /በመንፈስ ቅዱስ መበልጸግ/",
    "ምሥጢረ ቁርባን፡- መንፈሳዊ ምግብ /የዘለአለም ሕይወት/",
    "ምሥጢረ ንስሐ፡- መንፈሳዊ ድኅነት /ሥርየተ ኀጢአት/",
    "ምሥጢረ ተክሊል፡- የጋብቻ ጽናት",
    "ምሥጢረ ክህነት፡- የማሠርና የመፍታት ፣ የማስተማር ፣ የማደስ ፣ የማጥመቅ ፣ ሥልጣን /መንፈሳዊ ኃይል/",
    "ምሥጢረ ቀንዲል፡- ሥጋዊና መንፈሳዊ ኃይል /ከበሽታ መፈወስ/",
  ];

  const fivePillarsItems = [
      "ምሥጢረ ሥላሴ (የሥላሴን አንድነትና ሦስትነት)",
      "ምሥጢረ ሥጋዌ (የአምላክን ሰው መሆን)",
      "ምሥጢረ ጥምቀት (ስለ ዳግም መወለድ)",
      "ምሥጢረ ቁርባን (ስለ ክርስቶስ ሥጋና ደም)",
      "ምሥጢረ ትንሣኤ ሙታን (ስለ ዳግም ምጽዓት)",
  ];

  const holidaysList = [
      "1.ልደታ፣ ራጉኤል፣ ኤሊያስ",
      "2.ታድዮስ ሐዋርያ፣ ኢዮብ ጻድቅ",
      "3.በዓታ ማርያም፣ ዜና ማርቆስ፣ ነአኩቶ ለአብ",
      "4. ዮሐንስ ነጎድጓድ",
      "5.ጴጥሮስ ወጳውሎስ፣ አቡነ ገብረ መንፈስ ቅዱስ",
      "***",
      "6. ኢየሱስ፣ ቁስቋም፣ አርሴማ",
      "7.ሥላሴ፣ ፊሊሞና、 አብላዮናስ",
      "8.ማቴዎስ፣ ዮልያኖስ፣ አባ ኪሮስ",
      "9. ቶማስ ሐዋሪያ፣ እንድርያስ ሐዋርያ、 አውሳብዮስ、 አባ ሰማእታት",
      "10.በዓለ መስቀሉ ለእግዚእን",
      "***",
      "11.ሃና ወያቄም፣ ፋሲለደስ ሰማዕት",
      "12. ቅዱስ ሚካኤል、 ክርስቶስ ሠምራ",
      "13.እግዚአብሔር ለአብ፣ ቅዱስ ሩፋኤል ሊቀ መላእክት",
      "14.አባ አረጋዊ፣ አባ ገብር ክርስቶስ፣ ድምጥያኖስ ሰማዕት",
      "15. ቂርቆስና ኢየሉጣ، ሰልፋኮስ",
      "***",
      "16.ኪዳነ ምሕረት، ሚካኤል ጳጳስ",
      "17.ቅዱስ እስጢፋኖስ፣ ሉቃስ ዘዓም ብርሃን",
      "18.ፊሊጶስ ሐዋርያ، ኤስድሮስ ሰማዕት، ኤዎስጣጤዎስ ሰማዕት",
      "19.ቅዱስ ገብርኤል፣ አርቃዲዎስ",
      "20. ጽንሰታ ለማርያም፣ ነብዩ ኤልሳ፣ ሐጌ ነብይ፣ አባ ሰላም መተርጉም",
      "***",
      "21.በዓለ እግዚእትነ ማርያም",
      "22.ቅዱስ ዑራኤል፣ ያዕቆብ ምሥራቃዊ፣ ድቅስዮስ",
      "23. ቅዱስ ጊዮርጊስ፣ ለጊዮስ ሰማዕት",
      "24.አቡነ ተክለ ሃይማኖት",
      "25.መርቆሬዎስ، አኒፍኖስ",
      "***",
      "26. ሆሴዕ ነብይ، ሳዶቅ ሰማዕት",
      "27.መድኃኔዓለም، ሕዝቂያስ ነብይ، አባ ዮሐንስ",
      "28.አማኑኤል، ቆስጠንጢኖስ، አብርሃም",
      "29.በዓል ወልድ، ሰሙኤል ዘወጋግ",
      "30.መጥምቁ ዮሐንስ، ማርቆስ ወንጌላዊ"
  ];
  
  const trinityItems = [
    {
      title: "አብ",
      icon: Heart,
      content: [
        "ወላዲ (አባት)፣ አሥራፂ",
        "አይወለድም፣ አይሰርፅም",
        "አብ፡ አባት፣ ልብ፣ 'ከእኛ በላይ ያለው' አምላክ"
      ]
    },
    {
      title: "ወልድ",
      icon: UserIcon,
      content: [
        "ተወላዲ (ልጅ)",
        "አይወልድም፣ አያሰርፅም፣ አይሰርጽም",
        "ወልድ፡ ልጅ(የባሕርይ)፣ ቃል፣ 'ከእኛ ጋር ያለው'አምላክ፣ የእግዚአብሔር ክንዱ፣ የአብ ቀኝ እጅ"
      ]
    },
    {
      title: "መንፈስ ቅዱስ",
      icon: Wind,
      content: [
        "ሠራፂ (የሠረፀ)",
        "አይወለድም፣ አይወልድም፣ አያሰርፅም",
        "መንፈስ ቅዱስ፡ እስትንፋስ፣ “በውስጣችን ያለው'አምላክ፣ የአብ ምክሩ"
      ]
    }
  ];


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
            <Button asChild variant="link" className="text-foreground">
                <Link href="/about">{currentContent.aboutUs}</Link>
            </Button>
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
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-8">
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={FADE_IN_UP_VARIANTS}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="w-full max-w-4xl bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-2xl text-center self-center mb-12"
        >
            <motion.h2 
            variants={FADE_IN_UP_VARIANTS}
            className="text-3xl md:text-4xl font-headline font-bold bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent [text-shadow:2px_2px_4px_rgba(0,0,0,0.2)] mb-4"
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 items-start justify-center gap-8 w-full max-w-6xl">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={FADE_IN_UP_VARIANTS}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
                className="w-full group"
            >
                <Card className="bg-background/80 backdrop-blur-sm shadow-2xl h-80 overflow-hidden relative transition-all duration-300 ease-in-out group-hover:h-auto">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-2xl font-bold text-primary">
                            ኦርቶዶክሳዊ ትምህርተ ሃይማኖት (ዶግማ)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {cardItems.map((item, index) => (
                           <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                               <BookCheck className="h-5 w-5 text-primary" />
                               <span className="font-medium text-foreground">{item}</span>
                           </div>
                        ))}
                    </CardContent>
                    <CardFooter className="justify-center">
                        <p className="text-sm text-muted-foreground font-semibold">ማንኛውም ሰው መሳተፍ ይችላል</p>
                    </CardFooter>
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent group-hover:hidden" />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground text-sm group-hover:hidden">
                        <MoreHorizontal className="h-4 w-4" />
                        <span>Read More</span>
                    </div>
                </Card>
            </motion.div>
            
            <motion.div
                initial="hidden"
                animate="visible"
                variants={FADE_IN_UP_VARIANTS}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
                className="w-full group"
            >
                <Card className="bg-background/80 backdrop-blur-sm shadow-2xl h-80 overflow-hidden relative transition-all duration-300 ease-in-out group-hover:h-auto">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-2xl font-bold text-primary">
                            ሰባቱ ምሥጢራተ ቤተ ክርስቲያን
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {sacramentsItems.map((item, index) => (
                           <div key={index} className="flex items-start gap-3 p-2 text-sm">
                               <ShieldCheck className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                               <span className="text-foreground">{item}</span>
                           </div>
                        ))}
                    </CardContent>
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent group-hover:hidden" />
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground text-sm group-hover:hidden">
                        <MoreHorizontal className="h-4 w-4" />
                        <span>Read More</span>
                    </div>
                </Card>
            </motion.div>

             <motion.div
                initial="hidden"
                animate="visible"
                variants={FADE_IN_UP_VARIANTS}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.8 }}
                className="w-full group"
            >
                <Card className="bg-background/80 backdrop-blur-sm shadow-2xl h-80 overflow-hidden relative transition-all duration-300 ease-in-out group-hover:h-auto">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-2xl font-bold text-primary">
                            አምስቱ አዕማደ ሚስጥራት
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-foreground text-center space-y-2">
                            <p>አምድ ፤ ማለት ምሰሶ ማለት ሲሆን አእማድ ማለት ምሰሶዎች ማለት ነው ። ቤት በአምድ (በኮለም) እንደሚፀና ፤ ሃይማኖትም በነዚህ ምሥጢራት ተጠቃሎ ይገለጻል ፤ ምዕመናንም እነዚህን ምሥጢራት በመማር ፀንተው ይኖራሉ ።</p>
                        </div>
                         {fivePillarsItems.map((item, index) => (
                           <div key={index} className="flex items-start gap-3 p-2 text-sm">
                               <Library className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                               <span className="text-foreground">{item}</span>
                           </div>
                        ))}
                    </CardContent>
                     <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent group-hover:hidden" />
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground text-sm group-hover:hidden">
                        <MoreHorizontal className="h-4 w-4" />
                        <span>Read More</span>
                    </div>
                </Card>
            </motion.div>
             <motion.div
                initial="hidden"
                animate="visible"
                variants={FADE_IN_UP_VARIANTS}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 1.0 }}
                className="w-full group"
            >
                <Card className="bg-background/80 backdrop-blur-sm shadow-2xl h-80 overflow-hidden relative transition-all duration-300 ease-in-out group-hover:h-auto">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-2xl font-bold text-primary">
                           ከ1 እስክ 30 ያሉ የኢትዮጵያ ኦርቶዶክስ በዓላት!!!
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-full">
                             <div className="space-y-2 text-sm">
                                {holidaysList.map((item, index) => (
                                <React.Fragment key={index}>
                                    {item === '***' ? (
                                        <Separator className="my-2" />
                                    ) : (
                                    <div className="flex items-start gap-3 p-1">
                                        <CalendarDays className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                        <span className="text-foreground">{item}</span>
                                    </div>
                                    )}
                                </React.Fragment>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                     <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent group-hover:hidden" />
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground text-sm group-hover:hidden">
                        <MoreHorizontal className="h-4 w-4" />
                        <span>Read More</span>
                    </div>
                </Card>
            </motion.div>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={FADE_IN_UP_VARIANTS}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 1.2 }}
                className="w-full group md:col-span-2 lg:col-span-1"
            >
                <Card className="bg-background/80 backdrop-blur-sm shadow-2xl h-80 overflow-hidden relative transition-all duration-300 ease-in-out group-hover:h-auto">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-2xl font-bold text-primary">
                            ምሥጢረ ሥላሴ
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                           {trinityItems.map((item, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>
                                  <div className="flex items-center gap-2">
                                    <item.icon className="h-4 w-4 text-primary"/>
                                    {item.title}
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-2 pl-4">
                                    {item.content.map((line, lineIndex) => (
                                        <li key={lineIndex} className="text-sm text-foreground">{line}</li>
                                    ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                           ))}
                        </Accordion>
                    </CardContent>
                     <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent group-hover:hidden" />
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground text-sm group-hover:hidden">
                        <MoreHorizontal className="h-4 w-4" />
                        <span>Read More</span>
                    </div>
                </Card>
            </motion.div>
        </div>
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
