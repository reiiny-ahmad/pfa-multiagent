from app.agents.base import BaseAgent

_SYSTEM = (
    "You are a digital content producer and social media strategist for SNRT, Morocco's national broadcaster. "
    "You transform written journalism into complete multimedia production packages. "
    "You specialize in short-form video scripts, social media formats, and broadcast production."
)

_USER_TEMPLATE = """\
Topic: "{task}"

Written article and research context:
{context}

Create a complete multimedia production package.
You MUST use EXACTLY these section delimiters (copy them verbatim):

##SCRIPT_30S##
Write a 30-second video script with shot-by-shot directions.
Format each shot as: [Xs-Ys] SHOT: visual description | NARRATION: "spoken text"

##SCRIPT_60S##
Write a 60-second video script with shot-by-shot directions.
Format each shot as: [Xs-Ys] SHOT: visual description | NARRATION: "spoken text"

##SOCIAL_MEDIA##
Write 3 social media post concepts (one for each: Facebook/X, Instagram, TikTok/Reels).
Format: "Platform — Hook: ... | Content: ... | CTA: ..."

##HASHTAGS##
List 15-20 relevant hashtags in Arabic, French, and English, all on one line separated by spaces.

##PRODUCTION_NOTES##
List 4-5 production/editing recommendations, format: "- Category: recommendation".

##INTERVIEW_QUESTIONS##
List 5-6 suggested interview questions for the key figures, format: "- To [Name]: question?"
"""


class ProductionAgent(BaseAgent):
    def __init__(self):
        super().__init__("Production Agent")

    async def execute(self, task: str, context: str = "") -> str:
        return await self.ask_llm(_SYSTEM, _USER_TEMPLATE.format(task=task, context=context))

    def _mock_response(self, prompt: str) -> str:
        return (
            "##SCRIPT_30S##\n"
            "[0-3s] SHOT: Aerial view of packed Stade Mohammed V, Casablanca at night | NARRATION: \"July 2024. Morocco. A nation holds its breath.\"\n"
            "[3-8s] SHOT: Close-up of Fatima Tagnaout celebrating a goal, crowd erupting | NARRATION: \"Les Lionnes de l'Atlas make history — reaching the WAFCON final for the first time.\"\n"
            "[8-15s] SHOT: Montage — goals, saves, fan reactions, team huddles | NARRATION: \"Five goals. Record crowds. 78,000 fans. A generation inspired.\"\n"
            "[15-22s] SHOT: Tagnaout holding Golden Boot trophy, smiling | NARRATION: \"Fatima Tagnaout — Golden Boot winner, and the face of a new era.\"\n"
            "[22-28s] SHOT: Wide shot of stadium, Moroccan flags waving | NARRATION: \"Women's football in Africa will never be the same again.\"\n"
            "[28-30s] SHOT: SNRT logo + WAFCON 2024 graphic | NARRATION: \"SNRT — With you, every moment.\"\n\n"
            "##SCRIPT_60S##\n"
            "[0-5s] SHOT: Aerial view of Casablanca at sunset, stadium in background | NARRATION: \"Morocco, July 2024. The stage is set for history.\"\n"
            "[5-12s] SHOT: Tournament opening ceremony highlights | NARRATION: \"Twelve nations. Three cities. One dream. The Women's Africa Cup of Nations 2024 begins.\"\n"
            "[12-20s] SHOT: Morocco group stage highlights, crowd reactions | NARRATION: \"Les Lionnes de l'Atlas swept through the group stage unbeaten, captivating a nation.\"\n"
            "[20-30s] SHOT: Semi-final vs Nigeria — key moments, final whistle celebration | NARRATION: \"Then came the moment no one will forget. Morocco 2, Nigeria 1. The 11-time champions eliminated.\"\n"
            "[30-40s] SHOT: Tagnaout goal montage, Golden Boot ceremony | NARRATION: \"Fatima Tagnaout — five goals, one Golden Boot, and a place in history.\"\n"
            "[40-50s] SHOT: Stadium crowd, 78,000 fans, flags, emotion | NARRATION: \"Seventy-eight thousand voices. A record. A statement. Morocco belongs on the world stage.\"\n"
            "[50-57s] SHOT: Coach Pedros, players celebrating, trophy presentation | NARRATION: \"Three years of work. One historic night. Les Lionnes de l'Atlas — the pride of a nation.\"\n"
            "[57-60s] SHOT: SNRT logo | NARRATION: \"SNRT — Morocco's story, told with passion.\"\n\n"
            "##SOCIAL_MEDIA##\n"
            "Facebook/X — Hook: 🇲🇦 HISTOIRE ! Les Lionnes de l'Atlas en finale du WAFCON 2024 | Content: Pour la première fois de leur histoire, les Marocaines atteignent la finale de la Coupe d'Afrique des Nations féminine. 78 000 supporters, 5 buts de Tagnaout, et un rêve devenu réalité. | CTA: Partagez si vous êtes fiers ! 🏆 #WAFCON2024\n"
            "Instagram — Hook: She made history tonight 🌟 | Content: Fatima Tagnaout. 5 goals. Golden Boot. WAFCON 2024 MVP. This is what dreams look like. 📸 Swipe for the best moments of Morocco's historic run. | CTA: Tag someone who needs to see this 🇲🇦\n"
            "TikTok/Reels — Hook: \"3 years ago nobody knew her name. Tonight she's Africa's best player 🔥\" | Content: Tagnaout's journey from unknown to WAFCON Golden Boot — training clips, first goal, tournament MVP moment | CTA: Follow for full WAFCON highlights → link in bio\n\n"
            "##HASHTAGS##\n"
            "#WAFCON2024 #LionnesAtlas #MarocFéminin #كأس_أمم_أفريقيا_للسيدات #FootballFéminin #MoroccoWomen #CAFWomen #Tagnaout #المغرب #كرة_القدم_النسائية #SNRT #SportMaroc #AfriqueFootball #WomenInSport #CoupeAfrique2024 #LesLionnes #FRMF #Paris2024 #HistoireDuFootball #FièresDÊtreMarocaines\n\n"
            "##PRODUCTION_NOTES##\n"
            "- Transitions: Fast cuts synchronized to drum beat for goal montages; slow dissolves for emotional moments\n"
            "- Music: Opens with traditional Moroccan percussion, builds to modern electronic/orchestral hybrid\n"
            "- Graphics: Player name cards (white on dark background), stat pop-ups (goals, attendance figures)\n"
            "- Color grading: Warm golden tones for celebration scenes; high-contrast desaturated for archive footage\n"
            "- Text style: Bold Arabic/French bilingual lower-thirds using SNRT brand colors (red/green)\n\n"
            "##INTERVIEW_QUESTIONS##\n"
            "- To Reynald Pedros: What tactical adjustments were key to defeating Nigeria in the semi-final?\n"
            "- To Fatima Tagnaout: How has your journey from club football in Spain prepared you for this moment?\n"
            "- To Fouzi Lekjaa: What specific investments will the FRMF make in women's football following this tournament?\n"
            "- To a female fan: What does seeing the Moroccan women's team in the final mean to you personally?\n"
            "- To CAF spokesperson: How does WAFCON 2024 compare to previous editions in terms of organization and impact?\n"
            "- To Tagnaout: What message do you have for young girls in Morocco who dream of playing football?"
        )
