document.addEventListener("DOMContentLoaded", () => {
    const micBtn = document.getElementById("micBtn");
    const transcriptArea = document.getElementById("liveTranscript");
    const submitBtn = document.getElementById("submitAnswerBtn");
    const nextBtn = document.getElementById("nextQuestionBtn");
    const feedbackBox = document.getElementById("feedbackContainer");
    const feedbackContent = document.getElementById("feedbackContent");
    const questionBox = document.getElementById("interviewQuestion");

    // Curated interview question pool
    const interviewQuestions = [
        "Tell me about a challenging project where your initial strategy failed. How did you diagnose the breakdown and pivot?",
        "Describe a situation where you had to lead a cross-functional team under a tight deadline with incomplete data.",
        "How do you prioritize competing business demands when resources and delivery time are strictly constrained?",
        "Walk me through a time you identified an operational inefficiency and implemented a measurable solution.",
        "Give an example of a high-stakes disagreement with a teammate or stakeholder. How did you achieve alignment?"
    ];

    let currentQuestionIndex = 0;

    // Function to set and speak the question
    function setQuestion(index) {
        questionBox.textContent = `"${interviewQuestions[index]}"`;
        transcriptArea.value = "";
        feedbackBox.style.display = "none";
        feedbackContent.textContent = "";

        // Voice synthesis: reads question aloud to candidate
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(interviewQuestions[index]);
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentQuestionIndex = (currentQuestionIndex + 1) % interviewQuestions.length;
            setQuestion(currentQuestionIndex);
        });
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Web Speech API is not supported in this browser. Please use Chrome on desktop or Android.");
        micBtn.disabled = true;
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let isRecording = false;

    recognition.onresult = (event) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + " ";
        }
        transcriptArea.value = currentTranscript.trim();
    };

    recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === "not-allowed") {
            alert("Microphone access was denied. Please allow microphone permissions in your browser.");
        }
        stopRecording();
    };

    recognition.onend = () => {
        if (isRecording) {
            recognition.start();
        }
    };

    function startRecording() {
        isRecording = true;
        recognition.start();
        micBtn.textContent = "🛑 Stop Recording";
        micBtn.classList.add("recording");
    }

    function stopRecording() {
        isRecording = false;
        recognition.stop();
        micBtn.textContent = "🎤 Start Speaking";
        micBtn.classList.remove("recording");
    }

    micBtn.addEventListener("click", () => {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    });

    submitBtn.addEventListener("click", async () => {
        const answer = transcriptArea.value.trim();
        const question = questionBox.textContent.trim();

        if (!answer || answer.length < 15) {
            alert("Please provide a more complete spoken answer before submitting.");
            return;
        }

        if (isRecording) stopRecording();

        submitBtn.disabled = true;
        submitBtn.textContent = "Evaluating with AI...";
        feedbackBox.style.display = "block";
        feedbackContent.textContent = "Analyzing structure, clarity, and STAR-framework alignment...";

        const prompt = `
You are a senior corporate recruiter and campus placement director.
Evaluate this student's spoken interview response.

Target Question: ${question}
Spoken Candidate Answer: "${answer}"

Structure your evaluation:
1. Overall Grade (Strong Hire / Hire / Needs Work) & Spoken Score (out of 10)
2. Content & Structure (Did they use STAR? What substance was strong or missing?)
3. Delivery & Articulation (Flag filler words, rambling, or vague points)
4. Polished Example Answer (How an elite candidate would deliver this response concisely)

Keep the critique constructive, direct, and actionable.
`;

        try {
            const feedback = await AIService.generateContent(prompt);
            feedbackContent.textContent = feedback;
        } catch (err) {
            feedbackContent.textContent = "Error evaluating response: " + err.message;
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Evaluate My Answer";
        }
    });
});