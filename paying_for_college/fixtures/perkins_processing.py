from csvkit import CSVKitDictReader as cdr

with open('perkins_schools.csv', 'r') as f:
    reader = cdr(f)
    data = [row for row in reader]

misses = []

def tag_schools(data):
    
