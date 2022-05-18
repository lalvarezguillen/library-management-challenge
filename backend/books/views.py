from django.core.exceptions import ObjectDoesNotExist
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework_extensions.mixins import NestedViewSetMixin

from .serializers import BookActivitySerializer, BookSerializer
from .models import Book, BookActivity
from .services import BadBookStateError, check_in, check_out


class BooksViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    BooksViewSet provides CRUD handlers for the Book entity,
    through the expected POST, GET, PUT/PATCH and DELETE methods.

    It also allows checking in and out books through
    POST calls to /books/<pk>/check-in/ and /books/<pk>/check-out/
    respectively.
    """

    serializer_class = BookSerializer
    queryset = Book.objects.all()

    @action(detail=True, methods=["POST"], url_path="check-out")
    def check_out(self, request, pk=None):
        try:
            activity = check_out(pk)
        except BadBookStateError:
            raise ValidationError("Book is already checked out")
        except ObjectDoesNotExist:
            raise NotFound

        serialized = self.get_serializer(activity.book)
        return Response(serialized.data)

    @action(detail=True, methods=["POST"], url_path="check-in")
    def check_in(self, request, pk=None):
        try:
            activity = check_in(pk)
        except BadBookStateError:
            raise ValidationError("Book is already checked in")
        except ObjectDoesNotExist:
            raise NotFound

        serialized = self.get_serializer(activity.book)
        return Response(serialized.data)


class BookActivityViewSet(
    NestedViewSetMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    """
    This ViewSet allows listing the books state changes through GET
    calls to GET /books/<pk>/activity/
    """

    parent_entity_class = Book
    serializer_class = BookActivitySerializer

    def get_parent_entity_queryset(self):
        return self.parent_entity_class.objects.all()

    def get_parent_entity(self):
        qs = self.get_parent_entity_queryset()
        entity_id = self.kwargs["parent_lookup_id"]
        return get_object_or_404(qs, pk=entity_id)

    def get_queryset(self):
        parent_entity = self.get_parent_entity()
        qs = BookActivity.objects.filter(book=parent_entity)
        return qs.order_by("-pk")
