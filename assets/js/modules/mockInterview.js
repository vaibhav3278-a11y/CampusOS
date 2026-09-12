document.addEventListener("DOMContentLoaded", () => {
    const roleSelect = document.getElementById("roleSelect");
    const companyInput = document.getElementById("companyInput");
    const difficultySelect = document.getElementById("difficultySelect");
    const cvInput = document.getElementById("cvInput");
    const startBtn = document.getElementById("startSessionBtn");

    const chatFeed = document.getElementById("chatFeed");
    const transcriptBox = document.getElementById("transcriptBox");
    const micBtn = document.getElementById("micBtn");
    const micStatus = document.getElementById("micStatus");
    const submitBtn = document.getElementById("submitBtn");

    const progressMetric = document.getElementById("progressMetric");
    const probabilityMetric = document.getElementById("probabilityMetric");
    const scoreMetric = document.getElementById("scoreMetric");
    const inferenceText = document.getElementById("inferenceText");

    let isRecording = false;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
            let currentText = "";
            for (let i = 0; i < event.results.length; i++) {
                currentText += event.results[i][0].transcript + " ";
            }
            transcriptBox.value = currentText.trim();
        };

        recognition.onerror = () => stopMic();
        recognition.onend = () => { if (isRecording) recognition.start(); };
    }

    function startMic() {
        if (!recognition) {
            alert("Speech recognition is not supported in this browser. Please use Chrome.");
            return;
        }
        isRecording = true;
        recognition.start();
        micBtn.classList.add("recording");
        micBtn.textContent = "🛑 Stop";
        micStatus.style.display = "inline";
    }

    function stopMic() {
        isRecording = false;
        if (recognition) recognition.stop();
        micBtn.classList.remove("recording");
        micBtn.textContent = "🎤 Mic";
        micStatus.style.display = "none";
    }

    micBtn.addEventListener("click", () => isRecording ? stopMic() : startMic());

    function appendMessage(role, text, evalDetails = null) {
        const msg = document.createElement("div");
        msg.className = `chat-msg ${role}`;
        
        let html = `<div>${text}</div>`;
        if (evalDetails) {
            html += `
                <div class="eval-box">
                    <strong>Score:</strong> ${evalDetails.score}/10 | <strong>Inference:</strong> ${evalDetails.interviewer_inference}
                    ${evalDetails.what_was_weak && evalDetails.what_was_weak.length ? `<div style="color:#b91c1c; margin-top:4px;"><strong>Weakness:</strong> ${evalDetails.what_was_weak.join(", ")}</div>` : ""}
                </div>
            `;
        }
        msg.innerHTML = html;
        chatFeed.appendChild(msg);
        chatFeed.scrollTop = chatFeed.scrollHeight;
    }

    startBtn.addEventListener("click", async () => {
        startBtn.disabled = true;
        startBtn.textContent = "Initiating...";

        const config = {
            role: roleSelect.value,
            company: companyInput.value.trim() || "Target Corporate",
            difficulty: difficultySelect.value,
            cvSummary: cvInput.value.trim() || "None provided",
            maxQuestions: 5
        };

        try {
            const initResponse = await AIService.interviewEngine.startInterview(config);
            chatFeed.innerHTML = "";
            appendMessage("interviewer", initResponse.next_question);

            transcriptBox.disabled = false;
            micBtn.disabled = false;
            submitBtn.disabled = false;
            progressMetric.textContent = `1 / ${config.maxQuestions}`;
        } catch (err) {
            alert("Could not start interview session: " + err.message);
        } finally {
            startBtn.disabled = false;
            startBtn.textContent = "Restart Session";
        }
    });

    submitBtn.addEventListener("click", async () => {
        const studentAnswer = transcriptBox.value.trim();
        if (!studentAnswer || studentAnswer.length < 8) {
            alert("Please state or type a response first.");
            return;
        }

        if (isRecording) stopMic();

        appendMessage("candidate", studentAnswer);
        transcriptBox.value = "";
        transcriptBox.disabled = true;
        submitBtn.disabled = true;

        try {
            const result = await AIService.interviewEngine.submitAnswer(studentAnswer);

            appendMessage("interviewer", `${result.feedback_text}\n\n${result.next_question || ""}`, result.evaluation);

            progressMetric.textContent = `${result.metrics.currentQuestion} / ${result.metrics.maxQuestions}`;
            probabilityMetric.textContent = `${result.metrics.selectionProbability}%`;
            scoreMetric.textContent = `${result.metrics.averageScore} / 10`;

            if (result.evaluation && result.evaluation.interviewer_inference) {
                inferenceText.textContent = `"${result.evaluation.interviewer_inference}"`;
            }

            if (result.is_final) {
                transcriptBox.disabled = true;
                micBtn.disabled = true;
                submitBtn.disabled = true;
                submitBtn.textContent = "Interview Finished";
            } else {
                transcriptBox.disabled = false;
                submitBtn.disabled = false;
            }
        } catch (err) {
            appendMessage("interviewer", "Error evaluating response. Please try again.");
            transcriptBox.disabled = false;
            submitBtn.disabled = false;
        }
    });
});