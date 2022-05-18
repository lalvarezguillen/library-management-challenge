from django.urls import path, include
from rest_framework_extensions.routers import (
    ExtendedDefaultRouter,
)


from .views import BookActivityViewSet, BooksViewSet

router = ExtendedDefaultRouter()
books_router = router.register("books", BooksViewSet, basename="book")
books_router.register(
    "activity",
    BookActivityViewSet,
    basename="book-activity",
    parents_query_lookups=["id"],
)
urlpatterns = [path("", include(router.urls))]
