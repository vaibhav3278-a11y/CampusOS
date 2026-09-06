// ======================================
// CampusOS - Gemini AI Service (v2.5)
// ======================================

const AIService = {
    apiKey: localStorage.getItem("CAMPUSOS_GEMINI_KEY") || "AQ.Ab8RN6JnUmCNbuSpoYLuGEld5DPJxl9JidttVWmyWG7h0bFdcw", 
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",

    /**
     * Send prompt to Gemini API supporting both Header & Query Auth
     */
    async generateContent(prompt) {
        const activeKey = (this.apiKey || localStorage.getItem("CAMPUSOS_GEMINI_KEY") || "").trim();
        
        if (!activeKey) {
            throw new Error("Gemini API Key is missing.");
        }

        // AQ.* keys use Bearer Authorization header; AIzaSy* keys use ?key= query param
        const isOAuthKey = activeKey.startsWith("AQ.");
        const endpoint = isOAuthKey ? this.baseUrl : `${this.baseUrl}?key=${activeKey}`;
        
        const headers = {
            "Content-Type": "application/json"
        };

        if (isOAuthKey) {
            headers["Authorization"] = `Bearer ${activeKey}`;
        }

        const payload = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Failed to communicate with Gemini API");
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("AIService Error:", error);
            throw error;
        }
    },

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

    async solveCaseStudy(caseText) {
        const prompt = `
            You are a premier business school professor and corporate strategy consultant.
            Analyze and solve this case study / business scenario:
            "${caseText}"

            Provide a rigorous, structured solution. 
            Respond STRICTLY in valid JSON format with no markdown wrapper or extra text. Use this exact schema:
            {
                "title": "Clear case title (max 8 words)",
                "problem": "Precise root-cause problem statement (2-3 sentences)",
                "framework": "Recommended strategic framework (e.g. MECE, SWOT, Root-Cause 5 Whys, Cost-Benefit)",
                "solution": "Detailed actionable strategic solution formatted in clear structured paragraphs or numbered steps",
                "insights": [
                    "Key Learning / Strategic Insight 1",
                    "Key Learning / Strategic Insight 2",
                    "Key Learning / Strategic Insight 3"
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

    async generatePlacementPrep(rawInput, type = "resume") {
        let prompt = "";
        
        if (type === "resume") {
            prompt = `
                You are a senior technical recruiter and career coach.
                Rewrite and enhance the following resume bullet point using strong action verbs, quantifiable metrics, and the STAR framework: "${rawInput}".
                Keep the output concise, highly professional, and bullet-ready.
            `;
        } else {
            prompt = `
                You are a corporate hiring manager.
                Based on the following job role or topic: "${rawInput}", generate 3 high-impact interview questions along with brief, structured answer guidelines for each.
            `;
        }

        try {
            return await this.generateContent(prompt);
        } catch (error) {
            console.error("Failed to generate placement prep:", error);
            throw error;
        }
    }
};

window.AIService = AIService;