// ======================================
// CampusOS - Gemini / Groq AI Service (v3.0 - Adaptive Conversational Engine)
// ======================================

const AIService = {
    workerUrl: "https://old-dew-2ff0.vaibhav3278.workers.dev",

    /**
     * Core Gateway to Cloudflare Worker Proxy
     */
    async generateContent(prompt) {
        try {
            const response = await fetch(this.workerUrl, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({ prompt: prompt })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || errorData.error || `HTTP ${response.status}: Error from proxy`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("AIService Error:", error);
            throw error;
        }
    },

    // ======================================
    // 1. NOTES & LECTURE GENERATOR
    // ======================================
    async generateSmartNote(topicOrText, mode = "notes") {
        let systemContext = "";

        if (mode === "learn") {
            systemContext = `Provide a comprehensive, deep-dive explanation for deep conceptual understanding. Use clear analogies, step-by-step breakdowns, and core fundamentals.`;
        } else if (mode === "exam") {
            systemContext = `Focus strictly on high-yield exam preparation. Output ONLY key definitions, critical formulas/equations, high-priority bullet points, and expected exam questions with brief answers.`;
        } else if (mode === "casestudy") {
            systemContext = `Generate a structured, professional Academic Case Study based on "${topicOrText}".
Format the content with the following exact sections:
1. Executive Summary & Problem Statement
2. Background & Key Stakeholders
3. Core Challenges & Data / Operational Dilemma
4. Strategic Solution & Decision Framework
5. Key Takeaways & Lessons Learned`;
        } else if (mode === "questions") {
            systemContext = `Generate a curated question bank of Important & Frequently Asked Exam Questions for "${topicOrText}".
Format the content with:
1. Short-Answer Concept Questions (with concise high-scoring answer keys)
2. Long-Answer Analytical / Scenario Questions (with structured evaluation points)
3. Common Pitfalls & Mistakes Students Make in this topic`;
        } else {
            systemContext = `Generate concise, well-structured academic lecture notes using clear bullet points, key takeaways, and structured sections.`;
        }

        const prompt = `
            You are an expert academic tutor and university professor.
            Input/Topic: "${topicOrText}".
            Instruction: ${systemContext}

            Respond strictly in valid JSON format with no markdown wrappers or extra conversational text. Use this exact schema:
            {
                "title": "A short clear title (max 8 words)",
                "category": "One relevant academic category",
                "content": "The structured formatted text output according to the requested mode."
            }
        `;

        try {
            const rawResponse = await this.generateContent(prompt);
            const cleanedJson = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();
            return JSON.parse(cleanedJson);
        } catch (error) {
            console.error("Failed to generate smart note:", error);
            throw error;
        }
    },

    // ======================================
    // 2. MBB CASE STUDY SOLVER
    // ======================================
    async solveCaseStudy(caseText) {
        const prompt = `
            You are a senior partner at a top-tier management consulting firm (MBB) and an elite business school professor.
            Analyze and solve this business dilemma or case study:
            "${caseText}"

            Rules:
            1. Apply rigorous strategic thinking and root-cause problem breakdown.
            2. Choose the single most effective business framework (e.g., MECE Issue Tree, Porter's 5 Forces, 4Ps, Unit Economics, or Root-Cause 5 Whys).
            3. Structure the solution across a phased tactical rollout: Immediate Triage (0-30 days), Process Optimization (30-90 days), and Long-Term Competitive Advantage.
            4. Keep insights sharp, non-generic, and focused on business risk and ROI.

            Respond STRICTLY in valid JSON format with no markdown formatting (\`\`\`json or backticks) or outer commentary. Use this exact schema:
            {
                "title": "Executive Case Title (max 8 words)",
                "problem": "Precise root-cause problem statement identifying the primary operational, financial, or strategic bottleneck (max 3 sentences).",
                "framework": "Strategic Framework Used (e.g., MECE Tree & Unit Economics)",
                "solution": "Comprehensive, phased implementation plan with actionable metrics and operational milestones.",
                "insights": [
                    "Strategic Takeaway 1: Critical business or market reality.",
                    "Strategic Takeaway 2: Core downside risk and mitigation tactic.",
                    "Strategic Takeaway 3: Long-term defensible moat."
                ]
            }
        `;

        try {
            const rawResponse = await this.generateContent(prompt);
            const cleanedJson = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();
            return JSON.parse(cleanedJson);
        } catch (error) {
            console.error("Failed to solve case study:", error);
            throw error;
        }
    },

    // ======================================
    // 3. STUDY ROADMAP PLANNER
    // ======================================
    async generateStudyPlan(subject, days) {
        const prompt = `
            You are an expert academic and professional skills planner.
            Create a structured ${days}-day roadmap and study plan for a student who wants to master or earn certificates in: "${subject}".

            REQUIREMENTS:
            1. Every task must have a valid, completely FREE public resource URL.
            2. Only use 100% free platforms (e.g., freeCodeCamp, MIT OpenCourseWare, YouTube full courses, Class Central Free Certifications, Coursera/edX Free Audit links, MDN Web Docs, LeetCode Free, Kaggle Courses, or roadmap.sh).
            3. Do NOT provide paid course links or links behind a paywall.

            Respond STRICTLY in valid JSON format with no markdown formatting or extra text. Use this exact schema:
            [
                { 
                    "day": "Day 1", 
                    "task": "Actionable task description", 
                    "resourceLink": "https://www.freecodecamp.org" 
                },
                { 
                    "day": "Day 2", 
                    "task": "Actionable task description", 
                    "resourceLink": "https://www.coursera.org" 
                }
            ]
        `;

        try {
            const rawResponse = await this.generateContent(prompt);
            const cleanedJson = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();
            return JSON.parse(cleanedJson);
        } catch (error) {
            console.error("Failed to generate study plan:", error);
            throw error;
        }
    },

    // ======================================
    // 4. PLACEMENT PREPARATION (RESUME / QUESTIONS)
    // ======================================
    async generatePlacementPrep(rawInput, type = "resume") {
        let prompt = "";
        
        if (type === "resume") {
            prompt = `
You are an executive campus placement director and corporate recruiter.
Task: Transform this rough experience, project, or task into 3 distinct high-impact, ATS-optimized resume bullet points:
"${rawInput}"

Strict Execution Rules:
1. Apply the strict STAR/XYZ framework: "Accomplished [X] as measured by [Y], by doing [Z]".
2. Every bullet MUST start with a strong executive action verb (e.g., Spearheaded, Architected, Automated, Streamlined, Engineered, Accelerated).
3. Include realistic quantifiable metrics, percentages, speed increases, or volume impact.
4. Keep bullets concise (1-2 lines), active, and strictly focused on business or technical value.
5. Provide ONLY the 3 formatted bullet points as a bulleted list. Do NOT include greetings, tips, or intro text.
`;
        } else {
            prompt = `
You are a senior hiring director conducting campus recruitment rounds.
Task: Create a targeted interview preparation guide for the role or topic: "${rawInput}".

Generate exactly 3 core interview questions formatted as follows:
1. **Technical / Core Competency Question**:
   - **What Interviewer Tests**: The underlying technical standard or analytical ability.
   - **Winning Answer Blueprint**: A 3-sentence high-scoring answer structure using industry terminology.

2. **Scenario / Analytical Question**:
   - **What Interviewer Tests**: Problem-solving mindset under ambiguous operational conditions.
   - **Winning Answer Blueprint**: A step-by-step diagnostic response structure.

3. **Behavioral / Leadership Question**:
   - **What Interviewer Tests**: Ownership, conflict resolution, or team delivery.
   - **Winning Answer Blueprint**: How to structure the response using the STAR method.

Keep the advice direct, realistic, and recruiter-focused.
`;
        }

        try {
            return await this.generateContent(prompt);
        } catch (error) {
            console.error("Failed to generate placement prep:", error);
            throw error;
        }
    },

    // ======================================
    // 5. ADAPTIVE PLACEMENT & INTERVIEW ENGINE (CAMPUSOS v3.0)
    // ======================================
    interviewEngine: {
        session: {
            config: null,
            history: [],
            questionCount: 0,
            maxQuestions: 5,
            scores: [],
            selectionProbability: 50,
            weaknesses: [],
            strengths: []
        },

        initSession(config = {}) {
            this.session = {
                config: {
                    company: config.company || "Target Corporate",
                    role: config.role || "Operations Trainee",
                    difficulty: config.difficulty || "Intermediate",
                    type: config.type || "Mixed",
                    cvSummary: config.cvSummary || "Not provided",
                    ...config
                },
                history: [],
                questionCount: 0,
                maxQuestions: config.maxQuestions || 5,
                scores: [],
                selectionProbability: 50,
                weaknesses: [],
                strengths: []
            };
        },

        getSystemInstruction() {
            const { company, role, difficulty, type, cvSummary } = this.session.config;
            return `
You are an experienced placement coach, senior corporate interviewer, and technical evaluator for CampusOS.
Target Company: ${company}
Target Role: ${role}
Difficulty Tier: ${difficulty}
Interview Type: ${type}
Candidate Resume Claims: ${cvSummary}

STRICT BEHAVIOR & EVALUATION RULES:
1. Personality: Professional, direct, no-nonsense, context-aware, and constructively critical.
2. Tone Guardrail: NEVER use blind flattery, superficial praise, or filler compliments (do NOT say "Great answer!", "Excellent point!", or "Spot on!").
3. Content & Accountability: If the candidate gives generic statements, demands, or passive answers ("we solved it"), challenge them directly: Ask what THEY personally executed, measured, and delivered.
4. Truth & Bluffing:
   - If the student admits "I don't know": Do NOT punish credibility. Acknowledge the honesty, explain the practical concept in 1 sentence, and proceed.
   - If the student bluffs, hallucinates, or makes contradictory claims: Penalize credibility heavily and point out the exact contradiction.
5. Domain Context:
   - For Operations/Supply Chain: Test real-world terms (OTD, OTIF, SLAs, Lead time, 5 Whys, DMAIC, root causes, transporter bottlenecks).
   - For Excel/Data: Test practical formulas and execution (XLOOKUP, SUMIFS, Pivot Tables, conditional logic).
   - For Oman / Regional: Focus on multicultural team collaboration, operational adaptability, and commercial business cases without biased claims.
6. ONE QUESTION AT A TIME: Ask exactly ONE question per turn. Never combine multi-part prompts.
7. Return strictly valid, parseable JSON with NO markdown blocks (\`\`\`json).

JSON SCHEMA TO RETURN:
{
  "evaluation": {
    "score": 7.2,
    "knowledge": 7,
    "practical_understanding": 8,
    "communication": 7,
    "professionalism": 7,
    "credibility": 8,
    "what_went_well": ["Specific strength 1", "Specific strength 2"],
    "what_was_weak": ["Specific weakness 1", "Specific weakness 2"],
    "interviewer_inference": "What a recruiter strictly deduces from this response",
    "probability_delta": 2
  },
  "feedback_text": "2 to 3 sentences of sharp, constructive, no-fluff feedback.",
  "next_question": "Single question adapted directly from previous answers or probing their CV claims.",
  "is_final": false,
  "final_verdict": "HIRE / MAYBE / BORDERLINE / REJECT (Only when is_final is true)"
}
`;
        },

        async startInterview(config) {
            this.initSession(config);
            const prompt = `
${this.getSystemInstruction()}

Action:
Start the interview. Greet the candidate in one concise professional sentence, set expectations, and ask Question 1.
Set score fields to 0, what_went_well and what_was_weak to empty arrays, and provide 'next_question'.
`;
            const raw = await AIService.generateContent(prompt);
            let parsed;
            try {
                parsed = JSON.parse(raw.replace(/```json/g, "").replace(/```/g, "").trim());
            } catch {
                parsed = {
                    next_question: `Welcome to the interview for the ${this.session.config.role} position at ${this.session.config.company}. Walk me through a challenging operational problem you diagnosed and solved end-to-end.`,
                    feedback_text: "Interview initialized.",
                    is_final: false
                };
            }

            this.session.questionCount = 1;
            this.session.history.push({ role: "assistant", content: parsed.next_question });
            return parsed;
        },

        async submitAnswer(studentAnswer) {
            this.session.history.push({ role: "user", content: studentAnswer });
            const isLast = this.session.questionCount >= this.session.maxQuestions;

            const conversationHistoryContext = this.session.history
                .map(h => `${h.role === "assistant" ? "Interviewer" : "Candidate"}: ${h.content}`)
                .join("\n\n");

            const prompt = `
${this.getSystemInstruction()}

FULL CONVERSATION CONTEXT SO FAR:
${conversationHistoryContext}

Current Turn: Question ${this.session.questionCount} of ${this.session.maxQuestions}.
Latest Candidate Spoken Answer: "${studentAnswer}"

Evaluate this answer. 
${isLast ? "This is the FINAL question. Set 'is_final': true. Provide a definitive hiring assessment (HIRE, MAYBE, BORDERLINE, REJECT), key CV claims to improve, and concrete preparation steps in feedback_text. Leave 'next_question' blank." : "Set 'is_final': false. Formulate the single next question adapting directly to their previous answer, probing gaps, or cross-questioning their resume."}
`;

            const raw = await AIService.generateContent(prompt);
            const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
            const result = JSON.parse(cleaned);

            if (result.evaluation && typeof result.evaluation.score === "number") {
                this.session.scores.push(result.evaluation.score);
                const delta = result.evaluation.probability_delta || 0;
                this.session.selectionProbability = Math.max(5, Math.min(95, this.session.selectionProbability + delta));

                if (result.evaluation.what_was_weak) {
                    this.session.weaknesses.push(...result.evaluation.what_was_weak);
                }
                if (result.evaluation.what_went_well) {
                    this.session.strengths.push(...result.evaluation.what_went_well);
                }
            }

            if (!result.is_final) {
                this.session.questionCount++;
                this.session.history.push({ role: "assistant", content: result.next_question });
            }

            const totalScore = this.session.scores.reduce((a, b) => a + b, 0);
            const avg = this.session.scores.length ? (totalScore / this.session.scores.length).toFixed(1) : "0.0";

            return {
                ...result,
                metrics: {
                    currentQuestion: Math.min(this.session.questionCount, this.session.maxQuestions),
                    maxQuestions: this.session.maxQuestions,
                    averageScore: avg,
                    selectionProbability: this.session.selectionProbability
                }
            };
        }
    }
};

window.AIService = AIService;