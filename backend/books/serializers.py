from rest_framework import serializers
from .models import Book, BookActivity


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book

        fields = [
            "pk",
            "isbn",
            "title",
            "author",
            "description",
            "on_site",
        ]
        extra_kwargs = {
            "isbn": {"required": True},
            "title": {"required": True},
            "author": {"required": True},
        }

        read_only_fields = ["pk", "on_site"]


class BookActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookActivity

        fields = ["pk", "type", "created_at"]
        read_only_fields = fields

    type = serializers.SerializerMethodField()

    def get_type(self, obj):
        return obj.get_type_display()
