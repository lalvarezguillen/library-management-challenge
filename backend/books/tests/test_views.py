from django.urls import reverse
from rest_framework import status

from model_bakery import baker
import pytest

from ..models import Book, BookActivity

# This grants DB access to all the tests in this module.
# It also makes sure that operations that need to be wrapped in
# DB Transactions are wrapped in DB Transactions. Failing otherwise
pytestmark = pytest.mark.django_db(transaction=True)


class TestCreateBook:
    url = reverse("book-list")

    def test_success(self, client):
        body = {
            "title": "The Prince",
            "author": "Niccolò Machiavelli",
            "isbn": "9780023042706",
        }
        resp = client.post(self.url, body)

        assert resp.status_code == status.HTTP_201_CREATED

    @pytest.mark.parametrize(
        "body,missing_field",
        [
            [
                {
                    "title": "The Prince",
                    "author": "Niccolò Machiavelli",
                },
                "isbn",
            ],
            [
                {
                    "isbn": "9780023042706",
                    "author": "Niccolò Machiavelli",
                },
                "title",
            ],
            [
                {
                    "isbn": "9780023042706",
                    "name": "The Prince",
                },
                "author",
            ],
        ],
    )
    def test_invalid_request_handling(self, body, missing_field, client):
        resp = client.post(self.url, body)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST

        resp_body = resp.json()
        assert resp_body[missing_field] == ["This field is required."]


class TestListBooks:
    url = reverse("book-list")

    def test_success(self, client):
        books_count = 4
        books = baker.make(Book, books_count)

        resp = client.get(self.url)
        assert resp.status_code == status.HTTP_200_OK

        resp_body = resp.json()
        assert len(resp_body["results"]) == books_count

        for book in books:
            in_response = [el for el in resp_body["results"] if el["isbn"] == book.isbn]
            assert len(in_response) == 1

    def test_empty_set(self, client):
        resp = client.get(self.url)
        assert resp.status_code == status.HTTP_200_OK

        resp_body = resp.json()
        assert len(resp_body["results"]) == 0

    def test_pagination_works(self, client, settings):
        books_count = 40
        baker.make(Book, books_count)

        resp = client.get(self.url)
        assert resp.status_code == status.HTTP_200_OK

        resp_body = resp.json()
        assert len(resp_body["results"]) == settings.REST_FRAMEWORK["PAGE_SIZE"]
        assert resp_body["count"] == books_count
        assert resp_body["next"]


class TestGetBook:
    def test_success(self, client):
        book = baker.make(Book)

        url = reverse("book-detail", kwargs={"pk": book.pk})
        resp = client.get(url)
        assert resp.status_code == status.HTTP_200_OK

        resp_body = resp.json()
        assert resp_body["isbn"] == book.isbn

    def test_not_found(self, client):
        url = reverse("book-detail", kwargs={"pk": 9000})
        resp = client.get(url)
        assert resp.status_code == status.HTTP_404_NOT_FOUND


class TestUpdateBook:
    def test_full_update_succeeds(self, client):
        book = baker.make(
            Book,
            title="The Prince",
            isbn="9780023042706",
            author="Niccolò Machiavelli",
        )
        new_author = "Nicolas Maquiavelo"

        req_body = {
            "author": new_author,
            "isbn": book.isbn,
            "title": book.title,
        }
        url = reverse("book-detail", kwargs={"pk": book.pk})
        resp = client.put(url, req_body, content_type="application/json")

        assert resp.status_code == status.HTTP_200_OK

        resp_body = resp.json()
        assert resp_body["author"] == new_author != book.author
        assert resp_body["title"] == book.title
        assert resp_body["isbn"] == book.isbn

        book.refresh_from_db()
        assert book.author == new_author

    def test_full_update_fails_if_fields_are_missing(self, client):
        book = baker.make(
            Book,
            title="The Prince",
            isbn="9780023042706",
            author="Niccolò Machiavelli",
        )
        new_author = "Nicolas Maquiavelo"

        req_body = {
            "author": new_author,
        }
        url = reverse("book-detail", kwargs={"pk": book.pk})
        resp = client.put(url, req_body, content_type="application/json")

        assert resp.status_code == status.HTTP_400_BAD_REQUEST

        resp_body = resp.json()
        assert resp_body["isbn"] == ["This field is required."]

        book.refresh_from_db()
        assert book.author != new_author

    def test_partial_update_succeeds(self, client):
        book = baker.make(
            Book,
            title="The Prince",
            isbn="9780023042706",
            author="Niccolò Machiavelli",
        )
        new_author = "Nicolas Maquiavelo"

        req_body = {
            "author": new_author,
        }
        url = reverse("book-detail", kwargs={"pk": book.pk})
        resp = client.patch(url, req_body, content_type="application/json")

        assert resp.status_code == status.HTTP_200_OK

        resp_body = resp.json()
        assert resp_body["author"] == new_author != book.author
        assert resp_body["title"] == book.title
        assert resp_body["isbn"] == book.isbn

        book.refresh_from_db()
        assert book.author == new_author


