import os
import sys
sys.path.insert(0, os.path.abspath('.'))
extensions = [ 'sphinx.ext.autodoc' ]
autodoc_default_options = {
    'members': True,
    'show-inheritance': True,
}
