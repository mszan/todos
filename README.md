# Todos
Todos web app built with ReactJS and ExpressJS.
![](https://i.imgur.com/Yizgeld.png)

![](https://i.imgur.com/43D3AeG.png)

![](https://i.imgur.com/ZKq8QY2.png)

![](https://i.imgur.com/NzBw6xt.png)

![](https://i.imgur.com/8q8g40J.png)

## Live demo
**Available at** [todos.mszanowski.pl](https://todos.mszanowski.pl).

It is hosted on VPS (nginx, gunicorn, pm2).

## Backend
ExpressJS along with MySQL and JWT.

Routes:
- **_api.js** - wrapper for every route,
- **authorization.js** - user registration and JWT,
- **public.js** - public information (no login required),
- **tasks.js** - todo tasks,
- **users.js** - users.

## Frontend
ReactJS along with Ant Design and Ant Motion.

Components:
- **App** - root,
- **Home** - homepage,
- **PageLayout** - page layout - wrapper for other components,
- **Registration** - user registration,
- **Tasks** - todo tasks,
- **Users** - users.

Services:
- **auth-header.js** - adds authentication header,
- **auth.service.js** - authenticate users.
