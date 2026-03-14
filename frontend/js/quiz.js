const questions = [
    {
        text: "You receive an email from 'IT Security' saying your password expires in 2 hours and you must click the link below to verify it.",
        content: "Subject: URGENT Password Expiry\nFrom: security@it-company-support.com\n\nDear User,\nYour domain password will expire in 2 hours. Please visit http://verify-password-now.cc to update it immediately.",
        answer: "scam"
    },
    {
        text: "Your HR department sends a monthly newsletter about company holidays.",
        content: "Subject: October Newsletter\nFrom: hr@ourcompany.com\n\nHi everyone, check out the upcoming holiday schedule for next month on our internal portal.",
        answer: "real"
    },
    {
        text: "An email from 'Microsoft' claims there was an unusual login from Russia and needs you to download a 'SecurityPatch.exe'.",
        content: "Subject: Unusual Login Detected\nFrom: noreply@microsoft-security-alert.me\n\nSomeone from Moscow logged into your account. Run the attached security patch to protect your device.",
        answer: "scam"
    },
    {
        text: "A LinkedIn notification says you have 3 new connection requests.",
        content: "Subject: You have hidden messages\nFrom: notifications@linkedin.com\n\nView your 3 new connection requests on LinkedIn.",
        answer: "real"
    },
    {
        text: "Your bank sends an email asking for your PIN to 'unfreeze' your credit card.",
        content: "Subject: BANK ALERT: Card Restricted\nFrom: support@secure-bank-login.com\n\nWe detected fraud. Reply to this email with your full card number and PIN to unfreeze your account.",
        answer: "scam"
    }
];

let currentIdx = 0;
let score = 0;
let selected = null;

function loadQuestion() {
    const q = questions[currentIdx];
    document.getElementById('currentQ').textContent = currentIdx + 1;
    document.getElementById('progressBar').style.width = `${((currentIdx + 1) / questions.length) * 100}%`;
    document.getElementById('questionText').textContent = q.text;
    document.getElementById('emailContent').textContent = q.content;
    
    // Reset selections
    selected = null;
    document.getElementById('optReal').classList.remove('selected');
    document.getElementById('optScam').classList.remove('selected');
    document.getElementById('nextBtn').disabled = true;
    document.getElementById('nextBtn').textContent = currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question';
}

function selectOption(type) {
    selected = type;
    document.getElementById('optReal').classList.remove('selected');
    document.getElementById('optScam').classList.remove('selected');
    
    if (type === 'real') document.getElementById('optReal').classList.add('selected');
    else document.getElementById('optScam').classList.add('selected');
    
    document.getElementById('nextBtn').disabled = false;
}

async function nextQuestion() {
    if (selected === questions[currentIdx].answer) {
        score++;
    }

    if (currentIdx < questions.length - 1) {
        currentIdx++;
        loadQuestion();
    } else {
        showResults();
    }
}

async function showResults() {
    document.getElementById('quizContainer').classList.add('hidden');
    document.getElementById('resultContainer').classList.remove('hidden');
    document.getElementById('scoreDisplay').textContent = `${score}/${questions.length}`;
    
    if (score >= 4) {
        document.getElementById('resultMsg').textContent = "Excellent! You have a keen eye for security threats.";
    } else {
        document.getElementById('resultMsg').textContent = "Good effort, but you missed some critical red flags. Review your lessons.";
    }

    // Update risk score on backend
    await updateRiskOnBackend(score);
}

async function updateRiskOnBackend(quizScore) {
    const token = localStorage.getItem('token');
    // Simplified logic: every correct answer reduces risk by 5
    const reduction = quizScore * 5;
    
    try {
        const response = await fetch('/api/employees/update-risk', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ reduction })
        });
        
        if (response.ok) {
            const data = await response.json();
            // Update local storage user data
            const user = JSON.parse(localStorage.getItem('user'));
            user.riskScore = data.newRiskScore;
            localStorage.setItem('user', JSON.stringify(user));
        }
    } catch (error) {
        console.error('Error updating risk after quiz:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadQuestion);
