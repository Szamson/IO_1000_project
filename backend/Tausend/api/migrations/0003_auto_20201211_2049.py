# Generated by Django 3.1.4 on 2020-12-11 19:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20201211_1924'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='inactive_player',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='room',
            name='host',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='room',
            name='player_1',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='room',
            name='player_2',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='room',
            name='player_3',
            field=models.CharField(max_length=50, null=True),
        ),
    ]