﻿# capstone-project-3900h18bGitGud
Run in Virtualbox 6.1.22 following Moodle guide using Lubuntu OS

Video guide for installation can be accessed through: https://youtu.be/CJQI3Co28Zo

## POSTGRESQL INSTALL
Perform the following commands in the Lubuntu terminal
```bash
$ sudo apt update
$ sudo apt install postgresql postgresql-contrib
```

Check service status with the following
```bash
$ sudo systemctl start postgresql.service
```
## POSTGRES USAGE/SETUP
Postgres uses roles to handle authetication. This project uses the default user 'postgres' which can be accessed by being in the lubuntu terminal and performing (default password is lubuntu):
```bash
$ sudo -i -u postgres
```

While in postgres user account, the database can be accesses with:
```sql
$ psql
```

While connected to postgres, change the password to match this project's authentication:
```sql
postgres=# ALTER USER postgres PASSWORD 'root';
```
To quit database:
```sql
postgres=# \q
```

To quit postgres user account and return to system user:
```sql
$ exit
```

## PYTHON INSTALL
While in regular system user account and not postgres account:
```bash
$ sudo apt update
$ sudo apt install python3 python3-pip python3-venv
```

## PROJECT LOCATION
Download project files onto /home/lubuntu

## VIRTUAL ENVIRONMENT SETUP
While in /home/lubuntu and on regular system user account:
```bash
$ mkdir flask_app && cd flask_app
$ python3 -m venv venv
```

## INSTALL REQUIREMENTS
Activate the virtual environment and install requirements:
```bash
$ source /home/lubuntu/flask_app/venv/bin/activate
$ pip install -r capstone-project-3900h18bGitGud/backend/requirements.txt
```

Check versions:
```bash
$ python3 -m flask --version
Python 3.8.10
Flask 2.3.2
Werkzeug 2.3.6
```

Deactivate venv with:
```bash
$ deactivate
```

## PSYCOPG2 INSTALL
While in regular system user account and venv deactivated:
```bash
$ sudo apt-get install python3-psycopg2
```

## FRONTEND INSTALL
```bash
$ wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
$ source ~/.bashrc
```

Install node and npm:
```bash
$ nvm install --lts
$ npm update -g npm
```

Check version:
```bash
$ node -v
v18.17.0
$ npm -v
9.8.1
```

Go to frontend folder:
```bash
$ cd frontend
```

Install dependencies
```bash
$ npm install
```

Open /frontend/node_modules/react-scripts/config/webpack.config.js
add the following lines to line 199:
```js
watchOptions: {
    ignored: /node_modules/,
},
```

Update Firefox
```bash
$ sudo apt upgrade firefox
```

## RUN BACKEND
```bash
$ source /home/lubuntu/flask_app/venv/bin/activate
$ cd /home/lubuntu/capstone-project-3900h18bGitGud/backend 
$ python3 -m src.server
```

## RUN FRONTEND
while in capstone-project-3900h18bGitGud/frontend folder
```bash
$ npm start
```