class TestDeleteBook:
    def test_succeeds(self, client):
        book = baker.make(
            Book,
            title="The Prince",
            isbn="9780023042706",
            author="Niccolò Machiavelli",
        )

        url = reverse("book-detail", kwargs={"pk": book.pk})
        resp = client.delete(url)

        assert resp.status_code == status.HTTP_204_NO_CONTENT

        assert not Book.objects.filter(pk=book.pk).exists()

    def test_book_doesnt_exist(self, client):
        book_pk = 9000

        url = reverse("book-detail", kwargs={"pk": book_pk})
        resp = client.delete(url)

        assert resp.status_code == status.HTTP_404_NOT_FOUND


class TestCheckOutBook:
    def test_success(self, client):
        # book is on-premise, so it can be checked out
        book = baker.make(Book, on_site=True)

        url = reverse("book-check-out", kwargs={"pk": book.pk})
        resp = client.post(url)
        assert resp.status_code == status.HTTP_200_OK

        book.refresh_from_db()
        assert book.on_site == False

        activity = list(BookActivity.objects.filter(book=book))
        assert len(activity) == 1
        assert activity[0].type == BookActivity.CHECKOUT_TYPE

    def test_fails_if_already_checked_out(self, client):
        # book is not on-premise, so it cannot be checked out
        book = baker.make(Book, on_site=False)

        url = reverse("book-check-out", kwargs={"pk": book.pk})
        resp = client.post(url)
        assert resp.status_code == status.HTTP_400_BAD_REQUEST

        resp_body = resp.json()
        assert resp_body == ["Book is already checked out"]

        book.refresh_from_db()
        assert book.on_site == False

    def test_fails_if_book_doesnt_exist(self, client):
        url = reverse("book-check-out", kwargs={"pk": 9000})
        resp = client.post(url)
        assert resp.status_code == status.HTTP_404_NOT_FOUND


class TestCheckInBook:
    def test_success(self, client):
        # book is not on-premise, so it can be checked in
        book = baker.make(Book, on_site=False)

        url = reverse("book-check-in", kwargs={"pk": book.pk})
        resp = client.post(url)
        assert resp.status_code == status.HTTP_200_OK

        book.refresh_from_db()
        assert book.on_site == True

        activity = list(BookActivity.objects.filter(book=book))
        assert len(activity) == 1
        assert activity[0].type == BookActivity.CHECKIN_TYPE

    def test_fails_if_already_checked_in(self, client):
        # book is on-premise, so it makes no sense to check it in.
        book = baker.make(Book, on_site=True)

        url = reverse("book-check-in", kwargs={"pk": book.pk})
        resp = client.post(url)
        assert resp.status_code == status.HTTP_400_BAD_REQUEST

        resp_body = resp.json()
        assert resp_body == ["Book is already checked in"]

        book.refresh_from_db()
        assert book.on_site == True

    def test_fails_if_book_doesnt_exist(self, client):
        url = reverse("book-check-in", kwargs={"pk": 9000})
        resp = client.post(url)
        assert resp.status_code == status.HTTP_404_NOT_FOUND


class TestListActivity:
    def test_success(self, client):
        book = baker.make(Book, on_site=True)

        check_out_url = reverse("book-check-out", kwargs={"pk": book.pk})
        check_out_resp = client.post(check_out_url)
        assert check_out_resp.status_code == status.HTTP_200_OK

        check_in_url = reverse("book-check-in", kwargs={"pk": book.pk})
        check_in_resp = client.post(check_in_url)
        assert check_in_resp.status_code == status.HTTP_200_OK

        activity_url = reverse(
            "book-activity-list", kwargs={"parent_lookup_id": book.id}
        )
        activity_resp = client.get(activity_url)
        assert activity_resp.status_code == status.HTTP_200_OK

        resp_body = activity_resp.json()
        assert len(resp_body["results"]) == 2  # a check-out and a check-in

        assert resp_body["results"][0]["type"] == "check-in"
        assert resp_body["results"][1]["type"] == "check-out"

    def test_no_activity(self, client):
        book = baker.make(Book)

        url = reverse("book-activity-list", kwargs={"parent_lookup_id": book.id})
        resp = client.get(url)
        assert resp.status_code == status.HTTP_200_OK

        resp_body = resp.json()
        assert len(resp_body["results"]) == 0

    def test_response_is_paginated(self, client, settings):
        book = baker.make(Book)
        activity_entries_count = 40
        activity = baker.make(BookActivity, activity_entries_count, book=book)

        url = reverse("book-activity-list", kwargs={"parent_lookup_id": book.id})
        resp = client.get(url)
        assert resp.status_code == status.HTTP_200_OK

        resp_body = resp.json()
        assert len(resp_body["results"]) == settings.REST_FRAMEWORK["PAGE_SIZE"]
        assert resp_body["count"] == activity_entries_count
        assert resp_body["next"]
