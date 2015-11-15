# from django.core.management.commands.loaddata import SingleZipReader

# open_method, mode = self.compression_formats[cmp_fmt]
#             fixture = open_method(fixture_file, mode)

# class SingleZipReader(zipfile.ZipFile):

#     def __init__(self, *args, **kwargs):
#         zipfile.ZipFile.__init__(self, *args, **kwargs)
#         if len(self.namelist()) != 1:
#             raise ValueError("Zip-compressed fixtures must contain 1 file.")

#     def read(self):
#         return zipfile.ZipFile.read(self, self.namelist()[0])
