import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Projects
  const billVaultAIData = {
    title: 'BillVaultAI',
    slug: 'billvaultai',
    description: 'AI-powered Intelligent Document Processing platform that extracts and analyzes invoice data using OCR, Computer Vision, and automation workflows.',
    longDescription: 'A comprehensive document intelligence system built for financial technology.',
    problem: 'Businesses struggle with manual invoice processing, leading to errors, delays, and increased operational costs. Traditional OCR solutions lack the intelligence to handle varied document formats and extract meaningful insights.',
    solution: 'BillVaultAI combines state-of-the-art computer vision (YOLO) and OCR (PaddleOCR) with intelligent data extraction pipelines. The system automatically detects document types, extracts structured data, and provides analytics dashboards for financial insights.',
    architecture: 'The system uses a microservices architecture with FastAPI backend, Next.js frontend, and PostgreSQL database. YOLO handles document detection and layout analysis, while PaddleOCR extracts text. A custom NLP pipeline processes and structures the extracted data.',
    features: 'Intelligent document detection, Multi-format invoice processing, Automated data extraction with 95%+ accuracy, Real-time analytics dashboard, RESTful API for integration, Batch processing capabilities',
    technologies: ['YOLO', 'PaddleOCR', 'FastAPI', 'Next.js', 'PostgreSQL', 'OpenCV', 'Python', 'TypeScript'],
    githubUrl: 'https://github.com/princeprajapati/billvaultai',
    demoUrl: 'https://billvaultai.com',
    coverImage: '/projects/billvaultai-cover.jpg',
    challenges: 'The main challenges included handling diverse document formats, maintaining high OCR accuracy across different quality scans, and optimizing processing speed for real-time applications.',
    learnings: 'This project deepened my understanding of computer vision pipelines, OCR optimization techniques, and building production-grade AI systems.',
    results: 'BillVaultAI achieves 95%+ accuracy in data extraction, processes documents 10x faster than manual entry, and has been successfully deployed for invoice processing workflows.',
    featured: true,
    published: true,
    order: 1,
  };

  const billVaultAI = await prisma.project.upsert({
    where: { slug: 'billvaultai' },
    update: billVaultAIData,
    create: billVaultAIData,
  });

  const credMintData = {
    title: 'CredMint',
    slug: 'credmint',
    description: 'AI-Based Loan and Smart Financial Management System that helps users manage finances, track loans, and make informed financial decisions.',
    longDescription: 'A comprehensive financial management platform with AI-powered insights.',
    problem: 'Traditional loan systems are slow, require manual document verification, lack repayment transparency, and provide limited access to affordable financial advice.',
    solution: 'CreditMint is a full-stack fintech platform that digitizes the loan process with online KYC verification, automated EMI management, and an AI-powered investment advisor. It enables users to apply for loans, track repayments, and receive personalized investment suggestions across web and mobile platforms.',
    architecture: `Frontend: React (Admin & User), React Native (Expo)\nBackend: Dual Flask REST APIs (Admin & User)\nDatabase: MySQL with SQLAlchemy\nAI: Ollama (Mistral) + Rule Engine + Yahoo Finance API\nAuthentication: JWT & Biometric Login`,
    features: 'Digital Loan Application & KYC Upload, Admin Loan & Document Verification, Automated EMI Schedule & Penalty Tracking, AI Investment Advisor with Live Stock Data, Credit Score & Loan Tracking Dashboard, Secure JWT and Biometric Authentication',
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Bootstrap', 'AdminLTE', 'React Native', 'Expo', 'Python', 'Flask', 'Flask-JWT-Extended', 'MySQL', 'SQLAlchemy', 'Ollama (Mistral)', 'yfinance', 'Axios', 'Chart.js'],
    githubUrl: 'https://github.com/princeprajapati/credmint',
    demoUrl: 'https://credmint.com',
    coverImage: '/projects/credmint-cover.jpg',
    challenges: `Managing AI conversation flow using a rule engine.\nSynchronizing two Flask backends with a shared database.\nStandardizing KYC uploads across web and mobile platforms.`,
    learnings: `Built a scalable full-stack fintech application.\nIntegrated AI with business logic for reliable recommendations.\nGained experience in REST APIs, JWT authentication, React Native, and MySQL.`,
    results: `🚀 Faster digital loan processing through automated KYC.\n🤖 AI-powered investment recommendations with live market data.\n📊 Transparent EMI tracking and repayment management.\n📱 Seamless experience across Web, Admin Dashboard, and Mobile App.`,
    featured: true,
    published: true,
    order: 2,
  };

  const credMint = await prisma.project.upsert({
    where: { slug: 'credmint' },
    update: credMintData,
    create: credMintData,
  });

  const taskClassificationData = {
    title: 'Task Classification System',
    slug: 'task-classification',
    description: 'Machine Learning and NLP-based system that classifies user tasks into categories such as Work, Personal, and Health using TF-IDF and Scikit-learn.',
    longDescription: 'An intelligent task categorization system powered by machine learning.',
    problem: 'Users waste time manually organizing tasks and struggle to prioritize effectively. Traditional task managers lack intelligent categorization and contextual understanding.',
    solution: 'An ML-based classifier that automatically categorizes tasks using NLP techniques. The system uses TF-IDF for feature extraction and trained classifiers to predict task categories with high accuracy.',
    architecture: 'Python-based system using Scikit-learn for ML pipeline, NLTK for text preprocessing, and Flask for API deployment. The model is trained on a curated dataset of labeled tasks.',
    features: 'Automatic task categorization, Multi-class classification, High accuracy prediction, API endpoint for integration, Model retraining capability',
    technologies: ['Python', 'Scikit-learn', 'NLP', 'TF-IDF', 'Flask', 'NLTK'],
    githubUrl: 'https://github.com/princeprajapati/task-classification',
    demoUrl: null,
    coverImage: '/projects/task-classification-cover.jpg',
    challenges: 'The main challenges were handling ambiguous task descriptions, achieving good accuracy with limited training data, and making the model robust to varied input formats.',
    learnings: 'This project strengthened my understanding of NLP pipelines, feature engineering, and model evaluation techniques.',
    results: 'The system achieves 88% accuracy in task classification and successfully categorizes tasks for improved productivity.',
    featured: true,
    published: true,
    order: 3,
  };

  const taskClassification = await prisma.project.upsert({
    where: { slug: 'task-classification' },
    update: taskClassificationData,
    create: taskClassificationData,
  });

  // Create Skills
  const skills = [
    { name: 'Python', category: 'AI & Machine Learning', level: 95, order: 1 },
    { name: 'Machine Learning', category: 'AI & Machine Learning', level: 90, order: 2 },
    { name: 'NLP', category: 'AI & Machine Learning', level: 85, order: 3 },
    { name: 'Scikit-learn', category: 'AI & Machine Learning', level: 88, order: 4 },
    { name: 'YOLO', category: 'Document Intelligence', level: 85, order: 1 },
    { name: 'PaddleOCR', category: 'Document Intelligence', level: 90, order: 2 },
    { name: 'OpenCV', category: 'Document Intelligence', level: 82, order: 3 },
    { name: 'Computer Vision', category: 'Document Intelligence', level: 80, order: 4 },
    { name: 'FastAPI', category: 'Backend', level: 92, order: 1 },
    { name: 'Node.js', category: 'Backend', level: 88, order: 2 },
    { name: 'PostgreSQL', category: 'Backend', level: 85, order: 3 },
    { name: 'Prisma', category: 'Backend', level: 80, order: 4 },
    { name: 'React', category: 'Frontend', level: 90, order: 1 },
    { name: 'Next.js', category: 'Frontend', level: 92, order: 2 },
    { name: 'TypeScript', category: 'Frontend', level: 88, order: 3 },
    { name: 'Tailwind CSS', category: 'Frontend', level: 95, order: 4 },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { id: `${skill.category}-${skill.name}` },
      update: skill,
      create: {
        id: `${skill.category}-${skill.name}`,
        ...skill,
      },
    });
  }

  // Create Timeline
  const timeline = [
    {
      id: 'timeline-1',
      year: '2024',
      title: 'Started IT Engineering Journey',
      description: 'Began my journey in Information Technology Engineering with a focus on AI and Software Development.',
      order: 1,
    },
    {
      id: 'timeline-2',
      year: '2025',
      title: 'Built CredMint',
      description: 'Developed an AI-Based Loan and Smart Financial Management System with advanced analytics.',
      order: 2,
    },
    {
      id: 'timeline-3',
      year: '2025',
      title: 'Built Task Classification System',
      description: 'Created an ML and NLP-based task classification system using TF-IDF and Scikit-learn.',
      order: 3,
    },
    {
      id: 'timeline-4',
      year: '2026',
      title: 'Building BillVaultAI',
      description: 'Currently developing an intelligent document processing platform with OCR and Computer Vision.',
      order: 4,
    },
    {
      id: 'timeline-5',
      year: 'Future',
      title: 'AI Engineer Role',
      description: 'Seeking opportunities to contribute to cutting-edge AI projects and build intelligent systems at scale.',
      order: 5,
    },
  ];

  for (const item of timeline) {
    await prisma.timeline.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  // Create Settings
  const settings = [
    { key: 'portfolio_title', value: 'PRINCE NEXUS' },
    { key: 'portfolio_tagline', value: 'Building Intelligent Systems for Finance, Language Understanding, and Document Intelligence.' },
    { key: 'github_url', value: 'https://github.com/princeprajapati' },
    { key: 'linkedin_url', value: 'https://linkedin.com/in/princeprajapati' },
    { key: 'contact_email', value: 'prince@princenexus.com' },
  ];

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`Created projects: ${[billVaultAI, credMint, taskClassification].map(p => p.title).join(', ')}`);
  console.log(`Created ${skills.length} skills`);
  console.log(`Created ${timeline.length} timeline items`);
  console.log(`Created ${settings.length} settings`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
