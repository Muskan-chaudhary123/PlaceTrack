import json
from rest_framework import serializers

class ChecklistItemSerializer(serializers.Serializer):
    id = serializers.CharField(required=False)
    text = serializers.CharField(max_length=500)
    completed = serializers.BooleanField(default=False)

class ResourceSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    title = serializers.CharField(max_length=200, required=True)
    category = serializers.CharField(max_length=100, default='Personal')
    type = serializers.CharField(max_length=50, default='Note')
    description = serializers.CharField(required=False, allow_blank=True, default='')
    content = serializers.CharField(required=False, allow_blank=True, default='')
    emailSubject = serializers.CharField(required=False, allow_blank=True, default='')
    url = serializers.CharField(required=False, allow_blank=True, default='')
    checklistItems = serializers.ListField(
        child=ChecklistItemSerializer(),
        required=False,
        default=list
    )
    file = serializers.DictField(read_only=True, required=False, allow_null=True)
    tags = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    favorite = serializers.BooleanField(required=False, default=False)
    usageCount = serializers.IntegerField(required=False, default=0)
    createdAt = serializers.CharField(read_only=True, required=False)
    updatedAt = serializers.CharField(read_only=True, required=False)
    lastUsedAt = serializers.CharField(read_only=True, required=False, allow_null=True)

    def to_internal_value(self, data):
        # If incoming from QueryDict (multipart/form-data), convert to standard dict
        if hasattr(data, 'dict'):
            mutable_data = data.dict()
        else:
            mutable_data = dict(data)

        if 'checklistItems' in mutable_data and isinstance(mutable_data['checklistItems'], str):
            try:
                parsed_chk = json.loads(mutable_data['checklistItems'])
                mutable_data['checklistItems'] = parsed_chk if isinstance(parsed_chk, list) else []
            except Exception:
                mutable_data['checklistItems'] = []

        if 'tags' in mutable_data:
            if isinstance(mutable_data['tags'], str):
                try:
                    parsed_tags = json.loads(mutable_data['tags'])
                    mutable_data['tags'] = parsed_tags if isinstance(parsed_tags, list) else [str(parsed_tags)]
                except Exception:
                    mutable_data['tags'] = [t.strip() for t in mutable_data['tags'].split(',') if t.strip()]
            elif not isinstance(mutable_data['tags'], list):
                mutable_data['tags'] = list(mutable_data['tags'])

        if 'favorite' in mutable_data and isinstance(mutable_data['favorite'], str):
            mutable_data['favorite'] = mutable_data['favorite'].lower() in ('true', '1')

        return super().to_internal_value(mutable_data)

