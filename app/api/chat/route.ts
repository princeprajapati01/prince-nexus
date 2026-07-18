import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a helpful, professional, and friendly AI Portfolio Assistant for Prince Prajapati.
Your goal is to answer questions about Prince Prajapati's background, education, projects, skills, and experience.

Here is the context about Prince Prajapati:
- Name: Prince Prajapati
- Professional Title: AI Engineer & Full Stack Developer
- Location: Ahmedabad, Gujarat, India
- Email: contact@princenexus.com / admin@princenexus.com
- Portfolio Website: https://princenexus.com

- About Prince:
  - Passionate about transforming innovative ideas into intelligent systems that solve real-world problems.
  - Specializes in Machine Learning, Deep Learning, Computer Vision, Natural Language Processing (NLP), and scalable AI deployment.
  - Committed to bridging the gap between AI research and practical, valuable, and scalable industry implementation.

- Education:
  1. B.Sc. (CA&IT) from Hemchandracharya North Gujarat University, Patan (2022 – 2025). Completed. Focus on computer science, software engineering, databases, and mathematics.
  2. M.Sc. in Artificial Intelligence & ML from GLS University, Ahmedabad (2025 – Present). In Progress. Deep-diving into advanced AI research, Neural Networks, Deep Learning, Computer Vision, and NLP.

- Projects:
  1. **BillVaultAI** (OCR & Document Intelligence): An AI-powered intelligent document processing system that extracts and analyzes invoice data using YOLOv8, PaddleOCR, FastAPI, Next.js, and PostgreSQL.
  2. **CredMint** (AI Loan Approval & Financial Management System): An AI-powered full-stack fintech platform that digitizes the loan process with KYC verification, automated EMI tracking, and AI investment advice built with React Native, Flask, and MySQL.
  3. **Task Classification System**: A machine learning and NLP-based pipeline utilizing TF-IDF and Scikit-learn to classify user tasks into work, personal, health, etc.

- Key Skills:
  - Programming Languages: Python, JavaScript, TypeScript, SQL, HTML/CSS
  - Machine Learning & AI: Natural Language Processing (NLP), Computer Vision, Scikit-learn, YOLOv8, PaddleOCR, OpenCV, Deep Learning, Neural Networks
  - Frameworks & Web: FastAPI, Next.js, React, Node.js, Express, Tailwind CSS, Prisma
  - Databases: PostgreSQL, MongoDB, SQL Server

Guidelines for responses:
1. Speak about Prince in the third person (e.g., "Prince has built...", "He studied...") or represent yourself as his AI Assistant.
2. Be polite, direct, and keep responses concise (1-3 sentences or bullet points is ideal, avoid very long essays).
3. If asked about something not in this context, politely explain that you can only answer questions related to Prince's professional portfolio, projects, and skills.
4. Keep the tone professional but welcoming.`;

// Local fallback matcher for when no Gemini key is provided
function getLocalResponse(query: string): string {
  const q = query.toLowerCase();

  // 1. Projects
  if (q.includes("project") || q.includes("build") || q.includes("develop") || q.includes("work")) {
    return "Prince has built several intelligent projects:\n1. **BillVaultAI**: An AI-powered invoice parsing platform utilizing YOLOv8 and PaddleOCR.\n2. **CredMint**: An AI loan approval predictor and financial manager.\n3. **Task Classifier**: An NLP pipeline that categorizes tasks using TF-IDF and Scikit-learn.";
  }

  // 2. Specific Project: BillVaultAI
  if (q.includes("billvault") || q.includes("invoice") || q.includes("ocr")) {
    return "BillVaultAI is Prince's flagship project: an OCR-based intelligent document processing system. It extracts layout, items, and totals from invoices using YOLOv8 and PaddleOCR, and features a backend built with FastAPI and PostgreSQL.";
  }

  // 3. Specific Project: CredMint
  if (q.includes("credmint") || q.includes("loan") || q.includes("finance")) {
    return "CredMint is an AI-powered full-stack fintech platform that digitizes the loan process with online KYC verification, automated EMI management, and an AI-driven investment advisor. It is built with React Native (Expo), React, Flask, and MySQL.";
  }

  // 4. Specific Project: Task Classifier
  if (q.includes("task") || q.includes("nlp") || q.includes("classifier") || q.includes("scikit")) {
    return "Prince built a Task Classification System using NLP. It parses raw user text tasks and classifies them into categories like Work, Personal, or Health using TF-IDF feature extraction and Scikit-learn models.";
  }

  // 5. Technologies / Skills
  if (q.includes("technology") || q.includes("skill") || q.includes("language") || q.includes("python") || q.includes("javascript") || q.includes("stack") || q.includes("know")) {
    return "Prince's technology stack includes:\n- **AI & ML**: Python, Scikit-learn, YOLOv8, PaddleOCR, OpenCV, NLP, Deep Learning\n- **Web & Backend**: React, Next.js, Node.js, FastAPI, TypeScript, Tailwind CSS\n- **Databases**: PostgreSQL, MongoDB, Prisma";
  }

  // 6. Education
  if (q.includes("education") || q.includes("study") || q.includes("university") || q.includes("m.sc") || q.includes("b.sc") || q.includes("college") || q.includes("degree")) {
    return "Prince's academic background consists of:\n- **B.Sc. (CA&IT)** from Hemchandracharya North Gujarat University, Patan (2022 - 2025)\n- **M.Sc. in Artificial Intelligence & ML** from GLS University, Ahmedabad (2025 - Present, In Progress)";
  }

  // 7. Why Hire
  if (q.includes("hire") || q.includes("why should we")) {
    return "You should hire Prince because he bridges the gap between machine learning research and full-stack production software. He is skilled in building end-to-end AI applications (like OCR, NLP classifiers, and financial models) and deploying them in beautiful, responsive web systems.";
  }

  // 8. Contact
  if (q.includes("contact") || q.includes("email") || q.includes("reach") || q.includes("hire him")) {
    return "You can reach Prince via email at contact@princenexus.com or admin@princenexus.com, or leave a message through the Contact form on this page.";
  }

  // 9. General Bio (move to end and remove single 'prince' substring match to prevent false positives on specific questions containing 'prince')
  if (q.includes("who is") || q.includes("tell me about") || q.includes("about me") || q.includes("background") || q === "prince" || q.includes("hello") || q.includes("hi ") || q === "hi" || q === "hey") {
    return "Prince Prajapati is an AI Engineer and Full Stack Developer. He specializes in Machine Learning, Deep Learning, NLP, Computer Vision, and full-stack web development, building production-ready intelligent systems.";
  }

  return "I can help you learn more about Prince Prajapati's experience, projects, and skills. Try asking one of the suggested questions or ask about his skills, education, or projects!";
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages history is required" }, { status: 400 });
    }

    const latestMessage = messages[messages.length - 1];
    const userMessageContent = latestMessage?.content || "";

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        // Format history for Gemini API
        // Gemini expects alternate messages of user / model
        const contents = messages.map((msg: { role: string; content: string }) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }]
        }));

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents,
              systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT }]
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const assistantContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (assistantContent) {
            return NextResponse.json({ content: assistantContent });
          }
        } else {
          console.warn("Gemini API call failed, status code:", response.status);
        }
      } catch (err) {
        console.error("Gemini API request error:", err);
      }
    }

    // Fallback if no API key is set or if the API request failed
    const fallbackResponse = getLocalResponse(userMessageContent);
    return NextResponse.json({ content: fallbackResponse });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
