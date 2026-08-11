from app.agents.base import BaseAgent

_SYSTEM = (
    "You are an award-winning journalist writing for SNRT, Morocco's national broadcaster. "
    "You write clear, engaging, publication-ready articles in a professional broadcast journalism style. "
    "Your text must be factually grounded, well-structured, and suitable for both web and TV broadcast."
)

_USER_TEMPLATE = """\
Topic: "{task}"

Research data and editorial plan:
{context}

Write a complete, publication-ready article following the editorial plan's sections.
You MUST use EXACTLY these section delimiters (copy them verbatim):

##HEADLINE##
Write one compelling, publication-ready headline (max 15 words).

##LEAD##
Write a strong lead paragraph (who, what, when, where, why) — 3-4 sentences.

##BODY##
Write 5-6 body paragraphs following the report sections from the editorial plan.
Include attributed quotes from the key figures identified in the research.
Each paragraph should be 4-6 sentences.

##CLOSING##
Write a strong closing paragraph with a forward-looking perspective — 3-4 sentences.
"""


class WritingAgent(BaseAgent):
    def __init__(self):
        super().__init__("Writing Agent")

    async def execute(self, task: str, context: str = "") -> str:
        return await self.ask_llm(_SYSTEM, _USER_TEMPLATE.format(task=task, context=context))

    def _mock_response(self, prompt: str) -> str:
        return (
            "##HEADLINE##\n"
            "Morocco Makes History at WAFCON 2024: Les Lionnes de l'Atlas Reach the Final\n\n"
            "##LEAD##\n"
            "In a tournament that will be remembered as a turning point for African women's football, "
            "Morocco's national women's team reached the final of the Women's Africa Cup of Nations 2024, "
            "hosted on home soil, captivating a nation and rewriting the history books of Moroccan sport. "
            "Before 78,000 spectators at Stade Mohammed V in Casablanca, Les Lionnes de l'Atlas proved "
            "that three years of strategic investment in women's football had transformed the country "
            "into a continental powerhouse.\n\n"
            "##BODY##\n"
            "The 2024 edition of WAFCON, held across Rabat, Casablanca, and Fès from July 4 to 24, "
            "drew record-breaking crowds, with 78,000 spectators packing Stade Mohammed V for the final — "
            "the highest attendance in the tournament's history. Twelve nations competed over three weeks "
            "in what CAF President Patrice Motsepe described as 'the best-organized women's tournament "
            "Africa has ever seen.' The prize money pool reached $2.5 million, a 50% increase from 2022, "
            "signaling a new era of investment in women's football across the continent.\n\n"
            "Morocco's journey to the final was nothing short of extraordinary. Under the guidance of "
            "French coach Reynald Pedros, Les Lionnes de l'Atlas swept through the group stage unbeaten, "
            "before eliminating 11-time champions Nigeria 2-1 in a pulsating semi-final. 'This team has "
            "worked for three years for this moment,' said Pedros after the final whistle. 'Tonight, "
            "all of Morocco is proud.' The victory over Nigeria sent the nation into celebration and "
            "confirmed Morocco's status as a genuine force in African women's football.\n\n"
            "The undisputed star of the tournament was Fatima Tagnaout, whose five goals earned her the "
            "Golden Boot and the Player of the Tournament award. The 24-year-old forward, who plays her "
            "club football in Spain, has become a symbol of the new generation of Moroccan women athletes. "
            "'I dedicate this to every young girl in Morocco who dreams of playing football,' she said "
            "after receiving her award. Her performances throughout the tournament drew comparisons to "
            "the greatest players in African women's football history.\n\n"
            "The tournament also served as a qualifier for the 2024 Paris Olympics, adding further stakes "
            "to every match. Morocco's qualification would represent the country's first-ever appearance "
            "at an Olympic Games in women's football — a milestone that would have been unthinkable just "
            "five years ago. The federation's long-term strategy, championed by FRMF President Fouzi Lekjaa, "
            "has clearly borne fruit at the highest level of continental competition.\n\n"
            "FRMF President Fouzi Lekjaa confirmed that Morocco will continue to invest in the women's "
            "program: 'What this team has achieved is the result of a long-term strategy. We are committed "
            "to building on this foundation and competing at the highest level globally.' The federation "
            "has already announced plans to expand the domestic women's league and increase funding for "
            "youth academies across the country, ensuring the pipeline of talent continues to grow.\n\n"
            "##CLOSING##\n"
            "As the final whistle blew on WAFCON 2024, it was clear that Moroccan women's football had "
            "crossed a threshold. Whether or not Les Lionnes lifted the trophy, they had already won "
            "something more enduring: the hearts of a nation, and a permanent place in the story of "
            "African football. The next chapter — Paris 2024, the 2026 World Cup qualifiers, and beyond — "
            "promises to be even more compelling."
        )
