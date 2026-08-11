import logging
from app.agents.research_agent import ResearchAgent
from app.agents.planning_agent import PlanningAgent
from app.agents.writing_agent import WritingAgent
from app.agents.production_agent import ProductionAgent

logger = logging.getLogger(__name__)


def _section(text: str, key: str) -> str:
    """Extract content between ##KEY## and the next ##...## delimiter."""
    marker = f"##{key}##"
    start = text.find(marker)
    if start == -1:
        return ""
    start += len(marker)
    next_marker = text.find("##", start)
    block = text[start:next_marker].strip() if next_marker != -1 else text[start:].strip()
    return block


class Orchestrator:
    def __init__(self):
        self.research = ResearchAgent()
        self.planning = PlanningAgent()
        self.writing = WritingAgent()
        self.production = ProductionAgent()

    async def process(self, query: str) -> dict:
        logger.info("[Orchestrator] Starting pipeline for: %s", query)

        logger.info("[Orchestrator] Step 1/4 — Research Agent")
        research_output = await self.research.execute(query)
        logger.info("[Orchestrator] Research done (%d chars)", len(research_output))

        logger.info("[Orchestrator] Step 2/4 — Planning Agent")
        planning_output = await self.planning.execute(query, context=research_output)
        logger.info("[Orchestrator] Planning done (%d chars)", len(planning_output))

        logger.info("[Orchestrator] Step 3/4 — Writing Agent")
        writing_output = await self.writing.execute(
            query,
            context=f"RESEARCH DATA:\n{research_output}\n\nEDITORIAL PLAN:\n{planning_output}",
        )
        logger.info("[Orchestrator] Writing done (%d chars)", len(writing_output))

        logger.info("[Orchestrator] Step 4/4 — Production Agent")
        production_output = await self.production.execute(
            query,
            context=f"ARTICLE:\n{writing_output}\n\nRESEARCH CONTEXT:\n{research_output}",
        )
        logger.info("[Orchestrator] Production done (%d chars)", len(production_output))

        final_response = self._compile(
            query, research_output, planning_output, writing_output, production_output
        )
        logger.info("[Orchestrator] Pipeline complete — final response %d chars", len(final_response))

        return {
            "query": query,
            "agent_results": {
                "research": research_output,
                "planning": planning_output,
                "writing": writing_output,
                "production": production_output,
            },
            "final_response": final_response,
        }

    @staticmethod
    def _compile(
        query: str,
        research: str,
        planning: str,
        writing: str,
        production: str,
    ) -> str:
        sep = "─" * 52

        # Research sections
        summary     = _section(research, "SUMMARY")
        facts       = _section(research, "FACTS")
        statistics  = _section(research, "STATISTICS")
        timeline    = _section(research, "TIMELINE")
        key_figures = _section(research, "KEY_FIGURES")
        sources     = _section(research, "SOURCES")

        # Planning sections
        ed_angle     = _section(planning, "EDITORIAL_ANGLE")
        story_angles = _section(planning, "STORY_ANGLES")
        report_secs  = _section(planning, "REPORT_SECTIONS")
        interviews   = _section(planning, "INTERVIEW_TARGETS")
        pub_timeline = _section(planning, "PUBLICATION_TIMELINE")

        # Writing sections
        headline = _section(writing, "HEADLINE")
        lead     = _section(writing, "LEAD")
        body     = _section(writing, "BODY")
        closing  = _section(writing, "CLOSING")

        # Production sections
        script_30    = _section(production, "SCRIPT_30S")
        script_60    = _section(production, "SCRIPT_60S")
        social       = _section(production, "SOCIAL_MEDIA")
        hashtags     = _section(production, "HASHTAGS")
        prod_notes   = _section(production, "PRODUCTION_NOTES")
        interview_qs = _section(production, "INTERVIEW_QUESTIONS")

        full_article = "\n\n".join(filter(None, [
            f"**{headline}**" if headline else "",
            lead, body, closing
        ])) or writing

        return f"""\
📰 SUJET / TITRE
{headline or query}

{sep}

📋 RÉSUMÉ EXÉCUTIF
{summary or lead or "Voir l'article complet ci-dessous."}

{sep}

📊 FAITS CLÉS
{facts or "Données non disponibles."}

{sep}

📈 STATISTIQUES
{statistics or "Données non disponibles."}

{sep}

🗓️ CHRONOLOGIE
{timeline or "Données non disponibles."}

{sep}

🎯 ANGLE ÉDITORIAL
{ed_angle or "Données non disponibles."}

{sep}

🔍 ANGLES D'APPROCHE
{story_angles or "Données non disponibles."}

{sep}

📑 PLAN DU REPORTAGE
{report_secs or "Données non disponibles."}

{sep}

✍️ ARTICLE COMPLET

{full_article}

{sep}

🎬 SCRIPT VIDÉO — 30 SECONDES
{script_30 or "Données non disponibles."}

{sep}

🎥 SCRIPT VIDÉO — 60 SECONDES
{script_60 or "Données non disponibles."}

{sep}

📱 CONTENUS RÉSEAUX SOCIAUX
{social or "Données non disponibles."}

{sep}

#️⃣ HASHTAGS SUGGÉRÉS
{hashtags or "Données non disponibles."}

{sep}

🎙️ QUESTIONS D'INTERVIEW
{interview_qs or interviews or "Données non disponibles."}

{sep}

🎞️ NOTES DE PRODUCTION
{prod_notes or "Données non disponibles."}

{sep}

👥 PERSONNALITÉS CLÉS
{key_figures or "Données non disponibles."}

{sep}

📅 CALENDRIER DE PUBLICATION
{pub_timeline or "Données non disponibles."}

{sep}

🔗 SOURCES & RÉFÉRENCES
{sources or "Sources non disponibles."}

{sep}
🤖 Généré par SNRT Multi-Agents AI | Requête : "{query}"\
"""
