export const allQuestions: string[] = [
    "Hur lång är du?",
    "Vad är din favoritfärg?",
    "Har du några barn?",
    "Vad tycker du bäst om, sommar eller vinter?",
    "Var jobbar du?",
    "Tycker du om att träna?",
    "Har du dejtat någon som har haft för gammalt foto?",
    "Kaffe eller te?",
    "Hund eller katt?",
    "Pizza eller tacos?",
    "Vilken musik gillar du mest?",
    "Är du morgon- eller kvällsmänniska?",
    "Är du äventyrlig eller lugn?",
    "Vilket är ditt favoritdjur?",
    "Gillar du att laga mat?",
    "Har du någon hobby?",
    "Vilken är din favoritårstid?",
    "Har du några tatueringar?",
    "Vad föredrar du, stad eller landsbygd?",
    "Vilket är ditt stjärntecken?",
    "Vilken är din favoritdryck?",
    "Gillar du att resa?",
    "Har du några husdjur?",
    "Gillar du att dansa?",
    "Är du spontan eller planerande?",
    "Hur viktigt är humor för dig?",
    "Vilket instrument skulle du vilja kunna spela?",
    "Är du ordningsam eller stökig?",
    "Gillar du överraskningar?",
    "Vad kan du inte leva utan?",
    "Är du en tävlingsmänniska?",
    "Har du gröna fingrar?",
    "Hur lång tid tar det för dig att bli redo på morgonen?",
    "Har du några allergier?",
    "Hur ofta tränar du?",
    "Vad tycker du om överraskningsfester?",
    "Är du morgontrött?",
    "Gillar du att shoppa?",
    "Favoritfrukt?",
    "Är du romantisk?",
    "Vad gör du helst på sommaren?",
    "Strand eller pool?",
    "Morgonpromenad eller kvällspromenad?",
    "Filmkväll eller fest?",
    "Glass eller chips?",
    "Duscha snabbt eller länge?",
    "Mobil eller dator?",
    "Sms:a eller ringa?",
    "Äta ute eller laga hemma?",
    "Hav eller berg?",
    "Netflix eller YouTube?",
    "Sött eller salt?",
    "Bok eller film?",
    "Hemmakväll eller utekväll?",
    "Spara eller slösa?",
    "Solsemester eller skidsemester?",
    "Använder du snooze-knappen?",
    "Sjunger du i duschen?",
    "Vilken är din favoritmat?",
    "Är du kitlig?",
    "Öl eller vin?",
    "Podcast eller musik?",
    "Är du höger- eller vänsterhänt?",
    "Tror du på ödet?",
    "Vilken sida av sängen sover du på?",
    "Kan du vissla?",
    "Frukost eller middag?",
    "Android eller iPhone?",
    "Favoritdoft?",
    "Är du vidskeplig?"

    
];

let usedQuestionsInCurrentSession: Set<string> = new Set();

export function getRandomQuestions(sourceQuestions: string[] = allQuestions, count: number = 6): string[] {
    const questionsCopy: string[] = [...sourceQuestions];
    
    for (let i = questionsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questionsCopy[i], questionsCopy[j]] = [questionsCopy[j], questionsCopy[i]];
    }
    
    usedQuestionsInCurrentSession.clear();
    
    return questionsCopy.slice(0, Math.min(count, questionsCopy.length));
}

export function getNextQuestion(questionPool: string[], currentQuestion: string): string {
    usedQuestionsInCurrentSession.add(currentQuestion);
    
    const availableQuestions = questionPool.filter(q => !usedQuestionsInCurrentSession.has(q));
    
    if (availableQuestions.length === 0) {
        const anyExceptCurrent = questionPool.filter(q => q !== currentQuestion);
        
        if (anyExceptCurrent.length === 0) {
            return currentQuestion;
        }
        
        const randomIndex = Math.floor(Math.random() * anyExceptCurrent.length);
        const nextQuestion = anyExceptCurrent[randomIndex];
        
        usedQuestionsInCurrentSession.clear();
        usedQuestionsInCurrentSession.add(nextQuestion);
        
        return nextQuestion;
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
}