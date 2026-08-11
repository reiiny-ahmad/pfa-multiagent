"""Chargement centralisé des variables d'environnement.

Doit être importé AVANT tout module qui lit os.getenv() au moment de l'import
(database.py, auth_utils.py, agents/base.py).

Les deux fichiers .env sont chargés : backend/.env (config serveur) puis le
.env racine (clés API, Telegram). Le premier chargé gagne — on ne s'arrête pas
au premier trouvé, sinon les clés du .env racine ne seraient jamais lues.
"""
from pathlib import Path
from dotenv import load_dotenv

_BACKEND_DIR = Path(__file__).resolve().parents[1]
_ROOT_DIR = _BACKEND_DIR.parent

ENV_FILES = (_BACKEND_DIR / ".env", _ROOT_DIR / ".env")


def load_env() -> None:
    for env_file in ENV_FILES:
        if env_file.exists():
            # override=False : la première valeur rencontrée l'emporte, et les
            # variables déjà définies par Docker/le shell ne sont pas écrasées.
            load_dotenv(env_file, override=False)


load_env()
