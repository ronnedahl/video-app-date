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
    "Vilken är din favoritfilm?",
    "Vad är ditt favoritgodis?",
    "Är du äventyrlig eller lugn?",
    "Hur spenderar du helst helgen?",
    "Vilket är ditt favoritdjur?",
    "Gillar du att laga mat?",
    "Vilket är ditt drömresmål?",
    "Har du någon hobby?",
    "Vilken är din favoritårstid?",
    "Har du några tatueringar?",
    "Vad gör dig glad?",
    "Har du syskon?",
    "Vad föredrar du, stad eller landsbygd?",
    "Favoritglass?",
    "Vilket är ditt stjärntecken?",
    "Vilken app använder du mest?",
    "Vilken är din favoritdryck?",
    "Gillar du att resa?",
    "Vilket språk skulle du vilja kunna?",
    "Har du några husdjur?",
    "Vilken är din favoritbok?",
    "Hur skulle dina vänner beskriva dig?",
    "Vad får dig att skratta?",
    "Vilken maträtt kan du äta varje dag?",
    "Hur kopplar du helst av?",
    "Gillar du att dansa?",
    "Är du spontan eller planerande?",
    "Vilket är ditt favoritspel?",
    "Vad är det roligaste du vet?",
    "Har du en favoritartist?",
    "Vad är din favoritfrukost?",
    "Hur viktigt är humor för dig?",
    "Vilket instrument skulle du vilja kunna spela?",
    "Är du ordningsam eller stökig?",
    "Vad är det bästa med dig?",
    "Vilken superkraft skulle du vilja ha?",
    "Gillar du överraskningar?",
    "Vad kan du inte leva utan?",
    "Är du en tävlingsmänniska?",
    "Har du gröna fingrar?",
    "Vilket är ditt favoritgodis?",
    "Vad gillar du mest hos dig själv?",
    "Vilken sport gillar du att titta på?",
    "Vilken är din favoritrestaurang?",
    "Hur lång tid tar det för dig att bli redo på morgonen?",
    "Har du några allergier?",
    "Vad skulle du göra om du vann på lotto?",
    "Har du något favoritcitat?",
    "Vad samlar du på, om något?",
    "Har du någon dold talang?",
    "Hur ofta tränar du?",
    "Vad tycker du om överraskningsfester?",
    "Vad gör du när du har tråkigt?",
    "Vilken maträtt lagar du bäst?",
    "Är du morgontrött?",
    "Vad är din favorit efterrätt?",
    "Har du några piercingar?",
    "Hur många länder har du besökt?",
    "Gillar du att shoppa?",
    "Favoritfrukt?",
    "Hur ser ditt drömboende ut?",
    "Vad var ditt första jobb?",
    "Hur många språk pratar du?",
    "Vad är din favoritaktivitet utomhus?",
    "Tycker du om att fotografera?",
    "Vad gör du för att hålla dig motiverad?",
    "Är du romantisk?",
    "Har du någonsin gjort något riktigt galet?",
    "Vilket är det bästa rådet du någonsin fått?",
    "Vad gör dig nervös?",
    "Gillar du att vara ute i naturen?",
    "Vilken är den bästa konserten du varit på?",
    "Vilken högtid gillar du mest?",
    "Gillar du att läsa böcker eller lyssna på ljudböcker?",
    "Vad är din favorittyp av film (komedi, drama, action)?",
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
    "Netflix eller YouTube?"
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