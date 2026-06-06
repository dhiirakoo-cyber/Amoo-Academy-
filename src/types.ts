export type Language = "om" | "en" | "both";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: "student" | "admin";
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleOm: string;
  duration: string;
  videoUrl: string; // Embeddable URL like Youtube Embed
  descriptionOm: string;
  descriptionEn: string;
  contentOm: string;
  contentEn: string;
}

export interface Course {
  id: string;
  title: string;
  titleOm: string;
  icon: string; // Lucide icon string name
  bgClass: string;
  borderClass: string;
  textClass: string;
  descriptionOm: string;
  descriptionEn: string;
  price: number;
  lessons: Lesson[];
}

export interface Enrollment {
  enrollmentId: string;
  userId: string;
  userEmail: string;
  courseId: string;
  courseName: string;
  price: number;
  paymentMethod: "CBE" | "Telebirr";
  transactionRef: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: any; // Firestore Timestamp / Date
  updatedAt: any;
}

export interface LessonProgress {
  progressId: string;
  userId: string;
  courseId: string;
  lessonId: string;
  completedAt: any;
}

export const ACADEMY_COURSES: Course[] = [
  {
    id: "video-editing",
    title: "Video Editing",
    titleOm: "Gulaala Viidiyoo (Video Editing)",
    icon: "Video",
    bgClass: "bg-blue-50/50 hover:bg-blue-50/80 transition-colors duration-200",
    borderClass: "border-blue-100",
    textClass: "text-blue-600 bg-blue-100",
    descriptionOm: "Adeemsa guutuu viidiyoo edit gochuu, kutaalee fi bifa bareedaan qopheessuu bilisaan baradhaa. Of danda'anii viidiyoolee TikTok, YouTube fi daldalaa hojjechuu.",
    descriptionEn: "Master professional video editing workflows, cuts, effects, and cinematic storytelling. Learn to build pristine content for TikTok, YouTube, and corporate clients.",
    price: 200,
    lessons: [
      {
        id: "ve-l1",
        title: "Lesson 1: Professional Timeline & Video Cuts",
        titleOm: "Barumsaa 1: Timeline fi Kutaa Viidiyoo Hojjechuu",
        duration: "12 min",
        videoUrl: "https://www.youtube.com/embed/Yp95v_iW_y8", // YouTube placeholder for safe educational value
        descriptionOm: "Kutaa kana keessatti timeline, bifa guutuu fi dandeettii kutaalee adda addaa viidiyoo (cuts) qulqullinaan hojjechuu baranna.",
        descriptionEn: "In this lesson, you will master the editor timeline, ripple edits, slip tools, and how to execute clean jump-cuts and narrative pacing.",
        contentOm: "Timeline fi kutaaleen viidiyoo bu'uura video editing ti. Viidiyoo keessan kutaalee barbaadamaa qofa qabuun, kutaalee dadhaboo ta'an irraa fageessuuf jalqaba irraa barattu. CapCut ykn Premiere Pro irratti raawwadha.",
        contentEn: "The timeline is your canvas. Clean cuts are the foundation of pacing. You will learn here how to trim useless pauses and align primary A-Roll footage before adding supplementary assets."
      },
      {
        id: "ve-l2",
        title: "Lesson 2: Sound Leveling & Dialog Audio Tuning",
        titleOm: "Barumsaa 2: Sagalee fi BGM Gulaaluu",
        duration: "15 min",
        videoUrl: "https://www.youtube.com/embed/coqit3Jb6K4",
        descriptionOm: "Sagaleen viidiyoo keessa jiru kutaawwan 50% murteessaa dha. Sound leveling fi fiilteroota sagalee baradhaa.",
        descriptionEn: "Audio is 50% of the video experience. Gain deep knowledge on volume leveling, noise reduction gates, and mixing custom background tracks.",
        contentOm: "BGM (background music) fi sagaleen nama dubbatu wal madaaluu qaba. Sagalee dubbataa -6dB, background gadi bu'aa -25dB ta'uu qaba.",
        contentEn: "Ensure clear dialogue levels at around -6dB to -12dB while docking ambient background music lower. Apply dynamic compression to smooth sudden vocal changes."
      },
      {
        id: "ve-l3",
        title: "Lesson 3: Cinematic Color Styles & LUTs",
        titleOm: "Barumsaa 3: Halluu Culukkisiisuu (Color Grading)",
        duration: "18 min",
        videoUrl: "https://www.youtube.com/embed/8o9E0fclBw0",
        descriptionOm: "Halluu viidiyoo keessanii bifa cinematic fi bifa daldalaa miidhagaa ta'een qopheessuu (Lumetri Color ykn CapCut Filters fayyadamuun).",
        descriptionEn: "Transform flat raw video profiles into punchy visual experiences using primary exposure adjustments and custom LUT styles.",
        contentOm: "Exposure, Whites fi Blacks sirreessuun halluu viidiyoo bareechina. Bifa gammachuu, dhiphina ykn moodii daldalaa halluun ifatti argisiisa.",
        contentEn: "Color grading controls the narrative mood. Master simple exposure sweeps, white balance highlights, and warm skin tone tracking to look professional."
      }
    ]
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    titleOm: "Dizaayinii Girafiksii (Graphic Design)",
    icon: "Palette",
    bgClass: "bg-purple-50/50 hover:bg-purple-50/80 transition-colors duration-200",
    borderClass: "border-purple-100",
    textClass: "text-purple-600 bg-purple-100",
    descriptionOm: "Bifa, halluu, fi dizaayiniiwwan adda addaa dandeettii daldala keessanii mijeessan uumaa. Logo, poster fi qopheessuu dandeettii argadhaa.",
    descriptionEn: "Create jaw-dropping visuals, brand identities, and commercial layouts from scratch. Learn Canva, Photoshop guidelines, and design principles.",
    price: 200,
    lessons: [
      {
        id: "gd-l1",
        title: "Lesson 1: Visual Hierarchy & Grid Layouts",
        titleOm: "Barumsaa 1: Hierarchy fi Qubee Dizaayinii",
        duration: "10 min",
        videoUrl: "https://www.youtube.com/embed/YqQx75OPRa0",
        descriptionOm: "Dizaayiniin keessan dubbisaaf akka mijaahuuf qubeewwan gurguddoo fi xixinnoo bifa mijaawaan lafa kaahuu baradhaa.",
        descriptionEn: "Learn the golden rule of layouts: positioning visual priorities, sizing typography scales, and incorporating white space beautifully.",
        contentOm: "Visual hierarchy dizaayinii tokko keessatti ija namaa jalqaba maaltu akka argu mureetessa. Wantoota barbaachisoo gurguddeessi, kaan ammoo bifa miidhagaaf gad-qabi.",
        contentEn: "Hierarchy points your audience's focus to what matters first. Utilize absolute size contrasts, rich weights, and negative spacing so layouts feel premium."
      },
      {
        id: "gd-l2",
        title: "Lesson 2: Color Psychology & Brand Palettes",
        titleOm: "Barumsaa 2: Halluu fi Ergaa Isaa (Color Theory)",
        duration: "14 min",
        videoUrl: "https://www.youtube.com/embed/L13UaRshc68",
        descriptionOm: "Hirmaattota daldalaa hawachuuf halluu kam fayyadamuun akkamitti akka miira daldalaa uumu irratti barumsa bal'aa.",
        descriptionEn: "Unlock the emotional impact of major colors and construct balanced 60-30-10 palette rules for cohesive branding layouts.",
        contentOm: "Halluun tokko ifatti daldala keessan uummataan beeksisa. Fkn: Buluun/Blue amanamummaa argisiisa, Amber ammoo saffisa fi sochingii.",
        contentEn: "Colors elicit instant cultural reactions. Combine primary dominants with secondary soft tints, reserving vibrant colors specifically for CTA targets."
      },
      {
        id: "gd-l3",
        title: "Lesson 3: Logo Masterclass & Brand Elements",
        titleOm: "Barumsaa 3: Logo fi Brand Uumuu",
        duration: "20 min",
        videoUrl: "https://www.youtube.com/embed/K8_YV2C247A",
        descriptionOm: "Daldala tokkoof dizaayinii logo salphaa, miidhagaa fi yaadatamuu danda'u dizaayini gochuu fi kaardii daldalaa qopheessuu.",
        descriptionEn: "Learn to design highly memorable, clean, minimalistic logo marks, vector illustrations, and interactive commercial mockups.",
        contentOm: "Logo gaariin haaluma salphaan kan yaadatamuu fi dandeettii daldalaa keessan kan mul'isuu dha. Vector formats mijeessuu dagatin.",
        contentEn: "A logo must be scalable, clear, and contextually rich. Avoid complex textures; opt for elegant geometric emblems and responsive type marks."
      }
    ]
  },
  {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    titleOm: "Dandeettii Promting AI (Prompt Engineering)",
    icon: "Cpu",
    bgClass: "bg-emerald-50/50 hover:bg-emerald-50/80 transition-colors duration-200",
    borderClass: "border-emerald-100",
    textClass: "text-emerald-600 bg-emerald-100",
    descriptionOm: "Humna AI fayyadamanii hojii daldalaa saffisiisuuf bifa qulqulluun ajaja ykn prompt barreessuu baradhaa. ChatGPT fi Gemini saphlaan fayyadamaa.",
    descriptionEn: "Unlock AI's maximum potential by learning structural prompt strategies, multi-tier execution, and workflows that accelerate your productivity.",
    price: 200,
    lessons: [
      {
        id: "pe-l1",
        title: "Lesson 1: Structuring Prompts (Role, Task, Context)",
        titleOm: "Barumsaa 1: Bifa/Siroo Promting Bareedaa",
        duration: "11 min",
        videoUrl: "https://www.youtube.com/embed/0G7jN4G5Sfk",
        descriptionOm: "Ajaja AI-f kenninu bifa qorannoo qabuun: Gahee (Role), Hojii (Task), fi Haala (Context) waliin barreessuu baranna.",
        descriptionEn: "Learn to command AI systems reliably. Build structured patterns by explicitly assigning roles, clear tasks, target constraints, and fine output templates.",
        contentOm: "Gorsa Gaarii: 'Ati dizaayinaridha' (Role), 'Maaloo kaardii qopheessi' (Task), 'Akka kantiinii keenyaaf tolu' (Context). Kanaan bu'aan keessan 10x fooyya'a.",
        contentEn: "Never write sloppy queries. Instead: 1) Act as an expert [Role], 2) Generate [Task], 3) Follow these rules/context [Constraints] to lock down formatting."
      },
      {
        id: "pe-l2",
        title: "Lesson 2: Zero-Shot vs Few-Shot Learning Patterns",
        titleOm: "Barumsaa 2: Fakkeenya Promping (Few-shot Prompting)",
        duration: "13 min",
        videoUrl: "https://www.youtube.com/embed/bSgZfCHqOTo",
        descriptionOm: "AI-f fakkeenya (examples) kennuun akkamitti akka bifa dhumataa sirriitti to'annu bal'inaan barumsichaan gadi fageenyaan ni baranna.",
        descriptionEn: "Understand dynamic context injection. Master zero-shot queries and few-shot formatting lists to make model behaviors consistent.",
        contentOm: "Few-shot prompting jechuun ajaja keessan keessatti fakkeenyoof gurguddoo 2 ykn 3 AI-f laachuudha. Kanaan AI dandeettii hojii keessanii sirriitti fakaachisa.",
        contentEn: "Use Few-shot learning by specifying prefilled input-output pairs inside the prompt. This forces models to strictly mirror the syntax style requested."
      },
      {
        id: "pe-l3",
        title: "Lesson 3: Automating Tasks & Chain of Thought",
        titleOm: "Barumsaa 3: Chain of Thought fi Saafisina Hojii",
        duration: "16 min",
        videoUrl: "https://www.youtube.com/embed/V6N7b8Yn9q8",
        descriptionOm: "Prompt 'Sadarkaa irratti sadarkaa xiinxali' fayyadamanii rakkoolee walxaxoo hojjachuu fi bifa bilisa daldalaa saffisiisuu.",
        descriptionEn: "Improve reasoning accuracy. Master Chain of Thought patterns and build step-by-step guides to solve highly complex tasks.",
        contentOm: "AI-n 'Sadarkaa sadarkaan dubbisi/yaadi' yoo ajajame, xiinxala isaa bifa sirriin deebisa. Daataalee daldalaa to'achuuf dandeettii dabalataa baradhu.",
        contentEn: "Instructing the AI to 'explain your reasoning step-by-step' triggers Chain of Thought paths, dramatically reducing coding errors and logical loops."
      }
    ]
  }
];
