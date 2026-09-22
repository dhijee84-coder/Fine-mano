import os
from dotenv import load_dotenv
load_dotenv()

from app import create_app

app = create_app()

if __name__ == "__main__":
    debug_mode = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    # debug=True must NEVER be used against a production database.
    app.run(host="127.0.0.1", port=5000, debug=debug_mode)
