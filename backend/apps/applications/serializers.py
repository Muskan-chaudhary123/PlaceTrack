from rest_framework import serializers

class ApplicationSerializer(serializers.Serializer):
    """
    Serializer mapping MongoDB document formats to React keys and handling validations.
    """
    id = serializers.CharField(read_only=True)
    companyName = serializers.CharField(required=True, max_length=100, error_messages={'blank': 'Company name is required.'})
    role = serializers.CharField(required=True, max_length=100, error_messages={'blank': 'Role title is required.'})
    location = serializers.CharField(required=False, allow_blank=True, max_length=100, default='')
    workMode = serializers.ChoiceField(
        choices=['On-site', 'Hybrid', 'Remote', 'Not Specified'],
        default='Not Specified'
    )
    status = serializers.ChoiceField(
        choices=['Applied', 'OA', 'Interview', 'Rejected', 'Selected', 'Withdrawn'],
        required=True
    )
    appliedDate = serializers.CharField(required=True, error_messages={'blank': 'Applied date is required.'})
    deadline = serializers.CharField(required=False, allow_blank=True, default='')
    jobLink = serializers.CharField(required=False, allow_blank=True, default='')
    jobId = serializers.CharField(required=False, allow_blank=True, max_length=50, default='')
    salary = serializers.CharField(required=False, allow_blank=True, max_length=50, default='')
    source = serializers.ChoiceField(
        choices=['Company Website', 'LinkedIn', 'Referral', 'Job Portal', 'College', 'Recruiter', 'Other'],
        default='Company Website'
    )
    referral = serializers.ChoiceField(
        choices=['Yes', 'No'],
        default='No'
    )
    resume = serializers.CharField(required=False, allow_blank=True, default='')
    notes = serializers.CharField(required=False, allow_blank=True, default='')
    recruiter = serializers.CharField(required=False, allow_blank=True, default='')

    def validate_jobLink(self, value):
        if value and not (value.startswith('http://') or value.startswith('https://')):
            raise serializers.ValidationError("Enter a valid URL (starting with http:// or https://).")
        return value

    def to_representation(self, instance):
        """
        Converts MongoDB document keys to React representation layout.
        """
       
        ref_obj = instance.get('referral', {})
        has_ref = ref_obj.get('hasReferral', False) if isinstance(ref_obj, dict) else False

        
        created_at = instance.get('createdAt')
        updated_at = instance.get('updatedAt')
        created_str = created_at.isoformat() if hasattr(created_at, 'isoformat') else str(created_at or '')
        updated_str = updated_at.isoformat() if hasattr(updated_at, 'isoformat') else str(updated_at or '')

        return {
            'id': str(instance.get('_id')),
            'companyName': instance.get('company', ''),
            'role': instance.get('role', ''),
            'location': instance.get('location', ''),
            'workMode': instance.get('workMode', 'Not Specified'),
            'status': instance.get('status', 'Applied'),
            'appliedDate': instance.get('appliedDate', ''),
            'deadline': instance.get('deadline', ''),
            'jobLink': instance.get('jobUrl', ''),
            'jobId': instance.get('jobId', ''),
            'salary': instance.get('salary', ''),
            'source': instance.get('source', 'Company Website'),
            'referral': 'Yes' if has_ref else 'No',
            'resume': instance.get('resume', ''),
            'notes': instance.get('notes', ''),
            'recruiter': instance.get('recruiter', ''),
            'createdAt': created_str,
            'updatedAt': updated_str
        }

    def to_internal_value(self, data):
        """
        Converts input data containing React keys to validation form.
        """
        validated_data = super().to_internal_value(data)
        return validated_data
