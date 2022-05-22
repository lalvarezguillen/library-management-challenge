This is [Luis Alvarez's](mailto:lalvarezguillen@gmail.com) solution to Psychology Today's tech challenge.

## Challenge

* Using whichever language(s)/stack that is best suited, create a library management system per the requirements below. Please submit your code via a publicly available repository.

Library management system
* API for CRUD of a books, managing title, author, isbn, description
* Ability to manage books through a web interface
* Ability to check in and check out a book
* Ability to track state changes for a book
* Report that contains the current state of all books

## Running the project

The project requires Docker Compose for running. See https://docs.docker.com/compose/install/

Run it with

```
docker-compose up
```

The frontend can be accessed through `http://localhost:8080`

And the API through `http://localhost:8080/api/`