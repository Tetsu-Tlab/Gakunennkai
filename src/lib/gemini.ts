import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    async generateMeetingSummary(events: any[], agendaItems: any[]) {
        const prompt = `
      あなたは学校の先生です。次の学年会の資料の冒頭に載せる「次回の見通し」と「準備タスク」を作成してください。
      
      ## 入力情報
      【今後2週間の行事予定】
      ${JSON.stringify(events, null, 2)}
      
      【今回の議題】
      ${JSON.stringify(agendaItems, null, 2)}
      
      ## 出力要件
      1. 「次回の見通し」: 行事から予測される生徒の動きや教師の心構えを3行程度で。
      2. 「準備タスク」: 具体的に誰が何をいつまでにすべきか箇条書きで。MD形式で出力してください。
    `;

        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }

    async generateShortSummary(agendaItems: any[]) {
        const prompt = `
      以下の議題リストを、スプレッドシートの1セルに収まるように「15文字以内」の短い要約にしてください。
      複数の議題がある場合は、代表的なものを抜粋または結合してください。
      
      【議題】
      ${agendaItems.map(i => i.title).join(', ')}
      
      出力は要約テキストのみを行ってください。
    `;
        const result = await this.model.generateContent(prompt);
        return result.response.text().trim();
    }
}
