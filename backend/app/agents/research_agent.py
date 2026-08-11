from app.agents.base import BaseAgent

_SYSTEM = (
    "You are a senior investigative journalist and data researcher for SNRT, Morocco's national broadcaster. "
    "You produce structured, factual, citation-ready research briefs. "
    "Always ground your output in real, verifiable information."
)

_USER_TEMPLATE = """\
Conduct a thorough research brief on: "{task}"

You MUST use EXACTLY these section delimiters (copy them verbatim):

##SUMMARY##
Write 2-3 factual paragraphs covering the topic overview, background, and significance.

##FACTS##
List 5-8 key verified facts, one per line, starting with "- ".

##STATISTICS##
List 5-8 relevant numbers, percentages, records, or figures, one per line, starting with "- ".

##TIMELINE##
List 5-8 chronological key dates/events, one per line, format: "YYYY-MM-DD: event description".

##KEY_FIGURES##
List the main people and organizations involved, one per line, starting with "- Name/Org: role/relevance".

##SOURCES##
List 4-6 real or highly plausible source URLs or publication names, one per line, starting with "- ".
"""


class ResearchAgent(BaseAgent):
    def __init__(self):
        super().__init__("Research Agent")

    async def execute(self, task: str, context: str = "") -> str:
        return await self.ask_llm(_SYSTEM, _USER_TEMPLATE.format(task=task))

    def _mock_response(self, prompt: str) -> str:
        return (
            "##SUMMARY##\n"
            "The Women's Africa Cup of Nations (WAFCON) 2024 was hosted by Morocco, marking the country's "
            "second time organizing the tournament. The competition featured 12 national teams competing "
            "across venues in Rabat, Casablanca, and Fès. Morocco's national women's team, nicknamed "
            "'Les Lionnes de l'Atlas', reached the final for the first time in their history.\n\n"
            "South Africa (Banyana Banyana) entered as defending champions, having won the 2022 edition. "
            "Nigeria's Super Falcons, 11-time champions, were eliminated in the semi-finals in a major upset. "
            "The tournament served as a qualifier for the 2024 Paris Olympics.\n\n"
            "##FACTS##\n"
            "- Morocco hosted WAFCON for the second time, having also hosted in 2022\n"
            "- 12 national teams participated across 3 host cities: Rabat, Casablanca, Fès\n"
            "- Morocco's women's team reached the WAFCON final for the first time in history\n"
            "- Nigeria's Super Falcons (11-time champions) were eliminated in the semi-finals\n"
            "- The tournament doubled as a qualifier for the 2024 Paris Olympics\n"
            "- Fatima Tagnaout won the Golden Boot with 5 goals\n\n"
            "##STATISTICS##\n"
            "- 12 teams participated across 3 host cities\n"
            "- 30 matches played over 3 weeks\n"
            "- 78,000 spectators attended the final at Stade Mohammed V, Casablanca\n"
            "- Average attendance per match: 22,400 (record for WAFCON)\n"
            "- Prize money pool: $2.5 million USD (50% increase from 2022)\n"
            "- Tagnaout scored 5 goals (Golden Boot)\n\n"
            "##TIMELINE##\n"
            "2023-07-01: CAF confirms Morocco as host nation for WAFCON 2024\n"
            "2024-04-15: Draw ceremony held in Rabat\n"
            "2024-07-04: Tournament kick-off — Morocco vs Senegal (3-0)\n"
            "2024-07-20: Semi-finals — Morocco defeats Nigeria 2-1\n"
            "2024-07-24: Final — Morocco vs South Africa at Stade Mohammed V\n\n"
            "##KEY_FIGURES##\n"
            "- Reynald Pedros: Head coach, Morocco women's national team\n"
            "- Fatima Tagnaout: Top scorer, Golden Boot winner, tournament MVP\n"
            "- Patrice Motsepe: CAF President, presided over the final ceremony\n"
            "- Fouzi Lekjaa: President of FRMF (Royal Moroccan Football Federation)\n\n"
            "##SOURCES##\n"
            "- CAF Official: https://www.cafonline.com/womens-africa-cup-of-nations\n"
            "- FIFA Women's Football: https://www.fifa.com/womens-football\n"
            "- L'Équipe Africa: https://www.lequipe.fr/Football/Afrique\n"
            "- Hespress Sport: https://www.hespress.com/sport\n"
            "- Médias24: https://www.medias24.com/sport"
        )
