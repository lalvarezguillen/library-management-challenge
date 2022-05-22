This is [Luis Alvarez's](mailto:lalvarezguillen@gmail.com) solution to Psychology Today's tech challenge.

# Challenge

* Using whichever language(s)/stack that is best suited, create a library management system per the requirements below. Please submit your code via a publicly available repository.

Library management system
* API for CRUD of a books, managing title, author, isbn, description
* Ability to manage books through a web interface
* Ability to check in and check out a book
* Ability to track state changes for a book
* Report that contains the current state of all books

# Solution
## Running the project

The project requires Docker Compose for running. See https://docs.docker.com/compose/install/

Run it with

```
docker-compose up
```

The frontend can be accessed through `http://localhost:8080`

And the API through `http://localhost:8080/api/`

## Testing the project:

### Backend:
```
cd backend
pip install -r requirements.txt
pytest -v
```

### Frontend
```
cd frontend
npm i
npm run test
```

## Tech decisions
* I picked the [Django Rest Framework stack](https://www.django-rest-framework.org/) for the backend, because it excels at CRUD tasks like this one. And allowed me to get the whole backend built in minutes.
* I picked React + [React Query](https://react-query.tanstack.com/) on the frontend because I wanted to try out React Query
* I picked Caddy to serve the project because of its configuration simplicity.
* I deferred to prettier and black for code styling
* In order to avoid sinking a ton of time into it, I cut the following corners:
   * I left out some error feedback and loading cues on some frontend areas
   * I didn't configure the backend to return camel-cased JSON, which translates into some casing inconsistencies on the frontend's code (it has to handle some snake-cased props)
   * I left out ISBN validation, to prevent having to look for valid ISBNs when
   testing
   * I did not include e2e/integration tests (ie: selenium, cypress, etc)
   * I hard-coded most of the docker and docker-compose bits (ie: we're unable to easily change port mappings, DB urls, etc)
   * I stuck with sqlite on the backend tests, even though the backend uses Postgres for actually running (that kind of discrepancy is not recommended)
   * I didn't model Author as a separate entity related to Books.
   * I didn't adopt a frontend validation library like [yup](https://github.com/jquense/yup). As the backend validation is comprehensive and communicated through the UI.