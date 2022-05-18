from django.db import transaction
from .models import Book, BookActivity


@transaction.atomic()
def check_in(book_id: int) -> BookActivity:
    book = Book.objects.select_for_update().get(pk=book_id)

    if book.on_site:
        raise BadBookStateError()

    book.on_site = True
    book.save()

    return BookActivity.objects.create(
        book=book,
        type=BookActivity.CHECKIN_TYPE,
    )


@transaction.atomic()
def check_out(book_id: int) -> BookActivity:
    book = Book.objects.select_for_update().get(pk=book_id)

    if not book.on_site:
        raise BadBookStateError()

    book.on_site = False
    book.save()

    return BookActivity.objects.create(
        book=book,
        type=BookActivity.CHECKOUT_TYPE,
    )


class BadBookStateError(Exception):
    pass
