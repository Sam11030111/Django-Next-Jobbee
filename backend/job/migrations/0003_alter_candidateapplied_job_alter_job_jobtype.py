# Generated by Django 5.1.1 on 2024-09-11 17:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0002_candidateapplied'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidateapplied',
            name='job',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='candidates', to='job.job'),
        ),
        migrations.AlterField(
            model_name='job',
            name='jobType',
            field=models.CharField(choices=[('Permanent', 'Permanent'), ('Temporary', 'Temporary'), ('Internship', 'Internship')], default='Permanent', max_length=10),
        ),
    ]
