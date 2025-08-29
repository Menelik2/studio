
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Phone, User, BookCheck, Target, Goal, ShieldCheck, Info, Library, CalendarDays, ScrollText, MoreHorizontal, User as UserIcon, Wind, Heart, Clock } from 'lucide-react';
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
      "6. ኢየሱስ፣ ቁስቋም、 አርሴማ",
      "7.ሥላሴ፣ ፊሊሞና、 አብላዮናስ",
      "8.ማቴዎስ፣ ዮልያኖስ、 አባ ኪሮስ",
      "9. ቶማስ ሐዋሪያ፣ እንድርያስ ሐዋርያ፣ አውሳብዮስ、 አባ ሰማእታት",
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
      "28.አማኑኤል፣ ቆስጠንጢኖስ፣ አብርሃም",
      "29.በዓል ወልድ، ሰሙኤል ዘወጋግ",
      "30.መጥምቁ ዮሐንስ፣ ማርቆስ ወንጌላዊ"
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

  const proclaimedFasts = [
    {
      title: "፩ኛ- ጾመ ነቢያት/ የነቢያት",
      content: "ከጌታችን ከአምላካችንና ከመድኃኒታችን ከኢየሱስ ክርስቶስ የልደት ቀን በፊት ባሉት አርባ ቀናት ውስጥየሚጾም ነው።"
    },
    {
      title: "፪ኛ- ጾመ ነነዌ/የነነዌ ጾም/",
      content: "ሕዝበ ነነዌ የጾሙት እና መልስ ያገኙበት ለሦስት ቀናት የሚጾም ነው።"
    },
    {
      title: "፫ኛ- ዐብይ ጾም/ጾመ ኢየሱስ/",
      content: "አንዲሁም ሁዳዴ ወይንም ጾመ አርባ ይባላል።ጌታችን አምላካችንና መድኃኒታችን ኢየሱስ ክርስቶስ በገዳመ ቆሮንቶስ ለአርባ ቀናት የጾመው ነው። ከጾሙ መጀመርያ ያለው ሳምንት ጾመ ሕርቃል እንዲሁም የመጨረሻው ሳምንትን ሰሞነ ሕማማትን ጨምሮ ለስምንት ሳምንታት የሚጾም ነው።\nየዐቢይ ጾም ሳምንታት\n1ኛው እሁድ ዘወረደ /ጾመ ሕርቃል / 2ኛው እሁድ ቅድስት 3ኛው እሁድ ምኩራብ 4ኛው እሁድ መጻጉዕ 5ኛው እሁድ ደብረዘይት 6ኛው እሁድ ገብርሔር 7ኛው እሁድ ኒቆዲሞስ 8ኛው እሁድ ሆሳዕና 9ኛው እሁድ ትንሳኤ ናቸው።"
    },
    {
      title: "፬ኛ- ጾመ ሐዋርያት/የሐዋርያት ጾም/",
      content: "ከበዐለ ጰራቅሊጦስ ማግስት ከሰኞ ቀን ጀምሮ የሐዋርያው ቅዱስ ጴጥሮስና የሐዋርያው ቅዱስ ጳውሎስ የመታሠቢያ በዓል እስከሚከበርበት ሐምሌ ፭ ቀን ድረስ ይጾማል። ይኽ ጾም እንደ ሌሎቹ አጽዋማት የተወሰነ ቁጥር የለውም። የትንሣኤ በዓል በመጀመርያው የሚያዝያ ወር ቀናት ሲውል እና በመጨረሻው የሚያዝያ ወራት ሲውል ቁጥሩ ከፍ እና ዝቅ ይላል። ሆኖም ግን በጣም ከፍ ሲል ለ፵፱ ቀናት በጣም ዝቅ ሲል ለ፲ ፭ ቀናት የሚጾም ነው።"
    },
    {
      title: "፭ኛ- ጾመ ፍልሰታ/ጾመ ማርያም/",
      content: "የእመቤታችን የትንሣኤዋ በዓል የሚከበርበት፤ ለሁለት ሳምንታት ያህል የሚፆም ነው።"
    },
    {
      title: "፮ኛ- ጾመ ድኅነት፡- /ረቡዕና ዓርብ/",
      content: "ከትንሣኤ እስከ በዓለ ጰራቅሊጦስ ባሉት ረቡዕና ዓርብ ውጪ ዓመቱን በሙሉ ባሉት ረቡዕና ዓርብቀናት ይጾማል። ምክንያቱም ጌታን ለመያዝ ረቡዕ መክረው ዓርብ ስለሰቀሉት መከራውን ለማሰብየሚጾም ነው።"
    },
    {
      title: "፯ኛ- ጾመ ገሐድ/ጾመ ጋድ/",
      content: "በየዓመቱ ከበዓለ ጥምቀት በፊት ያለው ቀን ይጾምና የጥምቀት ዕለት ግን ረቡዕም ሆነ አርብ ቢውል አይጾምም። ስለዚህም ጾመ ገሐድ ለአንድ ቀን የሚጾም ነው።"
    }
  ];

  const prayerTimes = [
    {
        title: "ነግኅ (ማለዳ ጧት)፡-(6:00)",
        content: "መዝ.5÷3፡- ‹‹በማለዳ ድማፄን ትሰማለህበማለዳ በፊትኽ እቆማለሁ›› ብሎ ነብየ እግዚአብሔር ለጸሎት እናለምሰጋና በፊቱ እንደቆመ ሁሉ አምላካችን እግዚአብሔር ሌሊቱንበሰላም እና በምህረት ጠብቆ የማለዳውን ብርሃን እንድናይ ስለረዳንእናመሰግነዋለን፡፡"
    },
    {
        title: "ሠለስት (ሦስት ሰዓት)፡-(9:00)",
        content: "በዚህ ሰዓት የሁላችንም እናት ሔዋን የተፈጠረችበት ሰዓት ነውና(ዘፍ.2÷21-24) እናቶቻችን ፣የትዳር አጋሮች፣እህቶች፣ሴት ልጆች የማግኘታችን መሠረት ነውና በዚህ ሰዓት እግዚአብሔር አምላካችንእናታችን ሔዋንን ስለፈጠረልን እናመሰግነዋለን፡፡"
    },
    {
        title: "ቀትር (ስድስት ሰዓት)፡- (12:00)",
        content: "በዚህ ሰዓት ፀሐይ ስትበረታ ሰውነታችን ሲዝል አዕምሮአችን ይሰንፋልእና አጋንንት ይበረታሉ፡፡ በዚህም ምክንያት ሰውነታችንን አበርትተንህሊናችንን ሰብስበን ወደ እግዚአብሔር እንጸልያለን፡፡(መዝ.54÷17፤90÷6)"
    },
    {
        title: "ተሰዓት (ዘጠኝ ሰዓት) (15:00)",
        content: "በዚህ ሰዓት ቅዱሳን መላዕክት የሰው ልጅ የጸለየውን፣ጸሎት፣ልመና፣እጣን፣የሠራውን ሥራ ሁሉ የሚያሳርጉበት ሰዓት ነው፡፡ (የሐዋ.10÷3)"
    },
    {
        title: "ሠርክ (ዐሥራ አንድ ሰዓት)(17:00)",
        content: "በዚህ ሰዓት ላይ ሰው ሁሉ ሥራ ሠርቶ ከሥራው የሚያርፍበት እናዋጋውን የሚቀበልበት ሰዓት ሲሆን እኛም ምግባር ቱሩፋት ሰርተ ዋጋችንን ከአምላካችን የምንቀበልበት ሰዓት ነው፡፡ (ማቴ.20÷1-16)"
    },
    {
        title: "ንዋም (የመኝታ ሰዓት) (19:00)",
        content: "በዚህ ሰዓት ቀኑን ሙሉ ስንወጣ ስንወርድ የጠበቀንን አምላክ አመሰግነን፤ ዳግመኛም የሌሊቱን ሰዓት ባርኩ የሰላም እንቅልፍ ይሰጠን ዘንድ ለጸሎት እንቆማለን፡፡"
    },
    {
        title: "መንፈቀ ሌሊት (0:00)",
        content: "ይህ ሰዓት ታላቅ ሰዓት ነው፡፡ አምላካችን ጌታችን መድኃኒታችን ኢየሱስ ክርስቶስ የተወለደበት፣ የተጠመቀበት፣ ከሙታን መካከል ተለይቶ የተነሣበት ዳግመኛም በህያዋን እና በሙታን ለመፍረድ የሚመጣባት ሠዓት ስለሆነች ይህን ሁሉ በማሰብ እና እግዚአብሔር ለእኛ ሲል ያደረገዉን ነገር ሁሉ በማሰብ የሚጸለይበት ሠዓት ነው። -(ሉቃ.2÷7-8፤3÷21.ዮሐ.20÷1፤ማቴ.25÷6፤ማር.13÷35)"
    }
  ];


  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground overflow-hidden animated-gradient-bg">
      <motion.header 
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, ease: "easeOut" }}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-b bg-background/80 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 self-start md:self-center">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold">{currentContent.headerTitle}</h1>
            <p className="text-sm text-muted-foreground">{currentContent.headerSubtitle}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 items-start justify-center gap-8 w-full max-w-7xl">
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
                className="w-full group"
            >
                <Card className="bg-background/80 backdrop-blur-sm shadow-2xl h-80 overflow-hidden relative transition-all duration-300 ease-in-out group-hover:h-auto">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-2xl font-bold text-primary">
                            ምሥጢረ ሥላሴ
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="text-sm text-foreground space-y-3 mb-4">
                            <h3 className="font-bold text-center text-base">ሥላሴ</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold">አንድነት</h4>
                                    <ul className="list-disc list-inside text-xs">
                                        <li>በባሕርይ</li>
                                        <li>በመለኮት</li>
                                        <li>በአምላክነት</li>
                                        <li>በሕልውና</li>
                                        <li>በፈቃድ</li>
                                        <li>በፈጣሪነት</li>
                                        <li>በአገዛዝ</li>
                                        <li>በሥልጣን</li>
                                    </ul>
                                    <p className="text-xs mt-1">(ዘዳ 6:4, ኢሳ 44:6, ኢሳ 43:1, ዮሐ 10:30)</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">ሦስትነት</h4>
                                     <ul className="list-disc list-inside text-xs">
                                        <li>በአካል</li>
                                        <li>በስም</li>
                                        <li>በግብር</li>
                                    </ul>
                                     <p className="text-xs mt-1">(ማቴ 28:19, 1ኛ ቆሮ 12:4-6, ሮሜ 14:17)</p>
                                </div>
                            </div>
                         </div>
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
            <motion.div
                initial="hidden"
                animate="visible"
                variants={FADE_IN_UP_VARIANTS}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 1.4 }}
                className="w-full group"
            >
                <Card className="bg-background/80 backdrop-blur-sm shadow-2xl h-80 overflow-hidden relative transition-all duration-300 ease-in-out group-hover:h-auto">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-2xl font-bold text-primary">
                            ፯ቱ የአዋጅ አጽዋማት
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-foreground mb-4">በቅድስት አገራችን በኢትዮጵያ መላው የኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ምእመናን በማኅበር የሚጾማቸው ሰባት የአዋጅ አጽዋማት አሉ።</p>
                        <Accordion type="single" collapsible className="w-full">
                           {proclaimedFasts.map((item, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>
                                  <div className="flex items-center gap-2">
                                    <ScrollText className="h-4 w-4 text-primary"/>
                                    {item.title}
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-sm text-foreground whitespace-pre-wrap">{item.content}</p>
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
             <motion.div
                initial="hidden"
                animate="visible"
                variants={FADE_IN_UP_VARIANTS}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 1.6 }}
                className="w-full group"
            >
                <Card className="bg-background/80 backdrop-blur-sm shadow-2xl h-80 overflow-hidden relative transition-all duration-300 ease-in-out group-hover:h-auto">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-2xl font-bold text-primary">
                            ፯ቱ የጸሎት ጊዜያት
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-foreground mb-4">በቅድስት ቤተ ክርስቲያን ሥርዓት መሠረት ሰባት የጸሎት ጊዜያት አሉ፡፡</p>
                        <Accordion type="single" collapsible className="w-full">
                           {prayerTimes.map((item, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary"/>
                                    {item.title}
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-sm text-foreground whitespace-pre-wrap">{item.content}</p>
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
