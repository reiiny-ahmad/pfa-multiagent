from app.agents.base import BaseAgent

_SYSTEM = (
    "You are a senior editorial director at SNRT, Morocco's national broadcaster. "
    "You receive structured research data and produce detailed, actionable editorial plans "
    "for journalists and production teams. Your plans are immediately usable in a newsroom."
)

_USER_TEMPLATE = """\
Topic: "{task}"

Research data:
{context}

Based on this research, create a detailed editorial plan.
You MUST use EXACTLY these section delimiters (copy them verbatim):

##EDITORIAL_ANGLE##
Write the primary editorial angle in 2-3 sentences: what is the story, why it matters now, who is the audience.

##STORY_ANGLES##
List 3-4 distinct story angles, one per line, format: "N. Angle title — one-line pitch".

##REPORT_SECTIONS##
List 6-8 numbered report sections with a brief description of each, format: "N. Section title: description".

##INTERVIEW_TARGETS##
List 4-5 interview targets with justification, format: "- Name/Role: what to ask them about".

##VISUAL_ELEMENTS##
List 4-5 visual/multimedia elements needed, format: "- Element type: description".

##PUBLICATION_TIMELINE##
List the recommended publication schedule, format: "- Day N / Phase: what to publish".
"""


class PlanningAgent(BaseAgent):
    def __init__(self):
        super().__init__("Planning Agent")

    async def execute(self, task: str, context: str = "") -> str:
        return await self.ask_llm(_SYSTEM, _USER_TEMPLATE.format(task=task, context=context))

    def _mock_response(self, prompt: str) -> str:
        return (
            "##EDITORIAL_ANGLE##\n"
            "Morocco's historic run to the WAFCON 2024 final on home soil represents a watershed moment "
            "for women's football in North Africa. This story targets sports fans, women's rights advocates, "
            "and a general Moroccan audience proud of national achievement.\n\n"
            "##STORY_ANGLES##\n"
            "1. Historic milestone — Morocco's first-ever WAFCON final: a national pride story\n"
            "2. The rise of women's football in Africa: WAFCON as a catalyst for investment\n"
            "3. Behind the scenes: How Morocco built a winning women's team in 3 years\n"
            "4. Social impact: How the tournament changed perceptions of women in sport in Morocco\n\n"
            "##REPORT_SECTIONS##\n"
            "1. Introduction: Setting the scene — Morocco as host and finalist\n"
            "2. Tournament Overview: Results, standout performances, records broken\n"
            "3. Morocco's Journey: Match-by-match analysis of Les Lionnes de l'Atlas\n"
            "4. Star Profile: Fatima Tagnaout — Golden Boot winner and national icon\n"
            "5. Infrastructure & Organization: Stadiums, logistics, CAF assessment\n"
            "6. Women's Football Landscape: Growth across Africa, investment trends\n"
            "7. Road to Paris 2024 Olympics: Qualification implications\n"
            "8. Conclusion & Outlook: What this tournament means for Moroccan football\n\n"
            "##INTERVIEW_TARGETS##\n"
            "- Reynald Pedros (Head Coach): tactical decisions and team preparation strategy\n"
            "- Fatima Tagnaout (Player): personal journey and tournament experience\n"
            "- Fouzi Lekjaa (FRMF President): federation strategy and future investment plans\n"
            "- Female fans at the stadium: social impact and representation in sport\n"
            "- CAF spokesperson: tournament evaluation and future hosting plans\n\n"
            "##VISUAL_ELEMENTS##\n"
            "- Match highlights reel: goals, saves, and fan celebrations\n"
            "- Infographic: Morocco's path to the final with match scores\n"
            "- Photo essay: fans, atmosphere, and behind-the-scenes moments\n"
            "- Archive comparison: women's football in Morocco 2010 vs 2024\n"
            "- Data visualization: attendance records and prize money growth\n\n"
            "##PUBLICATION_TIMELINE##\n"
            "- Day 1 (match day): Live match report and social media clips\n"
            "- Day 2: Long-form analysis and player interviews\n"
            "- Day 3: Documentary-style feature and infographics\n"
            "- Week 2: In-depth investigation on women's football growth in Africa"
        )
