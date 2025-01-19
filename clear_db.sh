#!/bin/bash

sudo -u postgres bash -c '
    source /home/lubuntu/flask_app/venv/bin/activate
    cd /home/lubuntu/capstone-project-3900h18bGitGud/backend
    python3 -m db.delete_db
'