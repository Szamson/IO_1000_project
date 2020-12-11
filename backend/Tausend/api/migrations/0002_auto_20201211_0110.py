# Generated by Django 3.1.4 on 2020-12-11 00:10

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='room',
            name='number_of_players',
        ),
        migrations.AlterField(
            model_name='room',
            name='code',
            field=models.CharField(default=api.models.generate_code, max_length=12, unique=True),
        ),
    ]
