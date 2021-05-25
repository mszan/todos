# Todos

## General info
**Todos** is a web app built with ReactJS and ExpressJS that allows users to add, modify and delete tasks.
![](https://i.imgur.com/Yizgeld.png)
<details>
  <summary>Desktop screenshots:</summary>
  
![](https://i.imgur.com/43D3AeG.png)

![](https://i.imgur.com/ZKq8QY2.png)

![](https://i.imgur.com/NzBw6xt.png)

![](https://i.imgur.com/8q8g40J.png)
</details>

## Live demo
Live demo is available at [todos.mszanowski.pl](https://todos.mszanowski.pl).

## Project structure

### Backend
Backend uses ExpressJS along with MySQL and JWT.

Routes:
- **_api.js** - wrapper for every route,
- **authorization.js** - user registration and JWT,
- **public.js** - public information (no login required),
- **tasks.js** - todo tasks,
- **users.js** - users.

### Frontend
Frontend uses ReactJS along with Ant Design and Ant Motion.

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

## Environment variables

- **TODOS_MYSQL_ROOT_PASSWORD**, e.g. *some_passwd*
- **TODOS_ACCESS_TOKEN_SECRET**, e.g. *some_access_secret*
- **TODOS_REFRESH_TOKEN_SECRET**, e.g. *some_refresh_secret*
- **TODOS_REACT_APP_API_URL**, e.g. *http://localhost:7085/api/*
