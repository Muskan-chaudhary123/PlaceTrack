from rest_framework import serializers

class QuestionSettingsSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    subjects = serializers.ListField(child=serializers.CharField(), required=True)
    topics = serializers.DictField(child=serializers.ListField(child=serializers.CharField()), required=True)
    customColumns = serializers.ListField(child=serializers.DictField(), required=False, default=list)

class QuestionSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    subject = serializers.CharField(required=True, max_length=100)
    topic = serializers.CharField(required=True, max_length=100)
    question = serializers.CharField(required=True, max_length=500)
    difficulty = serializers.ChoiceField(choices=["Easy", "Medium", "Hard"], default="Medium")
    revision = serializers.BooleanField(default=False)
    revisit = serializers.BooleanField(default=False)
    customValues = serializers.DictField(required=False, default=dict)
    createdAt = serializers.CharField(read_only=True)
    updatedAt = serializers.CharField(read_only=True)
