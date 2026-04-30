# URL Shortener

`Повноцінний fullstack-проєкт для скорочення посилань з авторизацією користувача та базовою аналітикою.`

## Що це за проєкт

`URL Shortener` дозволяє:
- реєструватися та входити в акаунт;
- створювати короткі посилання;
- переглядати список своїх посилань;
- відстежувати кліки та базову статистику по URL.

Проєкт поділений на два застосунки:
- `backend` на Django (API, бізнес-логіка, робота з БД);
- `frontend` на React + Vite (інтерфейс користувача).

## Запуск

### 1) Backend (Django)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r ..\requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend буде доступний за адресою: `http://127.0.0.1:8000/`

### 2) Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend буде доступний за адресою: `http://localhost:5173/`

## Структура

- `backend/config` - налаштування Django, роутинг, WSGI/ASGI.
- `backend/accounts` - реєстрація, логін, JWT refresh/logout, профіль користувача.
- `backend/shortener` - створення коротких URL, логіка скорочення, API для посилань.
- `backend/main` - базові представлення та допоміжна логіка.
- `frontend/src/api` - клієнтські API-запити (axios), auth та URL API.
- `frontend/src/pages` - сторінки застосунку (`Main`, `Dashboard`).
- `frontend/src/components` - UI-компоненти та layout.
- `frontend/src/contexts` - контекст авторизації.
- `frontend/src/hooks` - кастомні хуки для auth та URL.

## Технології

### Backend
- Python 3
- Django 5
- Django REST Framework
- JWT (SimpleJWT)
- SQLite (поточна БД за замовчуванням)

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- Axios
- ESLint
