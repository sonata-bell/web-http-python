import sys

import requests

res = requests.post('http://localhost:8080/data-http',
                    data={'data': sys.argv[1]})

print(res.text)
