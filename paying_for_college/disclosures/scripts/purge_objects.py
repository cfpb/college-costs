from paying_for_college.models import Notification, Program

error_msg = "Only Notification and Program objects may be purged"
no_args_msg = ("You must supply an object type to purge, "
               "either notifications or programs")
object_map = {
    'notifications': Notification,
    'programs': Program
}


def purge(objects):
    """purge notification or program data"""
    objects = objects.lower()
    if not objects:
        return no_args_msg
    if objects not in object_map.keys():
        return error_msg
    msg = "Purging {} {}".format(object_map[objects].objects.count(), objects)
    object_map[objects].objects.all().delete()
    return msg
