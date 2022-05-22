from django.db import models


class Book(models.Model):
    # TODO: use ISBNField https://github.com/secnot/django-isbn-field
    # or add ISBN validation https://en.wikipedia.org/wiki/ISBN#Check_digits
    isbn = models.CharField(max_length=13)

    title = models.CharField(max_length=1024)

    # Would be FK ideally
    author = models.CharField(max_length=1024)

    description = models.CharField(max_length=2048, default="")

    on_site = models.BooleanField(default=True)


class BookActivity(models.Model):
    CHECKOUT_TYPE = 0
    CHECKIN_TYPE = 1
    TYPE_CHOICES = ((CHECKOUT_TYPE, "check-out"), (CHECKIN_TYPE, "check-in"))

    book = models.ForeignKey(Book, on_delete=models.CASCADE)

    # making this field an int allows renaming the human-readable
    # version if necessary, w/o having to touch schema
    type = models.PositiveSmallIntegerField(choices=TYPE_CHOICES)

    # TODO: timestamp might be a more fitting name
    created_at = models.DateTimeField(auto_now_add=True)
