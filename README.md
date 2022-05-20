This is [Luis Alvarez's](mailto:lalvarezguillen@gmail.com) solution to Psychology Today's tech challenge.

## Challenge

* Using whichever language(s)/stack that is best suited, create a library management system per the requirements below. Please submit your code via a publicly available repository.

Library management system
* API for CRUD of a books, managing title, author, isbn, description
* Ability to manage books through a web interface
* Ability to check in and check out a book
* Ability to track state changes for a book
* Report that contains the current state of all books

## Backend

1. Install dependencies
```
pip install -r requirements.txt
```

2. Test it

```
pytest -v
```

3. Run it
```
python manage.py migrate
python manage.py runserver
```

## Frontend

1. Install dependencies
```
npm i
```

2. Run it
```
npm start
```
