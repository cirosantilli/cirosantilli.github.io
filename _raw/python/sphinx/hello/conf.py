import os
import sys
sys.path.insert(0, os.path.abspath('.'))
extensions = [ 'sphinx.ext.autodoc' ]
autodoc_default_options = {
    # Otherwise `.. automodule:: main` does not automatically show all members,
    # you'd have to list them one by one.
    'members': True,
}
