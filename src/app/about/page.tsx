
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowLeft, Goal, Target } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const FADE_IN_UP_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const missionItems = [
    "በአጥቢያው የሚገኙ ወጣቶች እና ህፃናት ትክክለኛውን ትምህርተ ሃይማኖት እና የአብነት ትምህርትን በማስተማር የቤተክርስትያኗን ዶግማ ፣ትውፊት ፣ ቀኖና ፣ ስርአት እና ታሪክ እንዲያውቁ ማድረግ።",
    "የሰ/ት/ቤቱ አባላት በመናፍቃን እንዳይነጠቁ አስፈላጊውን እንቅስቃሴዎችን ማድረግ ።",
    "የተለያዩ መንፈሳዊ ጉባኤዎችን በማዘጋጀት ለምዕመኑ ቃለ እግዚአብሔርን ማስተማር ።",
    "በቤተክርስቲያኑ ውስጥ በሚደረጉ ልዩ ልዩ መርሀ ግብራት ላይ በመሳተፍ የቤተክርስቲያኑን አገልግሎት ማገዝ ።",
    "አባላቱ በሰ/ት/ቤቱ ውስጥ ባሉ ክፍላት ላይ በመሳተፍ መክሊታቸውን እንዲያተርፉበት ማድረግ።",
    "ሕፃናት እና ወጣቶችን የቤተክርስትያንን ሚስጥራት በማስተማር የሚስጢር ተሳታፊ እንዲሆኑ ማስቻል።"
  ];

  const purposeItems = [
    "መንፈሳዊ ወጣቶች እና ህፃናት የቤተክርስትያንን እና የሀገርን ታሪክ በሚገባ አውቀው በነገረ መለኮት ሃይማኖታዊ ትምህርቶች ተምረው የነገዋን ቤተክትስትያንን እና ሀገርን በሃላፊነት ለመረከብ ብቁዎች ማድረግ።",
    "ከስብከተ ወንጌል ፣ ከካህናት እና ከተለያዩ አባላት ጋር ተባብሮ በመስራት የኢ/ኦ/ተ/ቤ/ክ ሃይማኖት ፣ ስርአት እና ትውፊት ሳይበረዝ እና ሳይለወጥ ከተውልድ ወደ ትውልድ እንዲተላለፍ ማድረግ።",
    "የሰ/ት/ቤቱ አባላት ያላቸውን መክሊት (ፀጋ) ተጠቅመው ቤተክርስትያንን እንዲያገለግሉ ማድረግ።",
    "ወጣቶች እና ህፃናት የሃይማኖታቸውን ስርአት ፣ ትውፊት እና ዶግማ እንዲያውቁ ፤በስነምግባራቸውም የታነጹ እና ክርስትያናዊ ግብረገብ የተላበሱ እንዲሆኑ ማድረግ።",
    'ሃይማኖታቸውን አፅንተው እንዲይዙና እንዲጠብቁ ማድረግ ። 2ኛ ጢሞ 4÷7-8 "ሃይማኖቴን ጠብቄአለሁ ወደ ፊት የፅድቅ አክሊል ተዘጋጅቶልኛል"',
  ];

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground overflow-hidden animated-gradient-bg">
        <header className="relative z-10 flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-primary">ስለ እኛ</h1>
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    ወደ ዋና ገጽ ይመለሱ
                </Link>
            </Button>
        </header>
        <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-8">
            <div className="grid md:grid-cols-2 items-start justify-center gap-8 w-full max-w-5xl">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={FADE_IN_UP_VARIANTS}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                    className="w-full"
                >
                    <Card className="bg-background/80 backdrop-blur-sm shadow-2xl h-full">
                        <CardHeader className="text-center">
                            <CardTitle className="font-headline text-2xl font-bold text-primary">
                                የሰ/ት/ቤቱ ተልዕኮ
                            </CardTitle>
                             <CardDescription className="text-xs pt-2">
                               (ያዘዝኋችኹም ሁሉ እንዲጠብቁ እያስተማራቿቸው ደቀ መዛሙርት አድርጓቸው፤) ማቴ 28-20
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {missionItems.map((item, index) => (
                               <div key={index} className="flex items-start gap-3 p-2 text-sm">
                                   <Target className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                   <span className="text-foreground">{item}</span>
                               </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={FADE_IN_UP_VARIANTS}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
                    className="w-full"
                >
                    <Card className="bg-background/80 backdrop-blur-sm shadow-2xl h-full">
                        <CardHeader className="text-center">
                            <CardTitle className="font-headline text-2xl font-bold text-primary">
                                የሰንበት ት/ት ቤቱ ዓላማ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {purposeItems.map((item, index) => (
                               <div key={index} className="flex items-start gap-3 p-2 text-sm">
                                   <Goal className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                   <span className="text-foreground">{item}</span>
                               </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </main>
    </div>
  );
}
