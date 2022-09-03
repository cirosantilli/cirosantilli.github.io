import os
import sys
sys.path.insert(0, os.path.abspath('.'))
extensions = [ 'sphinx.ext.autodoc' ]
autodoc_default_options = {
    'members': True,
    # Does now show base classes otherwise... why such bad defaults?
    # But with this it does show useless bases like `object`. What is one to do?
    'show-inheritance': True,
}
